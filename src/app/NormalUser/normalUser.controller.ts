import httpStatus from 'http-status';

import catchAsync from '../utilis/catchAsync';
import sendResponse from '../utilis/sendResponse';
import { NormalUserServices } from './normalUser.service';

const getSingleNormalUser = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await NormalUserServices.getSingleNormalUserFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User is retrieved successfully',
    data: result,
  });
});

const getAllNormalUsers = catchAsync(async (req, res) => {
  const result = await NormalUserServices.getAllNormalUsersFromDB(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Users are retrieved successfully',
    meta: result.meta,
    data: result.result,
  });
});

const updateNormalUser = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const { normalUser } = req.body;

  // Call the service to update the user
  const result = await NormalUserServices.updateNormalUserIntoDB(userId, normalUser);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User is updated successfully',
    data: result,
  });
});

const deleteNormalUser = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await NormalUserServices.deleteNormalUserFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User is deleted successfully',
    data: result,
  });
});

export const NormalUserControllers = {
  getAllNormalUsers,
  getSingleNormalUser,
  deleteNormalUser,
  updateNormalUser,
};
