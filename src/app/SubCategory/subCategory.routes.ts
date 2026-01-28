import { Router } from "express";
import { SubCategoryController } from "./subCategory.controller";


import {
  createSubCategorySchema,
  updateSubCategorySchema,
  subCategoryIdParamSchema,
  getSubCategoryListQuerySchema,
} from "./subCategory.validation";
import auth from "../middleware/auth";
import { USER_ROLE } from "../User/user.constant";
import validateRequest from "../middleware/validateRequest";

const router = Router();

router.post(
  "/",
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  validateRequest(createSubCategorySchema),
  SubCategoryController.create
);

router.get(
  "/",
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  validateRequest(getSubCategoryListQuerySchema),
  SubCategoryController.getAll
);

router.get(
  "/:id",
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  validateRequest(subCategoryIdParamSchema),
  SubCategoryController.getSingle
);

router.patch(
  "/:id",
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  validateRequest(updateSubCategorySchema),
  SubCategoryController.update
);

router.delete(
  "/:id",
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  validateRequest(subCategoryIdParamSchema),
  SubCategoryController.remove
);

export const SubCategoryRoutes = router;
