import { z } from 'zod';

export const createTenantValidation = z.object({
  body: z.object({
    // tenantId will be auto-generated, do not require from client
    name: z.string({ required_error: 'Tenant name is required' }).min(3),
    email: z.string().email().optional(),
    phone: z.string().regex(/^\+?[0-9]{7,15}$/, 'Phone number is invalid').optional(),
    address: z.string().optional(),
    ownerAdmin: z.string().optional(), // client may provide owner user _id (optional)
    logo: z.string().optional(),
  }),
});

export const updateTenantValidation = z.object({
  body: z.object({
    name: z.string().min(3).optional(),
    email: z.string().email().optional(),
    phone: z.string().regex(/^\+?[0-9]{7,15}$/, 'Phone number is invalid').optional(),
    address: z.string().optional(),
    ownerAdmin: z.string().optional(),
    logo: z.string().optional(),
    status: z.enum(['active', 'inactive']).optional(),
  }),
});
