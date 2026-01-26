import express from 'express';
import { USER_ROLE } from '../User/user.constant';
import auth from '../middleware/auth';
import validateRequest from '../middleware/validateRequest';
import { NormalUserControllers } from './normalUser.controller';
import { updateNormalUserValidationSchema } from './normalUser.validation';

const router = express.Router();
router.get(
  '/',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  NormalUserControllers.getAllNormalUsers,
);

router.get(
  '/:id',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin,USER_ROLE.user,USER_ROLE.advertiser),
  NormalUserControllers.getSingleNormalUser,
);

router.patch(
  '/:userId',
  auth(USER_ROLE.superAdmin,USER_ROLE.admin,USER_ROLE.user),
  validateRequest(updateNormalUserValidationSchema),
  NormalUserControllers.updateNormalUser,
);

router.delete(
  '/:id',
  auth(USER_ROLE.superAdmin,USER_ROLE.admin),
  NormalUserControllers.deleteNormalUser,
);

export const NormalUserRoutes = router;
