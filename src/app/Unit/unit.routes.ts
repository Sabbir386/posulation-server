import { Router } from "express";
import auth from "../middleware/auth";
import validateRequest from "../middleware/validateRequest";
import { USER_ROLE } from "../User/user.constant";

import { UnitController } from "./unit.controller";
import {
  createUnitSchema,
  updateUnitSchema,
  unitIdParamSchema,
  getUnitListQuerySchema,
} from "./unit.validation";

const router = Router();

router.post(
  "/",
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  validateRequest(createUnitSchema),
  UnitController.create
);

router.get(
  "/",
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  validateRequest(getUnitListQuerySchema),
  UnitController.getAll
);

router.get(
  "/:id",
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  validateRequest(unitIdParamSchema),
  UnitController.getSingle
);

router.patch(
  "/:id",
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  validateRequest(updateUnitSchema),
  UnitController.update
);

router.delete(
  "/:id",
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  validateRequest(unitIdParamSchema),
  UnitController.remove
);

export const UnitRoutes = router;
