import { z } from "zod";

const statusEnum = z.enum(["active", "inactive"]);

export const createCategorySchema = z.object({
    body: z.object({
        name: z.string().min(2, "Category name is required"),
        slug: z.string().min(2, "Category slug is required"),
        description: z.string().optional(),
        imageUrl: z.string().url().optional(),
        status: statusEnum.optional(),
    }),
});

export const updateCategorySchema = z.object({
    body: z.object({
        name: z.string().min(2).optional(),
        slug: z.string().min(2).optional(),
        description: z.string().optional(),
        imageUrl: z.string().url().optional(),
        status: statusEnum.optional(),
        isDeleted: z.boolean().optional(),
    }),
});

export const categoryIdParamSchema = z.object({
    params: z.object({
        id: z.string().min(1),
    }),
});

export const getCategoryListQuerySchema = z.object({
    query: z.object({
        search: z.string().optional(),
        status: statusEnum.optional(),
        page: z.coerce.number().min(1).optional(),
        limit: z.coerce.number().min(1).max(200).optional(),
    }),
});
