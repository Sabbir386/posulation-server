import { z } from "zod";

export const createProductValidation = z.object({
    body: z.object({
        name: z.string({ required_error: "Product name is required" }).min(2),
        supplierId: z.string({ required_error: "SupplierId is required" }),
        price: z.number({ required_error: "Price is required" }).positive(),
        stock: z.number().nonnegative().optional(),
        description: z.string().optional(),
        category: z.string().optional(),
        imageUrl: z.string().url().optional(),
    }),
});

export const updateProductValidation = z.object({
    body: z.object({
        name: z.string().min(2).optional(),
        supplierId: z.string().optional(),
        price: z.number().positive().optional(),
        stock: z.number().nonnegative().optional(),
        description: z.string().optional(),
        category: z.string().optional(),
        imageUrl: z.string().url().optional(),
        status: z.enum(["active", "inactive"]).optional(),
    }),
});
