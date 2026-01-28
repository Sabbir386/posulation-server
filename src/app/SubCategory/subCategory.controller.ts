import httpStatus from "http-status";

import { SubCategoryService } from "./subCategory.service";
import catchAsync from "../utilis/catchAsync";
import { resolveTenantId } from "../utilis/resolveTenant";
import sendResponse from "../utilis/sendResponse";

export const SubCategoryController = {
  create: catchAsync(async (req, res) => {
    const tenantId = resolveTenantId(req);
    const result = await SubCategoryService.createIntoDB(req.body, req.user, tenantId);

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "SubCategory created",
      data: result,
    });
  }),

  getAll: catchAsync(async (req, res) => {
    const tenantId = resolveTenantId(req);
    const result = await SubCategoryService.getAllFromDB(tenantId, req.query as any);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "SubCategory list",
      data: result.data,
      meta: result.meta,
    });
  }),

  getSingle: catchAsync(async (req, res) => {
    const tenantId = resolveTenantId(req);
    const result = await SubCategoryService.getSingleFromDB(req.params.id, tenantId);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "SubCategory",
      data: result,
    });
  }),

  update: catchAsync(async (req, res) => {
    const tenantId = resolveTenantId(req);
    const result = await SubCategoryService.updateIntoDB(req.params.id, tenantId, req.body, req.user);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "SubCategory updated",
      data: result,
    });
  }),

  remove: catchAsync(async (req, res) => {
    const tenantId = resolveTenantId(req);
    const result = await SubCategoryService.deleteIntoDB(req.params.id, tenantId, req.user);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "SubCategory deleted",
      data: result,
    });
  }),
};
