import { z } from "zod";

const statusEnum = z.enum(["active", "inactive"]);

export const createStoreSchema = z.object({
  body: z.object({
    name: z.string().min(2, "Store name is required"),
    slug: z.string().min(2, "Store slug is required"),
    phone: z.string().optional(),
    email: z.string().email().optional(),
    address: z.string().optional(),
    status: statusEnum.optional(),
  }),
});

export const updateStoreSchema = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
    slug: z.string().min(2).optional(),
    phone: z.string().optional(),
    email: z.string().email().optional(),
    address: z.string().optional(),
    status: statusEnum.optional(),
    isDeleted: z.boolean().optional(),
  }),
});

export const storeIdParamSchema = z.object({
  params: z.object({ id: z.string().min(1) }),
});

export const getStoreListQuerySchema = z.object({
  query: z.object({
    search: z.string().optional(),
    status: statusEnum.optional(),
    page: z.coerce.number().min(1).optional(),
    limit: z.coerce.number().min(1).max(200).optional(),
    sortBy: z.enum(["createdAt", "name"]).optional(),
    sortOrder: z.enum(["asc", "desc"]).optional(),
  }),
});
