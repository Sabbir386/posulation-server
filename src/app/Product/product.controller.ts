import httpStatus from "http-status";
import catchAsync from "../utilis/catchAsync";
import sendResponse from "../utilis/sendResponse";
import { resolveTenantId } from "../utilis/resolveTenant";
import { ProductService } from "./product.service";

export const ProductController = {
    create: catchAsync(async (req, res) => {
        const tenantId = resolveTenantId(req);
        const result = await ProductService.createIntoDB(req.body, req.user, tenantId);

        sendResponse(res, {
            statusCode: httpStatus.CREATED,
            success: true,
            message: "Product created",
            data: result,
        });
    }),

    getAll: catchAsync(async (req, res) => {
        const tenantId = resolveTenantId(req);
        const result = await ProductService.getAllFromDB(tenantId, req.query as any);

        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "Product list",
            data: result.data,
            meta: result.meta,
        });
    }),

    getSingle: catchAsync(async (req, res) => {
        const tenantId = resolveTenantId(req);
        const result = await ProductService.getSingleFromDB(req.params.id, tenantId);

        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "Product",
            data: result,
        });
    }),

    update: catchAsync(async (req, res) => {
        const tenantId = resolveTenantId(req);
        const result = await ProductService.updateIntoDB(req.params.id, tenantId, req.body, req.user);

        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "Product updated",
            data: result,
        });
    }),

    remove: catchAsync(async (req, res) => {
        const tenantId = resolveTenantId(req);
        const result = await ProductService.deleteIntoDB(req.params.id, tenantId, req.user);

        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "Product deleted",
            data: result,
        });
    }),
};
