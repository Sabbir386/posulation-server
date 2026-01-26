import { Request, Response, NextFunction } from 'express';

export const ensureTenant = (req: Request, res: Response, next: NextFunction) => {
    // superAdmin may have no tenantId
    const tenantId = (req.user as any)?.tenantId || (req.user as any)?.objectIdTenant;
    if (!tenantId) {
        return res.status(403).json({ message: 'Tenant context missing' });
    }
    // attach if not present
    (req as any).tenantId = tenantId;
    next();
};

// helper to inject tenantId into body if missing
export const injectTenantToBody = (req: Request, res: Response, next: NextFunction) => {
    if ((req.user as any)?.tenantId && !req.body.tenantId) {
        req.body.tenantId = (req.user as any).tenantId;
    }
    next();
};
