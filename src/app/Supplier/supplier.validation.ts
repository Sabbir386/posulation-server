import { z } from "zod";

export const createSupplierValidation = z.object({
  body: z.object({
    name: z.string().min(3, "Supplier name is required"),
    email: z.string().email().optional(),
    phone: z.string().regex(/^\+?[0-9]{7,15}$/).optional(),
    address: z.string().optional(),
  }),
});

export const updateSupplierValidation = z.object({
  body: z.object({
    name: z.string().min(3).optional(),
    email: z.string().email().optional(),
    phone: z.string().regex(/^\+?[0-9]{7,15}$/).optional(),
    address: z.string().optional(),
  }),
});
