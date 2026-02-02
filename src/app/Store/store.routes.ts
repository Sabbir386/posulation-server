import { Router } from "express";
import auth from "../middleware/auth";
import validateRequest from "../middleware/validateRequest";
import { USER_ROLE } from "../User/user.constant";
import { StoreController } from "./store.controller";
import { createStoreSchema, updateStoreSchema, storeIdParamSchema, getStoreListQuerySchema } from "./store.validation";

const router = Router();

router.post("/", auth(USER_ROLE.admin, USER_ROLE.superAdmin), validateRequest(createStoreSchema), StoreController.create);
router.get("/", auth(USER_ROLE.admin, USER_ROLE.superAdmin), validateRequest(getStoreListQuerySchema), StoreController.getAll);
router.get("/:id", auth(USER_ROLE.admin, USER_ROLE.superAdmin), validateRequest(storeIdParamSchema), StoreController.getSingle);
router.patch("/:id", auth(USER_ROLE.admin, USER_ROLE.superAdmin), validateRequest(updateStoreSchema), StoreController.update);
router.delete("/:id", auth(USER_ROLE.admin, USER_ROLE.superAdmin), validateRequest(storeIdParamSchema), StoreController.remove);

export const StoreRoutes = router;
