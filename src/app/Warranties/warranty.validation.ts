import { z } from "zod";

const statusEnum = z.enum(["active", "inactive"]);
const periodEnum = z.enum(["day", "week", "month", "year"]);

export const createWarrantySchema = z.object({
    body: z.object({
        name: z.string().min(2, "Warranty is required"),
        duration: z.coerce.number().min(1, "Duration must be >= 1"),
        period: periodEnum,
        description: z.string().min(2, "Description is required"),
        status: statusEnum.optional(),
    }),
});

export const updateWarrantySchema = z.object({
    body: z.object({
        name: z.string().min(2).optional(),
        duration: z.coerce.number().min(1).optional(),
        period: periodEnum.optional(),
        description: z.string().min(2).optional(),
        status: statusEnum.optional(),
        isDeleted: z.boolean().optional(),
    }),
});

export const warrantyIdParamSchema = z.object({
    params: z.object({
        id: z.string().min(1),
    }),
});

export const getWarrantyListQuerySchema = z.object({
    query: z.object({
        search: z.string().optional(),
        status: statusEnum.optional(),
        page: z.coerce.number().min(1).optional(),
        limit: z.coerce.number().min(1).max(200).optional(),
        sortBy: z.enum(["createdAt", "name", "duration"]).optional(),
        sortOrder: z.enum(["asc", "desc"]).optional(),
    }),
});
