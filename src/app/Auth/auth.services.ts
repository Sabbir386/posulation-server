import httpStatus from 'http-status';

import { TLoginUser } from './auth.interface';
import jwt, { JwtPayload } from 'jsonwebtoken';

// import config from '../../config';
import { User } from '../User/user.model';
import bcrypt from 'bcrypt';
import AppError from '../errors/AppError';
import config from '../config';
import { createToken, verifyToken } from './auth.utils';
import { sendEmail } from '../utilis/sendEmail';
import { NormalUser } from '../NormalUser/normalUser.model';

const loginUser = async (
  payload: TLoginUser & { ip: string; deviceName: string },
) => {
  console.log('Login payload:', payload);

  const user = payload.id
    ? await User.isUserExistsByCustomId(payload.id)
    : await User.isUserExistsByEmail(payload.email);

  console.log('from login', user);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found!');
  }

  const id = user.id;
  if (!id) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'User ID is not defined',
    );
  }

  // Checking if the user is already deleted
  if (user.isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted!');
  }

  // Checking if the user is blocked
  if (user.status === 'inactive') {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked!');
  }

  // Checking if the password is correct
  if (!(await User.isPasswordMatched(payload.password, user.password))) {
    throw new AppError(httpStatus.FORBIDDEN, 'Password does not match');
  }

  // Create token and send to the client
  const jwtPayload = {
    id: id,
    role: user.role,
    email: user.email,
    objectId: user._id,
    tenantId: user.tenantId ?? null,
  };

  console.log('jwt payload', jwtPayload);
  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );

  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as string,
  );

  return {
    accessToken,
    refreshToken,
    needsPasswordChange: user.needsPasswordChange,
  };
};

const changePassword = async (
  userData: JwtPayload,
  payload: { oldPassword: string; newPassword: string },
) => {
  // checking if the user is exist
  console.log(userData);
  const user = await User.isUserExistsByCustomId(userData.id);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
  }
  // checking if the user is already deleted

  const isDeleted = user?.isDeleted;

  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted !');
  }

  // checking if the user is blocked

  const userStatus = user?.status;

  if (userStatus === 'inactive') {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked ! !');
  }

  //checking if the password is correct

  if (!(await User.isPasswordMatched(payload.oldPassword, user?.password)))
    throw new AppError(httpStatus.FORBIDDEN, 'Password do not matched');

  // Ensure id is defined before using it
  const id = user.id;
  if (!id) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'User ID is not defined',
    );
  }

  //hash new password
  const newHashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_saltround),
  );

  await User.findOneAndUpdate(
    {
      id: id, // Ensure id is used here
      role: userData.role,
    },
    {
      password: newHashedPassword,
      needsPasswordChange: false,
      passwordChangedAt: new Date(),
    },
  );

  return null;
};
// const refreshToken = async (token: string) => {
//   // const user = await User.isUserExistsByCustomId(payload.id);
//   // console.log('from login',user)
//   // const userObjectId = user?._id;
//   try {
//     // Checking if the given token is valid
//     const decoded = verifyToken(token, config.jwt_refresh_secret as string);

//     // Extracting id from the decoded token
//     const { id } = decoded;
//     console.log(id)
//     // const id = decoded.id as string;
//     const email = decoded.email as string;
//     // Checking if the user exists
//     const user = await User.isUserExistsByCustomId(id);
//     // const user = await User.isUserExistsByEmail(email);
//     console.log(user)
//     if (!user) {
//       throw new AppError(httpStatus.NOT_FOUND, 'User not found');
//     }

//     // Checking if the user is deleted
//     if (user.isDeleted) {
//       throw new AppError(httpStatus.FORBIDDEN, 'User is deleted');
//     }

//     // Checking if the user is blocked
//     if (user.status === 'inactive') {
//       throw new AppError(httpStatus.FORBIDDEN, 'User is blocked');
//     }

//     // Creating a new access token
//     const jwtPayload = {
//       id: id,
//       role: user.role,
//       email: user.email,
//       // objectId: userObjectId.toHexString(),
//       objectId: user?._id,
//     };

//     const accessToken = createToken(
//       jwtPayload,
//       config.jwt_access_secret as string,
//       config.jwt_access_expires_in as string,
//     );

//     return {
//       accessToken,
//     };
//   } catch (error) {
//     if (error instanceof AppError) {
//       throw error;
//     } else {
//       throw new AppError(httpStatus.BAD_REQUEST, 'Invalid token');
//     }
//   }
// };

