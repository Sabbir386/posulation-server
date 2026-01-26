import { Product } from "./product.model";
import AppError from "../errors/AppError";
import httpStatus from "http-status";

const createProductIntoDB = async (payload: any, user: any, tenantId: string) => {

    // ❌ REMOVE ObjectId validation — supplierId is STRING
    if (!payload.supplierId) {
        throw new AppError(httpStatus.BAD_REQUEST, "supplierId is required");
    }

    return await Product.create({
        ...payload,
        tenantId,
        createdBy: user.objectId,
    });
};

const getAllProductsFromDB = async (tenantId: string, supplierId?: string) => {
    const filter: any = { tenantId };
    if (supplierId) filter.supplierId = supplierId;
    return await Product.find(filter);
};

const getProductFromDB = async (productId: string, tenantId: string) => {
    const product = await Product.findOne({ _id: productId, tenantId });
    if (!product) throw new AppError(httpStatus.NOT_FOUND, "Product not found");
    return product;
};

const updateProductIntoDB = async (productId: string, tenantId: string, payload: any) => {
    const updated = await Product.findOneAndUpdate(
        { _id: productId, tenantId },
        payload,
        { new: true }
    );
    if (!updated) throw new AppError(httpStatus.NOT_FOUND, "Product not found");
    return updated;
};

const deleteProductFromDB = async (productId: string, tenantId: string) => {
    const deleted = await Product.findOneAndDelete({ _id: productId, tenantId });
    if (!deleted) throw new AppError(httpStatus.NOT_FOUND, "Product not found");
    return deleted;
};

export const ProductService = {
    createProductIntoDB,
    getAllProductsFromDB,
    getProductFromDB,
    updateProductIntoDB,
    deleteProductFromDB,
};
