import { Router } from "express";
import auth from "../middleware/auth";
import validateRequest from "../middleware/validateRequest";
import { USER_ROLE } from "../User/user.constant";

import { WarehouseController } from "./warehouse.controller";
import { createWarehouseSchema, updateWarehouseSchema, warehouseIdParamSchema, getWarehouseListQuerySchema } from "./warehouse.validation";

const router = Router();

router.post("/", auth(USER_ROLE.admin, USER_ROLE.superAdmin), validateRequest(createWarehouseSchema), WarehouseController.create);
router.get("/", auth(USER_ROLE.admin, USER_ROLE.superAdmin), validateRequest(getWarehouseListQuerySchema), WarehouseController.getAll);
router.get("/:id", auth(USER_ROLE.admin, USER_ROLE.superAdmin), validateRequest(warehouseIdParamSchema), WarehouseController.getSingle);
router.patch("/:id", auth(USER_ROLE.admin, USER_ROLE.superAdmin), validateRequest(updateWarehouseSchema), WarehouseController.update);
router.delete("/:id", auth(USER_ROLE.admin, USER_ROLE.superAdmin), validateRequest(warehouseIdParamSchema), WarehouseController.remove);

export const WarehouseRoutes = router;
