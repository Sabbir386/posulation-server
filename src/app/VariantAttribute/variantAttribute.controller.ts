import httpStatus from "http-status";
import catchAsync from "../utilis/catchAsync";
import sendResponse from "../utilis/sendResponse";
import { resolveTenantId } from "../utilis/resolveTenant";
import { VariantAttributeService } from "./variantAttribute.service";

export const VariantAttributeController = {
    create: catchAsync(async (req, res) => {
        const tenantId = resolveTenantId(req);
        const result = await VariantAttributeService.createIntoDB(req.body, req.user, tenantId);

        sendResponse(res, {
            statusCode: httpStatus.CREATED,
            success: true,
            message: "Variant attribute created",
            data: result,
        });
    }),

    getAll: catchAsync(async (req, res) => {
        const tenantId = resolveTenantId(req);
        const result = await VariantAttributeService.getAllFromDB(tenantId, req.query as any);

        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "Variant attribute list",
            data: result.data,
            meta: result.meta,
        });
    }),

    getSingle: catchAsync(async (req, res) => {
        const tenantId = resolveTenantId(req);
        const result = await VariantAttributeService.getSingleFromDB(req.params.id, tenantId);

        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "Variant attribute",
            data: result,
        });
    }),

    update: catchAsync(async (req, res) => {
        const tenantId = resolveTenantId(req);
        const result = await VariantAttributeService.updateIntoDB(
            req.params.id,
            tenantId,
            req.body,
            req.user
        );

        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "Variant attribute updated",
            data: result,
        });
    }),

    remove: catchAsync(async (req, res) => {
        const tenantId = resolveTenantId(req);
        const result = await VariantAttributeService.deleteIntoDB(req.params.id, tenantId, req.user);

        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "Variant attribute deleted",
            data: result,
        });
    }),
};
