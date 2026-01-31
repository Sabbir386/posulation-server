import httpStatus from "http-status";
import catchAsync from "../utilis/catchAsync";
import sendResponse from "../utilis/sendResponse";
import { resolveTenantId } from "../utilis/resolveTenant";
import { WarrantyService } from "./warranty.service";

export const WarrantyController = {
    create: catchAsync(async (req, res) => {
        const tenantId = resolveTenantId(req);
        const result = await WarrantyService.createIntoDB(req.body, req.user, tenantId);

        sendResponse(res, {
            statusCode: httpStatus.CREATED,
            success: true,
            message: "Warranty created",
            data: result,
        });
    }),

    getAll: catchAsync(async (req, res) => {
        const tenantId = resolveTenantId(req);
        const result = await WarrantyService.getAllFromDB(tenantId, req.query as any);

        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "Warranty list",
            data: result.data,
            meta: result.meta,
        });
    }),

    getSingle: catchAsync(async (req, res) => {
        const tenantId = resolveTenantId(req);
        const result = await WarrantyService.getSingleFromDB(req.params.id, tenantId);

        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "Warranty",
            data: result,
        });
    }),

    update: catchAsync(async (req, res) => {
        const tenantId = resolveTenantId(req);
        const result = await WarrantyService.updateIntoDB(req.params.id, tenantId, req.body, req.user);

        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "Warranty updated",
            data: result,
        });
    }),

    remove: catchAsync(async (req, res) => {
        const tenantId = resolveTenantId(req);
        const result = await WarrantyService.deleteIntoDB(req.params.id, tenantId, req.user);

        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "Warranty deleted",
            data: result,
        });
    }),
};
