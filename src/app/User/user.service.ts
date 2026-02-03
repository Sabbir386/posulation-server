/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import AppError from '../errors/AppError';
import { TUser } from './user.interface';
import { User } from './user.model';
import { Admin } from '../Admin/admin.model';
import { TAdmin } from '../Admin/admin.interface';
import config from '../config';
import mongoose from 'mongoose';
import crypto from 'crypto';
import {
  generateAdminId,
  generateAdvertiserId,
  generateid,
  generateTenantIdFromUsers,
} from './user.utils';
import { sendImageToCloudinary } from '../utilis/sendImageToCloudinary';
import { NormalUser } from '../NormalUser/normalUser.model';
import { VerificationToken } from './VerificationToken.model';
import { sendVerificationEmail } from './emailService';
import { TNormalUser } from '../NormalUser/normalUser.interface';

const createUserIntoDb = async (
  file: any,
  password: string,
  payload: TNormalUser,
) => {
  const userData: Partial<TUser> = {};
  userData.password = password || 'defaultPassword';
  userData.role = 'user';
  userData.isDeleted = false;
  userData.email = payload.email;

  // ✅ NEW: generate tenantId from last user (t-0002 -> t-0003 -> ...)
  userData.tenantId = payload.tenantId ?? (await generateTenantIdFromUsers());
  payload.tenantId = userData.tenantId;

  userData.isVerified = false; // Set user verification status to false

  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    // Generate unique ID and referral ID
    userData.id = await generateid();
    userData.referralId = `CZ${userData.id}`;
    payload.referralId = userData.referralId;

    // Handle referredBy logic
    if (!payload.referredBy) {
      payload.referredBy = 'self';
    } else {
      const referrer = await User.findOne({ referralId: payload.referredBy }).session(session);

      if (!referrer) {
        console.warn(`Invalid referral ID (${payload.referredBy}). Defaulting to 'self'.`);
        payload.referredBy = 'self';
      } else {
        const userUpdateResult = await User.updateOne(
          { _id: referrer._id },
          { $inc: { refferCount: 1 } },
          { session }
        );
        const normalUserUpdateResult = await NormalUser.updateOne(
          { user: referrer._id },
          { $inc: { refferCount: 1 } },
          { session }
        );
        if (!userUpdateResult.modifiedCount || !normalUserUpdateResult.modifiedCount) {
          console.error(`Failed to increment referrer count for: ${referrer._id}`);
          throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to update referrer counts');
        }
      }
    }

    // Set referredBy field in userData
    userData.referredBy = payload.referredBy;

    // Check if the device fingerprint is already registered
    // const existingUserByFingerprint = await NormalUser.findOne({ deviceFingerprint: payload.deviceFingerprint }).session(session);

    // if (existingUserByFingerprint) {
    //   throw new AppError(httpStatus.CONFLICT, 'This device is already associated with an account.');
    // }

    // // Ensure the fingerprint is added to the payload
    // payload.deviceFingerprint = payload.deviceFingerprint;

    // Handle image upload if file is provided
    if (file) {
      const imageName = `${userData.id}${payload?.name || 'default'}`;
      const path = file?.path;

      if (!path || typeof path !== 'string') {
        throw new AppError(httpStatus.BAD_REQUEST, 'File path is required and must be a string');
      }

      const { secure_url } = await sendImageToCloudinary(imageName, path);
      payload.profileImg = secure_url as string;
    }

    // ✅ NEW: retry loop to avoid duplicate tenantId collision under concurrent requests
    let newUser: any[] = [];
    let newNormalUser: any[] = [];

    for (let attempt = 0; attempt < 5; attempt++) {
      try {
        // On retry, regenerate tenantId
        if (attempt > 0) {
          userData.tenantId = await generateTenantIdFromUsers();
          payload.tenantId = userData.tenantId;
        }

        // Create User document
        newUser = await User.create([userData], { session });
        if (!newUser.length) throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create User');

        // Create NormalUser document
        payload.id = newUser[0].id;
        payload.user = newUser[0]._id;
        payload.refferCount = 0; // Initialize new user's refferCount to 0

        newNormalUser = await NormalUser.create([payload], { session });
        if (!newNormalUser.length) throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create NormalUser');

        break; // ✅ success
      } catch (err: any) {
        // Duplicate tenantId -> retry
        if (err?.code === 11000 && err?.keyPattern?.tenantId) {
          continue;
        }
        throw err;
      }
    }

    if (!newNormalUser.length) {
      throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, 'Could not generate unique tenantId');
    }

    // Generate a verification token
    const token = crypto.randomBytes(32).toString('hex');
    const verificationUrl = `${process.env.APP_URL}/verify-email?token=${token}`;
    await VerificationToken.create({
      userId: newUser[0]._id,
      token,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000),
    });

    // Send verification email
    await sendVerificationEmail(userData.email, verificationUrl);

    // Commit the transaction
    await session.commitTransaction();
    await session.endSession();

    return newNormalUser;
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();

    if (err.code === 11000 && err.keyPattern.email) {
      throw new AppError(httpStatus.CONFLICT, 'Email already exists');
    } else if (err.message.includes('device')) {
      throw new AppError(httpStatus.CONFLICT, err.message); // Specific error for device conflict
    }

    console.error('Unexpected error during user creation:', err);
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, 'An unexpected error occurred');
  }
};




const findByEmailIntoDb = async (email: string) => {
  const user = await User.findOne({ email }).populate({
    path: 'user',
    options: { strictPopulate: false },
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  return user;
};

const createAdminIntoDB = async (
  file: any,
  password: string,
  payload: TAdmin,
) => {
  const userData: Partial<TUser> = {};
  userData.password = password || (config.default_password as string);
  userData.role = 'admin';
  userData.email = payload.email;

  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    userData.id = await generateAdminId();

    // ✅ Fix: Assign a dummy unique referralId to avoid null duplicates
    userData.referralId = `ADMIN-${userData.id}`;

    if (file) {
      const imageName = `${userData.id}${payload?.name?.firstName}`;
      const path = file?.path;
      const { secure_url } = await sendImageToCloudinary(imageName, path);
      payload.profileImg = secure_url as string;
    }

    const newUser = await User.create([userData], { session });

    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create admin');
    }

    payload.id = newUser[0].id;
    payload.user = newUser[0]._id;

    const newAdmin = await Admin.create([payload], { session });

    if (!newAdmin.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create admin');
    }

    await session.commitTransaction();
    await session.endSession();

    return newAdmin;
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};


const getMe = async (id: string, role: string) => {
  let result = null;
  console.log('from get me service', id, role);
  if (role === 'user') {
    // result = await User.findOne({ id: id }).populate('user');
    result = await User.findOne({ id: id }).populate({
      path: 'user',
      options: { strictPopulate: false },
    });
  }
  if (role === 'admin') {
    // result = await Admin.findOne({ id: id }).populate('user');
    result = await Admin.findOne({ id: id }).populate({
      path: 'user',
      options: { strictPopulate: false },
    });
  }

  return result;
};

const changeStatus = async (id: string, payload: { status: string }) => {
  const result = await User.findByIdAndUpdate(id, payload, {
    new: true,
  });
  return result;
};
export const UserServices = {
  createUserIntoDb,
  createAdminIntoDB,
  getMe,
  changeStatus,
  findByEmailIntoDb,
};
