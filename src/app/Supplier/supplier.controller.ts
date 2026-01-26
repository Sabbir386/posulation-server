// supplier.controller.ts
import catchAsync from "../utilis/catchAsync";
import sendResponse from "../utilis/sendResponse";
import httpStatus from "http-status";
import { SupplierService } from "./supplier.service";
import AppError from "../errors/AppError";
import { resolveTenantId } from "./resolveTenant";


const createSupplier = catchAsync(async (req, res) => {
  const tenantId = resolveTenantId(req);

  const result = await SupplierService.createSupplierIntoDB(
    req.body,
    req.user,
    tenantId
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Supplier created successfully",
    data: result,
  });
});

const getAllSuppliers = catchAsync(async (req, res) => {
  const tenantId = resolveTenantId(req);

  const result = await SupplierService.getAllSuppliersFromDB(tenantId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Suppliers retrieved",
    data: result,
  });
});

const getSupplier = catchAsync(async (req, res) => {
  const tenantId = resolveTenantId(req);

  const result = await SupplierService.getSupplierFromDB(
    req.params.supplierId,
    tenantId
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Supplier retrieved",
    data: result,
  });
});

const updateSupplier = catchAsync(async (req, res) => {
  const tenantId = resolveTenantId(req);

  const result = await SupplierService.updateSupplierIntoDB(
    req.params.supplierId,
    tenantId,
    req.body
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Supplier updated",
    data: result,
  });
});

const deleteSupplier = catchAsync(async (req, res) => {
  const tenantId = resolveTenantId(req);

  const result = await SupplierService.deleteSupplierFromDB(
    req.params.supplierId,
    tenantId
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Supplier deleted",
    data: result,
  });
});

export const SupplierController = {
  createSupplier,
  getAllSuppliers,
  getSupplier,
  updateSupplier,
  deleteSupplier,
};
