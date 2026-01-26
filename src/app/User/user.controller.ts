import AppError from '../errors/AppError';
import catchAsync from '../utilis/catchAsync';
import sendResponse from '../utilis/sendResponse';

import { UserServices } from './user.service';

import httpStatus from 'http-status';

const createUser = catchAsync(async (req, res) => {
  // const { password, normalUser: userData } = req.body;
  // const result = await UserServices.createUserIntoDb(
  //   req.file,
  //   password,
  //   userData,
  // );

  const { password, normalUser: userData } = req.body;

  const result = await UserServices.createUserIntoDb(
    req.file,
    password,
    userData 
  );


  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User is created successfully',
    data: result,
  });
});
const findByEmail = catchAsync(async (req, res) => {
  const { email } = req.query;

  if (!email) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Email query parameter is required',
    );
  }

  const result = await UserServices.findByEmailIntoDb(email as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: ' find by Email User details retrieved successfully',
    data: result,
  });
});
const createAdmin = catchAsync(async (req, res) => {
  const { password, admin: adminData } = req.body;

  const result = await UserServices.createAdminIntoDB(
    req.file,
    password,
    adminData,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Admin is created successfully',
    data: result,
  });
});

const getMe = catchAsync(async (req, res) => {
  const { id, role, email } = req.user;
  console.log('from user controller email get me :', email);
  const result = await UserServices.getMe(id, role);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User is retrieved successfully',
    data: result,
  });
});

const changeStatus = catchAsync(async (req, res) => {
  const id = req.params.id;

  const result = await UserServices.changeStatus(id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Status is updated successfully',
    data: result,
  });
});
export const UserController = {
  createUser,
  createAdmin,
  getMe,
  changeStatus,
  findByEmail,
};
