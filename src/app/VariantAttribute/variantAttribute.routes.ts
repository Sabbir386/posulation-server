import { Router } from "express";
import auth from "../middleware/auth";
import validateRequest from "../middleware/validateRequest";
import { USER_ROLE } from "../User/user.constant";

import { VariantAttributeController } from "./variantAttribute.controller";
import {
    createVariantAttributeSchema,
    updateVariantAttributeSchema,
    variantAttributeIdParamSchema,
    getVariantAttributeListQuerySchema,
} from "./variantAttribute.validation";

const router = Router();

router.post(
    "/",
    auth(USER_ROLE.admin, USER_ROLE.superAdmin),
    validateRequest(createVariantAttributeSchema),
    VariantAttributeController.create
);

router.get(
    "/",
    auth(USER_ROLE.admin, USER_ROLE.superAdmin),
    validateRequest(getVariantAttributeListQuerySchema),
    VariantAttributeController.getAll
);

router.get(
    "/:id",
    auth(USER_ROLE.admin, USER_ROLE.superAdmin),
    validateRequest(variantAttributeIdParamSchema),
    VariantAttributeController.getSingle
);

router.patch(
    "/:id",
    auth(USER_ROLE.admin, USER_ROLE.superAdmin),
    validateRequest(updateVariantAttributeSchema),
    VariantAttributeController.update
);

router.delete(
    "/:id",
    auth(USER_ROLE.admin, USER_ROLE.superAdmin),
    validateRequest(variantAttributeIdParamSchema),
    VariantAttributeController.remove
);

export const VariantAttributeRoutes = router;
