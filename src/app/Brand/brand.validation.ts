import { z } from "zod";

const statusEnum = z.enum(["active", "inactive"]);

export const createBrandSchema = z.object({
  body: z.object({
    name: z.string().min(2, "Brand name is required"),
    slug: z.string().min(2, "Brand slug is required"),
    imageUrl: z.string().url().optional(),
    status: statusEnum.optional(),
  }),
});

export const updateBrandSchema = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
    slug: z.string().min(2).optional(),
    imageUrl: z.string().url().optional(),
    status: statusEnum.optional(),
    isDeleted: z.boolean().optional(),
  }),
});

export const brandIdParamSchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
});

export const getBrandListQuerySchema = z.object({
  query: z.object({
    search: z.string().optional(),
    status: statusEnum.optional(),
    sortBy: z.enum(["createdAt", "name"]).optional(),
    sortOrder: z.enum(["asc", "desc"]).optional(),
    page: z.coerce.number().min(1).optional(),
    limit: z.coerce.number().min(1).max(200).optional(),
  }),
});
