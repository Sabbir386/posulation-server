import catchAsync from "../utilis/catchAsync";
import sendResponse from "../utilis/sendResponse";
import httpStatus from "http-status";
import { ProductService } from "./product.service";
import { Request, Response } from "express";
import { resolveTenantId } from "../Supplier/resolveTenant";

const createProduct = catchAsync(async (req: Request, res: Response) => {
    const tenantId = resolveTenantId(req);
    const result = await ProductService.createProductIntoDB(req.body, req.user, tenantId);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Product created successfully",
        data: result,
    });
});

const getAllProducts = catchAsync(async (req: Request, res: Response) => {
    const tenantId = resolveTenantId(req);
    const supplierId = req.query.supplierId as string | undefined;

    const result = await ProductService.getAllProductsFromDB(tenantId, supplierId);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Products retrieved",
        data: result,
    });
});

const getProduct = catchAsync(async (req: Request, res: Response) => {
    const tenantId = resolveTenantId(req);
    const result = await ProductService.getProductFromDB(req.params.productId, tenantId);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Product retrieved",
        data: result,
    });
});

const updateProduct = catchAsync(async (req: Request, res: Response) => {
    const tenantId = resolveTenantId(req);
    const result = await ProductService.updateProductIntoDB(req.params.productId, tenantId, req.body);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Product updated",
        data: result,
    });
});

const deleteProduct = catchAsync(async (req: Request, res: Response) => {
    const tenantId = resolveTenantId(req);
    const result = await ProductService.deleteProductFromDB(req.params.productId, tenantId);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Product deleted",
        data: result,
    });
});

export const ProductController = {
    createProduct,
    getAllProducts,
    getProduct,
    updateProduct,
    deleteProduct,
};
