import httpStatus from "http-status";
import AppError from "../errors/AppError";
import { Product } from "./product.model";
import { Store } from "../Store/store.model";
import { Warehouse } from "../Warehouse/warehouse.model";
import { Category } from "../Category/category.model";
import { Unit } from "../Unit/unit.model";
import { SubCategory } from "../SubCategory/subCategory.model";
import { Brand } from "../Brand/brand.model";
import { Warranty } from "../Warranties/warranty.model";
import { VariantAttribute } from "../VariantAttribute/variantAttribute.model";

// referenced models (must exist)

const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");

type TListOpts = {
  search?: string;
  status?: "active" | "inactive";

  storeId?: string;
  warehouseId?: string;
  categoryId?: string;
  subCategoryId?: string;
  brandId?: string;
  unitId?: string;

  sortBy?: "createdAt" | "name" | "price";
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
};

export const ProductService = {
  async createIntoDB(payload: any, user: any, tenantId: string) {
    // slug fallback
    const slug = payload.slug ? slugify(payload.slug) : slugify(payload.name || "");
    if (!payload.name) throw new AppError(httpStatus.BAD_REQUEST, "Product name is required");
    if (!slug) throw new AppError(httpStatus.BAD_REQUEST, "Slug is required");
    if (!payload.sku) throw new AppError(httpStatus.BAD_REQUEST, "SKU is required");

    // ✅ validate references belong to tenant
    const [store, wh, cat, unit] = await Promise.all([
      Store.findOne({ _id: payload.storeId, tenantId }),
      Warehouse.findOne({ _id: payload.warehouseId, tenantId }),
      Category.findOne({ _id: payload.categoryId, tenantId }),
      Unit.findOne({ _id: payload.unitId, tenantId }),
    ]);

    if (!store) throw new AppError(httpStatus.BAD_REQUEST, "Store not found for this tenant");
    if (!wh) throw new AppError(httpStatus.BAD_REQUEST, "Warehouse not found for this tenant");
    if (!cat) throw new AppError(httpStatus.BAD_REQUEST, "Category not found for this tenant");
    if (!unit) throw new AppError(httpStatus.BAD_REQUEST, "Unit not found for this tenant");

    // warehouse must belong to the selected store (important)
    if (String(wh.storeId) !== String(store._id)) {
      throw new AppError(httpStatus.BAD_REQUEST, "Warehouse does not belong to selected store");
    }

    // optional refs
    if (payload.subCategoryId) {
      const sub = await SubCategory.findOne({ _id: payload.subCategoryId, tenantId });
      if (!sub) throw new AppError(httpStatus.BAD_REQUEST, "Sub category not found for this tenant");

      // if your SubCategory has categoryId, you can enforce match:
      // if (String(sub.categoryId) !== String(cat._id)) throw new AppError(400, "Sub category does not belong to selected category");
    }

    if (payload.brandId) {
      const b = await Brand.findOne({ _id: payload.brandId, tenantId });
      if (!b) throw new AppError(httpStatus.BAD_REQUEST, "Brand not found for this tenant");
    }

    if (payload.warrantyId) {
      const w = await Warranty.findOne({ _id: payload.warrantyId, tenantId });
      if (!w) throw new AppError(httpStatus.BAD_REQUEST, "Warranty not found for this tenant");
    }

    // variants validation (if provided)
    if (payload.variants?.length) {
      const ids = payload.variants.map((v: any) => v.attributeId);
      const found = await VariantAttribute
      .find({ _id: { $in: ids }, tenantId });
      if (found.length !== ids.length) {
        throw new AppError(httpStatus.BAD_REQUEST, "One or more variant attributes not found for this tenant");
      }
    }

    const doc = await Product.create({
      tenantId,

      storeId: payload.storeId,
      warehouseId: payload.warehouseId,

      name: payload.name,
      slug,

      sku: payload.sku,
      sellingType: payload.sellingType ?? "single",

      categoryId: payload.categoryId,
      subCategoryId: payload.subCategoryId,

      brandId: payload.brandId,
      unitId: payload.unitId,

      barcodeSymbology: payload.barcodeSymbology ?? "CODE128",
      itemBarcode: payload.itemBarcode,

      quantity: payload.quantity,
      price: payload.price,
      taxType: payload.taxType,

      images: payload.images ?? [],

      warrantyId: payload.warrantyId,
      manufacturer: payload.manufacturer,
      manufacturedDate: payload.manufacturedDate,
      expiryOn: payload.expiryOn,

      variants: payload.variants ?? [],

      description: payload.description,

      status: payload.status ?? "active",
      createdBy: user?.objectId,
    });

    return doc;
  },

  async getAllFromDB(tenantId: string, opts: TListOpts) {
    const page = opts.page ?? 1;
    const limit = opts.limit ?? 20;
    const skip = (page - 1) * limit;

    const filter: any = { tenantId };

    if (opts.status) filter.status = opts.status;
    if (opts.storeId) filter.storeId = opts.storeId;
    if (opts.warehouseId) filter.warehouseId = opts.warehouseId;
    if (opts.categoryId) filter.categoryId = opts.categoryId;
    if (opts.subCategoryId) filter.subCategoryId = opts.subCategoryId;
    if (opts.brandId) filter.brandId = opts.brandId;
    if (opts.unitId) filter.unitId = opts.unitId;

    if (opts.search) {
      filter.$or = [
        { name: { $regex: opts.search, $options: "i" } },
        { slug: { $regex: opts.search, $options: "i" } },
        { sku: { $regex: opts.search, $options: "i" } },
      ];
    }

    const sortBy = opts.sortBy ?? "createdAt";
    const sortOrder = opts.sortOrder ?? "desc";
    const sort: any = { [sortBy]: sortOrder === "asc" ? 1 : -1 };

    const [data, total] = await Promise.all([
      Product.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .populate("storeId", "name slug")
        .populate("warehouseId", "name slug storeId")
        .populate("categoryId", "name slug")
        .populate("subCategoryId", "name slug")
        .populate("brandId", "name slug imageUrl")
        .populate("unitId", "name shortName")
        .populate("warrantyId", "name duration period")
        .populate("variants.attributeId", "name values"),
      Product.countDocuments(filter),
    ]);

    return { meta: { page, limit, total }, data };
  },

  async getSingleFromDB(id: string, tenantId: string) {
    const doc = await Product.findOne({ _id: id, tenantId })
      .populate("storeId", "name slug")
      .populate("warehouseId", "name slug storeId")
      .populate("categoryId", "name slug")
      .populate("subCategoryId", "name slug")
      .populate("brandId", "name slug imageUrl")
      .populate("unitId", "name shortName")
      .populate("warrantyId", "name duration period")
      .populate("variants.attributeId", "name values");

    if (!doc) throw new AppError(httpStatus.NOT_FOUND, "Product not found");
    return doc;
  },

  async updateIntoDB(id: string, tenantId: string, payload: any, user: any) {
    const updateData: any = { ...payload, updatedBy: user?.objectId };

    if (payload.name && !payload.slug) updateData.slug = slugify(payload.name);
    if (payload.slug) updateData.slug = slugify(payload.slug);

    // ✅ if store/warehouse changes, validate again
    if (payload.storeId) {
      const store = await Store.findOne({ _id: payload.storeId, tenantId });
      if (!store) throw new AppError(httpStatus.BAD_REQUEST, "Store not found for this tenant");
    }
    if (payload.warehouseId) {
      const wh = await Warehouse.findOne({ _id: payload.warehouseId, tenantId });
      if (!wh) throw new AppError(httpStatus.BAD_REQUEST, "Warehouse not found for this tenant");
    }

    if (payload.categoryId) {
      const cat = await Category.findOne({ _id: payload.categoryId, tenantId });
      if (!cat) throw new AppError(httpStatus.BAD_REQUEST, "Category not found for this tenant");
    }
    if (payload.subCategoryId) {
      const sub = await SubCategory.findOne({ _id: payload.subCategoryId, tenantId });
      if (!sub) throw new AppError(httpStatus.BAD_REQUEST, "Sub category not found for this tenant");
    }
    if (payload.brandId) {
      const b = await Brand.findOne({ _id: payload.brandId, tenantId });
      if (!b) throw new AppError(httpStatus.BAD_REQUEST, "Brand not found for this tenant");
    }
    if (payload.unitId) {
      const u = await Unit.findOne({ _id: payload.unitId, tenantId });
      if (!u) throw new AppError(httpStatus.BAD_REQUEST, "Unit not found for this tenant");
    }
    if (payload.warrantyId) {
      const w = await Warranty.findOne({ _id: payload.warrantyId, tenantId });
      if (!w) throw new AppError(httpStatus.BAD_REQUEST, "Warranty not found for this tenant");
    }

    if (payload.variants?.length) {
      const ids = payload.variants.map((v: any) => v.attributeId);
      const found = await VariantAttribute.find({ _id: { $in: ids }, tenantId });
      if (found.length !== ids.length) {
        throw new AppError(httpStatus.BAD_REQUEST, "One or more variant attributes not found for this tenant");
      }
    }

    const doc = await Product.findOneAndUpdate({ _id: id, tenantId }, updateData, { new: true });
    if (!doc) throw new AppError(httpStatus.NOT_FOUND, "Product not found");
    return doc;
  },

  async deleteIntoDB(id: string, tenantId: string, user: any) {
    const doc = await Product.findOneAndUpdate(
      { _id: id, tenantId },
      { isDeleted: true, status: "inactive", updatedBy: user?.objectId },
      { new: true }
    );

    if (!doc) throw new AppError(httpStatus.NOT_FOUND, "Product not found");
    return doc;
  },
};
