import httpStatus from "http-status";

import { BrandService } from "./brand.service";
import catchAsync from "../utilis/catchAsync";
import sendResponse from "../utilis/sendResponse";
import { resolveTenantId } from "../utilis/resolveTenant";

export const BrandController = {
  create: catchAsync(async (req, res) => {
    const tenantId = resolveTenantId(req);
    const result = await BrandService.createIntoDB(req.body, req.user, tenantId);

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Brand created",
      data: result,
    });
  }),

  getAll: catchAsync(async (req, res) => {
    const tenantId = resolveTenantId(req);
    const result = await BrandService.getAllFromDB(tenantId, req.query as any);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Brand list",
      data: result.data,
      meta: result.meta,
    });
  }),

  getSingle: catchAsync(async (req, res) => {
    const tenantId = resolveTenantId(req);
    const result = await BrandService.getSingleFromDB(req.params.id, tenantId);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Brand",
      data: result,
    });
  }),

  update: catchAsync(async (req, res) => {
    const tenantId = resolveTenantId(req);
    const result = await BrandService.updateIntoDB(req.params.id, tenantId, req.body, req.user);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Brand updated",
      data: result,
    });
  }),

  remove: catchAsync(async (req, res) => {
    const tenantId = resolveTenantId(req);
    const result = await BrandService.deleteIntoDB(req.params.id, tenantId, req.user);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Brand deleted",
      data: result,
    });
  }),
};
