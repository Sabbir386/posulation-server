import httpStatus from "http-status";
import AppError from "../errors/AppError";


export const resolveTenantId = (req: any) => {
  const role = req.user?.role;

  // only superAdmin can override via query
  if (role === "superAdmin" && req.query?.tenantId) return String(req.query.tenantId);

  const tenantId = req.user?.tenantId;
  if (!tenantId) throw new AppError(httpStatus.BAD_REQUEST, "tenantId is required");
  return String(tenantId);
};
