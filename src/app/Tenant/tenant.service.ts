import httpStatus from 'http-status';
import AppError from '../errors/AppError';
import { Tenant } from './tenant.model';
import { TTenant } from './tenant.interface';
import { generateTenantId } from './tenant.utils';

/**
 * Creates tenant and returns created doc
 * payload: partial tenant fields (name, email, phone, ownerAdmin, ...)
 * createdBy: ObjectId of the user creating tenant (superAdmin)
 */
const createTenantIntoDb = async (payload: Partial<TTenant>, createdBy: any) => {
  // generate tenantId (t-001)
  const tenantId = await generateTenantId();

  // if ownerAdmin not provided, createdBy can be ownerAdmin (optional)
  const ownerAdmin = payload.ownerAdmin || createdBy || undefined;

  // Build doc
  const doc: Partial<TTenant> = {
    tenantId,
    name: payload.name as string,
    email: payload.email,
    phone: payload.phone,
    address: payload.address,
    ownerAdmin,
    logo: payload.logo,
    status: payload.status || 'active',
  };

  // Save
  const created = await Tenant.create(doc);
  return created;
};

const getAllTenantsFromDB = async () => {
  return Tenant.find().lean();
};

const getSingleTenantFromDB = async (tenantId: string) => {
  const tenant = await Tenant.findOne({ tenantId }).lean();
  if (!tenant) throw new AppError(httpStatus.NOT_FOUND, 'Tenant not found');
  return tenant;
};

const updateTenantIntoDB = async (tenantId: string, payload: Partial<TTenant>) => {
  const updated = await Tenant.findOneAndUpdate({ tenantId }, payload, { new: true });
  if (!updated) throw new AppError(httpStatus.NOT_FOUND, 'Tenant not found');
  return updated;
};

const deleteTenantFromDB = async (tenantId: string) => {
  // soft delete — set status inactive
  const deleted = await Tenant.findOneAndUpdate({ tenantId }, { status: 'inactive' }, { new: true });
  if (!deleted) throw new AppError(httpStatus.NOT_FOUND, 'Tenant not found');
  return deleted;
};

export const TenantService = {
  createTenantIntoDb,
  getAllTenantsFromDB,
  getSingleTenantFromDB,
  updateTenantIntoDB,
  deleteTenantFromDB,
};
