import { Router } from "express";


import { BrandController } from "./brand.controller";
import {
  createBrandSchema,
  updateBrandSchema,
  brandIdParamSchema,
  getBrandListQuerySchema,
} from "./brand.validation";
import { USER_ROLE } from "../User/user.constant";
import auth from "../middleware/auth";
import validateRequest from "../middleware/validateRequest";

const router = Router();

router.post(
  "/",
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  validateRequest(createBrandSchema),
  BrandController.create
);

router.get(
  "/",
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  validateRequest(getBrandListQuerySchema),
  BrandController.getAll
);

router.get(
  "/:id",
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  validateRequest(brandIdParamSchema),
  BrandController.getSingle
);

router.patch(
  "/:id",
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  validateRequest(updateBrandSchema),
  BrandController.update
);

router.delete(
  "/:id",
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  validateRequest(brandIdParamSchema),
  BrandController.remove
);

export const BrandRoutes = router;
