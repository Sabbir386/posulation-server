import httpStatus from "http-status";
import catchAsync from "../utilis/catchAsync";
import sendResponse from "../utilis/sendResponse";
import { resolveTenantId } from "../utilis/resolveTenant";
import { UnitService } from "./unit.service";

export const UnitController = {
  create: catchAsync(async (req, res) => {
    const tenantId = resolveTenantId(req);
    const result = await UnitService.createIntoDB(req.body, req.user, tenantId);

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Unit created",
      data: result,
    });
  }),

  getAll: catchAsync(async (req, res) => {
    const tenantId = resolveTenantId(req);
    const q = req.query as any;

    // ✅ if you want counts, call aggregate version
    const result = q.withCounts
      ? await UnitService.getAllWithProductCounts(tenantId, q)
      : await UnitService.getAllFromDB(tenantId, q);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Unit list",
      data: result.data,
      meta: result.meta,
    });
  }),

  getSingle: catchAsync(async (req, res) => {
    const tenantId = resolveTenantId(req);
    const result = await UnitService.getSingleFromDB(req.params.id, tenantId);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Unit",
      data: result,
    });
  }),

  update: catchAsync(async (req, res) => {
    const tenantId = resolveTenantId(req);
    const result = await UnitService.updateIntoDB(req.params.id, tenantId, req.body, req.user);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Unit updated",
      data: result,
    });
  }),

  remove: catchAsync(async (req, res) => {
    const tenantId = resolveTenantId(req);
    const result = await UnitService.deleteIntoDB(req.params.id, tenantId, req.user);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Unit deleted",
      data: result,
    });
  }),
};
