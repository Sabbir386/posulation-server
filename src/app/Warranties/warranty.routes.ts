import { Router } from "express";
import auth from "../middleware/auth";
import validateRequest from "../middleware/validateRequest";
import { USER_ROLE } from "../User/user.constant";

import { WarrantyController } from "./warranty.controller";
import {
    createWarrantySchema,
    updateWarrantySchema,
    warrantyIdParamSchema,
    getWarrantyListQuerySchema,
} from "./warranty.validation";

const router = Router();

router.post(
    "/",
    auth(USER_ROLE.admin, USER_ROLE.superAdmin),
    validateRequest(createWarrantySchema),
    WarrantyController.create
);

router.get(
    "/",
    auth(USER_ROLE.admin, USER_ROLE.superAdmin),
    validateRequest(getWarrantyListQuerySchema),
    WarrantyController.getAll
);

router.get(
    "/:id",
    auth(USER_ROLE.admin, USER_ROLE.superAdmin),
    validateRequest(warrantyIdParamSchema),
    WarrantyController.getSingle
);

router.patch(
    "/:id",
    auth(USER_ROLE.admin, USER_ROLE.superAdmin),
    validateRequest(updateWarrantySchema),
    WarrantyController.update
);

router.delete(
    "/:id",
    auth(USER_ROLE.admin, USER_ROLE.superAdmin),
    validateRequest(warrantyIdParamSchema),
    WarrantyController.remove
);

export const WarrantyRoutes = router;
