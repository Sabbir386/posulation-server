import httpStatus from 'http-status';
import mongoose from 'mongoose';

import AppError from '../errors/AppError';
import { User } from '../User/user.model';
import QueryBuilder from '../builder/QueryBuilder';
import { NormalUser } from './normalUser.model';
import { NormalUserSearchableFields } from './normalUser.constant';
import { TNormalUser } from './normalUser.interface';

const getAllNormalUsersFromDB = async (query: Record<string, unknown>) => {
  const normalUserQuery = new QueryBuilder(
    NormalUser.find({ isDeleted: false }).select(
      '_id id user designation name country device gender dateOfBirth email contactNo emergencyContactNo bloodGroup presentAddress permanentAddress profileImg isDeleted'
    ), // Select specific fields and filter by isDeleted
    query
  )
    .search(NormalUserSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await normalUserQuery.modelQuery;
  const meta = await normalUserQuery.countTotal();
  console.log(meta);
  return {
    result,
    meta,
  };
};

const getSingleNormalUserFromDB = async (id: string) => {
  const result = await NormalUser.findOne({ user: id });
  return result;
};
const updateNormalUserIntoDB = async (
  userId: string,
  payload: Partial<TNormalUser>,
) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error('Invalid user ID format');
  }
  // Convert `userId` to an `ObjectId` for querying by the `user` field
  const userObjectId = new mongoose.Types.ObjectId(userId);

  // Find the user by the `user` field and update
  const result = await NormalUser.findOneAndUpdate(
    { user: userObjectId }, // Match based on `user` field with `ObjectId`
    payload,
    {
      new: true,
      runValidators: true,
    }
  );

  return result;
};

const deleteNormalUserFromDB = async (id: string) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const deletedNormalUser = await NormalUser.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true, session },
    );

    if (!deletedNormalUser) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Failed to delete normal user',
      );
    }

    // get user _id from deletedNormalUser
    const userId = deletedNormalUser.user;

    const deletedUser = await User.findByIdAndDelete(userId, { session });

    if (!deletedUser) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete user');
    }

    await session.commitTransaction();
    await session.endSession();

    return deletedNormalUser;
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};

export const NormalUserServices = {
  getAllNormalUsersFromDB,
  getSingleNormalUserFromDB,
  updateNormalUserIntoDB,
  deleteNormalUserFromDB,
};
