import httpStatus from "http-status";

import { CategoryService } from "./category.service";
import catchAsync from "../utilis/catchAsync";
import { resolveTenantId } from "../utilis/resolveTenant";
import sendResponse from "../utilis/sendResponse";

export const CategoryController = {
  create: catchAsync(async (req, res) => {
    const tenantId = resolveTenantId(req);
    const result = await CategoryService.createIntoDB(req.body, req.user, tenantId);

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Category created",
      data: result,
    });
  }),

  getAll: catchAsync(async (req, res) => {
    const tenantId = resolveTenantId(req);
    const result = await CategoryService.getAllFromDB(tenantId, req.query as any);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Category list",
      data: result.data,
      meta: result.meta,
    });
  }),

  getSingle: catchAsync(async (req, res) => {
    const tenantId = resolveTenantId(req);
    const result = await CategoryService.getSingleFromDB(req.params.id, tenantId);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Category",
      data: result,
    });
  }),

  update: catchAsync(async (req, res) => {
    const tenantId = resolveTenantId(req);
    const result = await CategoryService.updateIntoDB(req.params.id, tenantId, req.body, req.user);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Category updated",
      data: result,
    });
  }),

  remove: catchAsync(async (req, res) => {
    const tenantId = resolveTenantId(req);
    const result = await CategoryService.deleteIntoDB(req.params.id, tenantId, req.user);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Category deleted",
      data: result,
    });
  }),
};
