import { z } from "zod";

const statusEnum = z.enum(["active", "inactive"]);

export const createUnitSchema = z.object({
    body: z.object({
        name: z.string().min(1, "Unit is required"),
        shortName: z.string().min(1, "Short Name is required"),
        status: statusEnum.optional(),
    }),
});

export const updateUnitSchema = z.object({
    body: z.object({
        name: z.string().min(1).optional(),
        shortName: z.string().min(1).optional(),
        status: statusEnum.optional(),
        isDeleted: z.boolean().optional(),
    }),
});

export const unitIdParamSchema = z.object({
    params: z.object({
        id: z.string().min(1),
    }),
});

export const getUnitListQuerySchema = z.object({
    query: z.object({
        search: z.string().optional(),
        status: statusEnum.optional(),
        sortBy: z.enum(["createdAt", "name", "shortName"]).optional(),
        sortOrder: z.enum(["asc", "desc"]).optional(),
        page: z.coerce.number().min(1).optional(),
        limit: z.coerce.number().min(1).max(200).optional(),
        withCounts: z.coerce.boolean().optional(), // ✅ optional: include noOfProducts
    }),
});
