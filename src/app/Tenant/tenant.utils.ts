import { Tenant } from './tenant.model';

/**
 * Generates tenantId like: t-001, t-002, ...
 */
export const generateTenantId = async (): Promise<string> => {
  // find highest tenantId by sorting descending
  const lastTenant = await Tenant.findOne({}, { tenantId: 1 })
    .sort({ tenantId: -1 })
    .lean();

  if (!lastTenant || !lastTenant.tenantId) return 't-001';

  const parts = String(lastTenant.tenantId).split('-');
  const lastNumber = parseInt(parts[1], 10) || 0;
  const newNumber = lastNumber + 1;

  return `t-${newNumber.toString().padStart(3, '0')}`;
};
