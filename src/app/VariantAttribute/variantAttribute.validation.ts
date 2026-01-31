import { z } from "zod";

const statusEnum = z.enum(["active", "inactive"]);

const valuesInputSchema = z
    .union([
        z.array(z.string().min(1)).min(1, "Values are required"),
        z.string().min(1, "Values are required"), // "XS, S, M"
    ])
    .transform((val) => {
        if (Array.isArray(val)) {
            return val.map((v) => v.trim()).filter(Boolean);
        }
        return val
            .split(",")
            .map((v) => v.trim())
            .filter(Boolean);
    })
    .refine((arr) => arr.length > 0, "Values are required");

export const createVariantAttributeSchema = z.object({
    body: z.object({
        name: z.string().min(2, "Variant is required"),
        values: valuesInputSchema,
        status: statusEnum.optional(),
    }),
});

export const updateVariantAttributeSchema = z.object({
    body: z.object({
        name: z.string().min(2).optional(),
        values: valuesInputSchema.optional(),
        status: statusEnum.optional(),
        isDeleted: z.boolean().optional(),
    }),
});

export const variantAttributeIdParamSchema = z.object({
    params: z.object({
        id: z.string().min(1),
    }),
});

export const getVariantAttributeListQuerySchema = z.object({
    query: z.object({
        search: z.string().optional(),
        status: statusEnum.optional(),
        page: z.coerce.number().min(1).optional(),
        limit: z.coerce.number().min(1).max(200).optional(),
        sortBy: z.enum(["createdAt", "name"]).optional(),
        sortOrder: z.enum(["asc", "desc"]).optional(),
    }),
});
