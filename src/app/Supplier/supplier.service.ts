// supplier.service.ts
import { Supplier } from "./supplier.model";
import AppError from "../errors/AppError";
import httpStatus from "http-status";
import { generateSupplierId } from "./supplier.utils";

const createSupplierIntoDB = async (payload: any, user: any, tenantId: string) => {
  const supplierId = await generateSupplierId();

  return await Supplier.create({
    supplierId,
    name: payload.name,
    phone: payload.phone,
    email: payload.email,
    address: payload.address,
    tenantId,
    createdBy: user.objectId,
  });
};

const getAllSuppliersFromDB = async (tenantId: string) => {
  return await Supplier.find({ tenantId });
};

const getSupplierFromDB = async (supplierId: string, tenantId: string) => {
  const supplier = await Supplier.findOne({ supplierId, tenantId });
  if (!supplier) throw new AppError(httpStatus.NOT_FOUND, "Supplier not found");
  return supplier;
};

const updateSupplierIntoDB = async (supplierId: string, tenantId: string, payload: any) => {
  const updated = await Supplier.findOneAndUpdate(
    { supplierId, tenantId },
    payload,
    { new: true }
  );

  if (!updated) throw new AppError(httpStatus.NOT_FOUND, "Supplier not found");
  return updated;
};

const deleteSupplierFromDB = async (supplierId: string, tenantId: string) => {
  const deleted = await Supplier.findOneAndDelete({ supplierId, tenantId });
  if (!deleted) throw new AppError(httpStatus.NOT_FOUND, "Supplier not found");
  return deleted;
};

export const SupplierService = {
  createSupplierIntoDB,
  getAllSuppliersFromDB,
  getSupplierFromDB,
  updateSupplierIntoDB,
  deleteSupplierFromDB,
};
