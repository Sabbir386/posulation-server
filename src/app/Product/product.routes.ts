import { Router } from "express";
import auth from "../middleware/auth";
import validateRequest from "../middleware/validateRequest";
import { USER_ROLE } from "../User/user.constant";

import { ProductController } from "./product.controller";
import { createProductSchema, updateProductSchema, productIdParamSchema, getProductListQuerySchema } from "./product.validation";

const router = Router();

router.post(
  "/",
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  validateRequest(createProductSchema),
  ProductController.create
);

router.get(
  "/",
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  validateRequest(getProductListQuerySchema),
  ProductController.getAll
);

router.get(
  "/:id",
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  validateRequest(productIdParamSchema),
  ProductController.getSingle
);

router.patch(
  "/:id",
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  validateRequest(updateProductSchema),
  ProductController.update
);

router.delete(
  "/:id",
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  validateRequest(productIdParamSchema),
  ProductController.remove
);

export const ProductRoutes = router;
