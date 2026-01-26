import express from "express";
import { ProductController } from "./product.controller";
import auth from "../middleware/auth";
import validateRequest from "../middleware/validateRequest";
import { createProductValidation, updateProductValidation } from "./product.validation";
import { USER_ROLE } from "../User/user.constant";

const router = express.Router();

// Admin & superAdmin can manage products
router.post(
    "/",
    auth(USER_ROLE.admin, USER_ROLE.superAdmin),
    validateRequest(createProductValidation),
    ProductController.createProduct
);

router.get(
    "/",
    auth(USER_ROLE.admin, USER_ROLE.superAdmin),
    ProductController.getAllProducts
);

router.get(
    "/:productId",
    auth(USER_ROLE.admin, USER_ROLE.superAdmin),
    ProductController.getProduct
);

router.patch(
    "/:productId",
    auth(USER_ROLE.admin, USER_ROLE.superAdmin),
    validateRequest(updateProductValidation),
    ProductController.updateProduct
);

router.delete(
    "/:productId",
    auth(USER_ROLE.admin, USER_ROLE.superAdmin),
    ProductController.deleteProduct
);

export const ProductRoutes = router;