const refreshToken = async (token: string) => {
  try {
    // Checking if the given token is valid
    const decoded = verifyToken(token, config.jwt_refresh_secret as string);

    // Extracting id and email from the decoded token
    const { id, email } = decoded;
    console.log('Decoded ID:', id);
    console.log('Decoded Email:', email);

    // Check user existence by custom ID
    const userById = await User.isUserExistsByCustomId(id);
    console.log('User fetched by ID:', userById);

    // Check user existence by email if not found by ID
    let user = userById;
    if (!user) {
      user = await User.isUserExistsByEmail(email);
      console.log('User fetched by Email:', user);
    }

    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, 'User not found');
    }

    // Checking if the user is deleted
    if (user.isDeleted) {
      throw new AppError(httpStatus.FORBIDDEN, 'User is deleted');
    }

    // Checking if the user is blocked
    if (user.status === 'inactive') {
      throw new AppError(httpStatus.FORBIDDEN, 'User is blocked');
    }

    // Creating a new access token
    const jwtPayload = {
      // id: user.id,
      id: user.id || '',
      role: user.role,
      email: user.email,
      objectId: user?._id.toHexString(),
    };

    const accessToken = createToken(
      jwtPayload,
      config.jwt_access_secret as string,
      config.jwt_access_expires_in as string,
    );

    return {
      accessToken,
    };
  } catch (error) {
    console.error('Error during token refresh:', error);
    if (error instanceof AppError) {
      throw error;
    } else {
      throw new AppError(httpStatus.BAD_REQUEST, 'Invalid token');
    }
  }
};
const resetPassword = async (
  payload: { email: string; newPassword: string },
  token: string,
) => {
  // checking if the user is exist
  const user = await User.isUserExistsByEmail(payload?.email);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
  }
  // checking if the user is already deleted
  const isDeleted = user?.isDeleted;

  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted !');
  }

  // checking if the user is blocked
  const userStatus = user?.status;

  if (userStatus === 'inactive') {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked ! !');
  }

  const decoded = jwt.verify(
    token,
    config.jwt_access_secret as string,
  ) as JwtPayload;

  //localhost:3000?id=A-0001&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJBLTAwMDEiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3MDI4NTA2MTcsImV4cCI6MTcwMjg1MTIxN30.-T90nRaz8-KouKki1DkCSMAbsHyb9yDi0djZU3D6QO4

  if (payload.email !== decoded.email) {
    console.log(payload.email, decoded.email);
    throw new AppError(httpStatus.FORBIDDEN, 'You are forbidden!');
  }

  //hash new password
  const newHashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_saltround),
  );

  const updatedUser = await User.findOneAndUpdate(
    { email: decoded.email },
    {
      password: newHashedPassword,
      needsPasswordChange: false,
      passwordChangedAt: new Date(),
    },
    { new: true, projection: { password: 0, __v: 0 } } // exclude password and other sensitive fields
  );

  return updatedUser;
};
const forgetPassword = async (email: string) => {
  try {
    // checking if the user exists
    console.log(email)
    const user = await User.isUserExistsByEmail(email);

    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, 'User not found');
    }

    // checking if the user is deleted
    if (user.isDeleted) {
      throw new AppError(httpStatus.FORBIDDEN, 'User is deleted');
    }

    // checking if the user is blocked
    if (user.status === 'inactive') {
      throw new AppError(httpStatus.FORBIDDEN, 'User is blocked');
    }

    // Ensure id is always a string, handle undefined case
    const jwtPayload = {
      id: user?.id || '', // Use optional chaining and provide a default value
      role: user.role,
      email: user.email,
      // objectId: userObjectId.toHexString(),
      objectId: user?._id,
    };

    // creating a reset token
    const resetToken = createToken(
      jwtPayload,
      config.jwt_access_secret as string,
      '10m', // assuming the expiration time is 10 minutes
    );

    // constructing the reset password UI link
    const resetUILink = `${config.reset_pass_ui_link}?email=${user.email}&token=${resetToken}`;

    // sending the reset link via email
    await sendEmail(user.email, resetUILink);
    console.log(user.email, resetUILink); // logging the reset link (optional)

    return resetUILink; // returning null as there's no meaningful data to return
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    } else {
      throw new AppError(
        httpStatus.INTERNAL_SERVER_ERROR,
        'Internal server error',
      );
    }
  }
};

export const AuthServices = {
  loginUser,
  refreshToken,
  // changePasswordUser,
  changePassword,
  forgetPassword,
  resetPassword,
};
