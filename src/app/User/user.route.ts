import express, { NextFunction, Request, Response } from 'express';

import { UserController } from './user.controller';
import { UserValidation } from './user.validation';
import validateRequest from '../middleware/validateRequest';
// import { USER_ROLE } from './user.constant';
import { createAdminValidationSchema } from '../Admin/admin.validation';
import { USER_ROLE } from './user.constant';
import auth from '../middleware/auth';

import { createNormalUserValidationSchema } from '../NormalUser/normalUser.validation';
const router = express.Router();

// router.post(
//   '/auth/register',
//   // auth(USER_ROLE.superAdmin, USER_ROLE.admin),
//   validateRequest(UserValidation.userValidationSchema),
//   UserController.createUser,
// );
router.post(
  '/create-user',
  // upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    console.log(req.body);
    // req.body = JSON.parse(req.body.data);
    next();
  },
  validateRequest(createNormalUserValidationSchema),
  UserController.createUser,
);
router.get(
  '/find-by-email',
  // auth(
  //   USER_ROLE.superAdmin,
  //   USER_ROLE.admin,
  //   USER_ROLE.user,
  //   USER_ROLE.advertiser,
  // ),
  UserController.findByEmail,
);
router.post(
  '/create-admin',
  auth(USER_ROLE.superAdmin),
  // upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    console.log(req.body);
    // req.body = JSON.parse(req.body.data);
    next();
  },
  validateRequest(createAdminValidationSchema),
  UserController.createAdmin,
);

router.post(
  '/change-status/:id',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  validateRequest(UserValidation.changeStatusValidationSchema),
  UserController.changeStatus,
);

router.get(
  '/me',
  auth(
    USER_ROLE.superAdmin,
    USER_ROLE.admin,
    USER_ROLE.user,
    USER_ROLE.advertiser,
  ),
  UserController.getMe,
);

export const UserRoutes = router;
