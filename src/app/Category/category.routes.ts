import { Router } from "express";
import { CategoryController } from "./category.controller";
import {
  createCategorySchema,
  updateCategorySchema,
  categoryIdParamSchema,
  getCategoryListQuerySchema,
} from "./category.validation";
import { USER_ROLE } from "../User/user.constant";
import auth from "../middleware/auth";
import validateRequest from "../middleware/validateRequest";

const router = Router();

router.post(
  "/",
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  validateRequest(createCategorySchema),
  CategoryController.create
);

router.get(
  "/",
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  validateRequest(getCategoryListQuerySchema),
  CategoryController.getAll
);

router.get(
  "/:id",
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  validateRequest(categoryIdParamSchema),
  CategoryController.getSingle
);

router.patch(
  "/:id",
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  validateRequest(updateCategorySchema),
  CategoryController.update
);

router.delete(
  "/:id",
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  validateRequest(categoryIdParamSchema),
  CategoryController.remove
);

export const CategoryRoutes = router;
