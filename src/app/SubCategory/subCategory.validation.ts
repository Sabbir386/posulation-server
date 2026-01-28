import { z } from "zod";

const statusEnum = z.enum(["active", "inactive"]);

export const createSubCategorySchema = z.object({
  body: z.object({
    categoryId: z.string().min(1, "Category is required"),
    subCategoryName: z.string().min(2, "Sub Category is required"),
    slug: z.string().min(2, "Slug is required"),
    code: z.string().min(2, "Category Code is required"),
    description: z.string().optional(),
    imageUrl: z.string().url().optional(),
    status: statusEnum.optional(),
  }),
});

export const updateSubCategorySchema = z.object({
  body: z.object({
    categoryId: z.string().min(1).optional(),
    subCategoryName: z.string().min(2).optional(),
    slug: z.string().min(2).optional(),
    code: z.string().min(2).optional(),
    description: z.string().optional(),
    imageUrl: z.string().url().optional(),
    status: statusEnum.optional(),
    isDeleted: z.boolean().optional(),
  }),
});

export const subCategoryIdParamSchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
});

export const getSubCategoryListQuerySchema = z.object({
  query: z.object({
    categoryId: z.string().optional(),
    search: z.string().optional(),
    status: statusEnum.optional(),
    page: z.coerce.number().min(1).optional(),
    limit: z.coerce.number().min(1).max(200).optional(),
  }),
});
