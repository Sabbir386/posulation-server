import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import config from '../config';
import catchAsync from '../utilis/catchAsync';
import AppError from '../errors/AppError';
import { TUserRole } from '../User/user.interface';
import { MyJwtPayload } from '../Auth/auth.types';

const auth = (...requiredRoles: TUserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;
    if (!token) throw new AppError(httpStatus.UNAUTHORIZED, "Unauthorized");

    const decoded = jwt.verify(token, config.jwt_access_secret as string) as MyJwtPayload;

    // Role check
    if (requiredRoles.length && !requiredRoles.includes(decoded.role as TUserRole)) {
      throw new AppError(httpStatus.FORBIDDEN, "Access denied");
    }

    // Convert objectId to Mongoose ObjectId only when needed
    const objectId = mongoose.Types.ObjectId.isValid(decoded.objectId)
      ? new mongoose.Types.ObjectId(decoded.objectId)
      : null;

    if (!objectId) throw new AppError(httpStatus.UNAUTHORIZED, "Invalid user ID");

    // Attach user to request
    req.user = {
      ...decoded,
      objectId,
      tenantId: decoded.tenantId ?? null,
    };

    console.log("Auth OK → req.user =", req.user);

    next();
  });
};

export default auth;
