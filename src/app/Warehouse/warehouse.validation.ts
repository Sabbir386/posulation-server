import { z } from "zod";

const statusEnum = z.enum(["active", "inactive"]);

export const createWarehouseSchema = z.object({
  body: z.object({
    storeId: z.string().min(1, "Store is required"),
    name: z.string().min(2, "Warehouse name is required"),
    slug: z.string().min(2, "Warehouse slug is required"),
    phone: z.string().optional(),
    address: z.string().optional(),
    status: statusEnum.optional(),
  }),
});

export const updateWarehouseSchema = z.object({
  body: z.object({
    storeId: z.string().optional(),
    name: z.string().min(2).optional(),
    slug: z.string().min(2).optional(),
    phone: z.string().optional(),
    address: z.string().optional(),
    status: statusEnum.optional(),
    isDeleted: z.boolean().optional(),
  }),
});

export const warehouseIdParamSchema = z.object({
  params: z.object({ id: z.string().min(1) }),
});

export const getWarehouseListQuerySchema = z.object({
  query: z.object({
    storeId: z.string().optional(),
    search: z.string().optional(),
    status: statusEnum.optional(),
    page: z.coerce.number().min(1).optional(),
    limit: z.coerce.number().min(1).max(200).optional(),
    sortBy: z.enum(["createdAt", "name"]).optional(),
    sortOrder: z.enum(["asc", "desc"]).optional(),
  }),
});
