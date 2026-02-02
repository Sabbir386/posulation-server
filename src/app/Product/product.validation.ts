import { z } from "zod";

const statusEnum = z.enum(["active", "inactive"]);
const sellingEnum = z.enum(["single", "variant"]);
const barcodeEnum = z.enum(["CODE128", "EAN13", "UPC", "QR"]);

const objectId = z.string().min(1);

export const createProductSchema = z.object({
  body: z.object({
    storeId: objectId,
    warehouseId: objectId,

    name: z.string().min(2, "Product name is required"),
    slug: z.string().min(2, "Slug is required"),

    sku: z.string().min(2, "SKU is required"),
    sellingType: sellingEnum.optional(),

    categoryId: objectId,
    subCategoryId: objectId.optional(),

    brandId: objectId.optional(),
    unitId: objectId,

    barcodeSymbology: barcodeEnum.optional(),
    itemBarcode: z.string().optional(),

    quantity: z.coerce.number().min(0, "Quantity must be >= 0"),
    price: z.coerce.number().min(0, "Price must be >= 0"),
    taxType: z.string().optional(),

    images: z.array(z.string()).optional(),

    warrantyId: objectId.optional(),
    manufacturer: z.string().optional(),
    manufacturedDate: z.coerce.date().optional(),
    expiryOn: z.coerce.date().optional(),

    variants: z
      .array(
        z.object({
          attributeId: objectId,
          values: z.array(z.string().min(1)).min(1),
        })
      )
      .optional(),

    description: z.string().optional(),

    status: statusEnum.optional(),
  }),
});

export const updateProductSchema = z.object({
  body: z.object({
    storeId: objectId.optional(),
    warehouseId: objectId.optional(),

    name: z.string().min(2).optional(),
    slug: z.string().min(2).optional(),

    sku: z.string().min(2).optional(),
    sellingType: sellingEnum.optional(),

    categoryId: objectId.optional(),
    subCategoryId: objectId.optional(),

    brandId: objectId.optional(),
    unitId: objectId.optional(),

    barcodeSymbology: barcodeEnum.optional(),
    itemBarcode: z.string().optional(),

    quantity: z.coerce.number().min(0).optional(),
    price: z.coerce.number().min(0).optional(),
    taxType: z.string().optional(),

    images: z.array(z.string()).optional(),

    warrantyId: objectId.optional(),
    manufacturer: z.string().optional(),
    manufacturedDate: z.coerce.date().optional(),
    expiryOn: z.coerce.date().optional(),

    variants: z
      .array(
        z.object({
          attributeId: objectId,
          values: z.array(z.string().min(1)).min(1),
        })
      )
      .optional(),

    description: z.string().optional(),

    status: statusEnum.optional(),
    isDeleted: z.boolean().optional(),
  }),
});

export const productIdParamSchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
});

export const getProductListQuerySchema = z.object({
  query: z.object({
    search: z.string().optional(),
    status: statusEnum.optional(),

    storeId: z.string().optional(),
    warehouseId: z.string().optional(),
    categoryId: z.string().optional(),
    subCategoryId: z.string().optional(),
    brandId: z.string().optional(),
    unitId: z.string().optional(),

    page: z.coerce.number().min(1).optional(),
    limit: z.coerce.number().min(1).max(200).optional(),

    sortBy: z.enum(["createdAt", "name", "price"]).optional(),
    sortOrder: z.enum(["asc", "desc"]).optional(),
  }),
});
