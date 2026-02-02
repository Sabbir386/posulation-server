import httpStatus from "http-status";
import catchAsync from "../utilis/catchAsync";
import sendResponse from "../utilis/sendResponse";
import { resolveTenantId } from "../utilis/resolveTenant";
import { WarehouseService } from "./warehouse.service";

export const WarehouseController = {
  create: catchAsync(async (req, res) => {
    const tenantId = resolveTenantId(req);
    const result = await WarehouseService.createIntoDB(req.body, req.user, tenantId);

    sendResponse(res, { statusCode: httpStatus.CREATED, success: true, message: "Warehouse created", data: result });
  }),

  getAll: catchAsync(async (req, res) => {
    const tenantId = resolveTenantId(req);
    const result = await WarehouseService.getAllFromDB(tenantId, req.query as any);

    sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "Warehouse list", data: result.data, meta: result.meta });
  }),

  getSingle: catchAsync(async (req, res) => {
    const tenantId = resolveTenantId(req);
    const result = await WarehouseService.getSingleFromDB(req.params.id, tenantId);

    sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "Warehouse", data: result });
  }),

  update: catchAsync(async (req, res) => {
    const tenantId = resolveTenantId(req);
    const result = await WarehouseService.updateIntoDB(req.params.id, tenantId, req.body, req.user);

    sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "Warehouse updated", data: result });
  }),

  remove: catchAsync(async (req, res) => {
    const tenantId = resolveTenantId(req);
    const result = await WarehouseService.deleteIntoDB(req.params.id, tenantId, req.user);

    sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "Warehouse deleted", data: result });
  }),
};
