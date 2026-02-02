import httpStatus from "http-status";
import catchAsync from "../utilis/catchAsync";
import sendResponse from "../utilis/sendResponse";
import { resolveTenantId } from "../utilis/resolveTenant";
import { StoreService } from "./store.service";

export const StoreController = {
  create: catchAsync(async (req, res) => {
    const tenantId = resolveTenantId(req);
    const result = await StoreService.createIntoDB(req.body, req.user, tenantId);

    sendResponse(res, { statusCode: httpStatus.CREATED, success: true, message: "Store created", data: result });
  }),

  getAll: catchAsync(async (req, res) => {
    const tenantId = resolveTenantId(req);
    const result = await StoreService.getAllFromDB(tenantId, req.query as any);

    sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "Store list", data: result.data, meta: result.meta });
  }),

  getSingle: catchAsync(async (req, res) => {
    const tenantId = resolveTenantId(req);
    const result = await StoreService.getSingleFromDB(req.params.id, tenantId);

    sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "Store", data: result });
  }),

  update: catchAsync(async (req, res) => {
    const tenantId = resolveTenantId(req);
    const result = await StoreService.updateIntoDB(req.params.id, tenantId, req.body, req.user);

    sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "Store updated", data: result });
  }),

  remove: catchAsync(async (req, res) => {
    const tenantId = resolveTenantId(req);
    const result = await StoreService.deleteIntoDB(req.params.id, tenantId, req.user);

    sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "Store deleted", data: result });
  }),
};
