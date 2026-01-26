// utils/resolveTenant.ts
import httpStatus from "http-status";
import AppError from "../errors/AppError";

export const resolveTenantId = (req: any) => {
    const tenantId = req.user.tenantId || req.query.tenantId;

    if (!tenantId) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            "tenantId is required (from JWT or ?tenantId=)"
        );
    }

    return tenantId;
};
