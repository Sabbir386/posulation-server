import catchAsync from '../utilis/catchAsync';
import sendResponse from '../utilis/sendResponse';
import httpStatus from 'http-status';
import { TenantService } from './tenant.service';

/**
 * POST /tenant/create-tenant
 * superAdmin only
 */
const createTenant = catchAsync(async (req: any, res) => {
  // req.user.objectId is set by auth middleware (Mongoose ObjectId or string based on your setup)
  const createdBy = req.user?.objectId || null;
  const payload = req.body;

  const result = await TenantService.createTenantIntoDb(payload, createdBy);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Tenant created successfully',
    data: result,
  });
});

const getAllTenants = catchAsync(async (req, res) => {
  const result = await TenantService.getAllTenantsFromDB();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Tenants retrieved successfully',
    data: result,
  });
});

const getSingleTenant = catchAsync(async (req, res) => {
  const tenantId = req.params.tenantId;
  const result = await TenantService.getSingleTenantFromDB(tenantId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Tenant retrieved successfully',
    data: result,
  });
});

const updateTenant = catchAsync(async (req, res) => {
  const tenantId = req.params.tenantId;
  const result = await TenantService.updateTenantIntoDB(tenantId, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Tenant updated successfully',
    data: result,
  });
});

const deleteTenant = catchAsync(async (req, res) => {
  const tenantId = req.params.tenantId;
  const result = await TenantService.deleteTenantFromDB(tenantId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Tenant deactivated successfully',
    data: result,
  });
});

export const TenantController = {
  createTenant,
  getAllTenants,
  getSingleTenant,
  updateTenant,
  deleteTenant,
};
