import express from "express";
import auth from "../middleware/auth";
import validateRequest from "../middleware/validateRequest";
import {
  createSupplierValidation,
  updateSupplierValidation,
} from "./supplier.validation";
import { SupplierController } from "./supplier.controller";
import { USER_ROLE } from "../User/user.constant";
import { User } from "../User/user.model";

const router = express.Router();

router.post(
  "/",
  auth(USER_ROLE.admin, USER_ROLE.superAdmin, USER_ROLE.user),
  validateRequest(createSupplierValidation),
  SupplierController.createSupplier
);

router.get(
  "/",
  auth(USER_ROLE.admin, USER_ROLE.superAdmin, USER_ROLE.user),
  SupplierController.getAllSuppliers
);

router.get(
  "/:supplierId",
  auth(USER_ROLE.admin, USER_ROLE.superAdmin, USER_ROLE.user),
  SupplierController.getSupplier
);

router.patch(
  "/:supplierId",
  auth(USER_ROLE.admin, USER_ROLE.superAdmin, USER_ROLE.user),
  validateRequest(updateSupplierValidation),
  SupplierController.updateSupplier
);

router.delete(
  "/:supplierId",
  auth(USER_ROLE.admin, USER_ROLE.superAdmin, USER_ROLE.user),
  SupplierController.deleteSupplier
);

export const SupplierRoutes = router;
