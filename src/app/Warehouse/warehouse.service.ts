import httpStatus from "http-status";
import AppError from "../errors/AppError";
import { Warehouse } from "./warehouse.model";
import { Store } from "../Store/store.model";

const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");

type TListOpts = {
  storeId?: string;
  search?: string;
  status?: "active" | "inactive";
  page?: number;
  limit?: number;
  sortBy?: "createdAt" | "name";
  sortOrder?: "asc" | "desc";
};

export const WarehouseService = {
  async createIntoDB(payload: any, user: any, tenantId: string) {
    const slug = payload.slug ? slugify(payload.slug) : slugify(payload.name || "");
    if (!payload.name) throw new AppError(httpStatus.BAD_REQUEST, "Warehouse name is required");
    if (!payload.storeId) throw new AppError(httpStatus.BAD_REQUEST, "Store is required");
    if (!slug) throw new AppError(httpStatus.BAD_REQUEST, "Warehouse slug is required");

    // ✅ ensure store belongs to same tenant
    const store = await Store.findOne({ _id: payload.storeId, tenantId });
    if (!store) throw new AppError(httpStatus.BAD_REQUEST, "Store not found for this tenant");

    const doc = await Warehouse.create({
      tenantId,
      storeId: payload.storeId,
      name: payload.name,
      slug,
      phone: payload.phone,
      address: payload.address,
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

    if (opts.search) {
      filter.$or = [
        { name: { $regex: opts.search, $options: "i" } },
        { slug: { $regex: opts.search, $options: "i" } },
      ];
    }

    const sortBy = opts.sortBy ?? "createdAt";
    const sortOrder = opts.sortOrder ?? "desc";
    const sort: any = { [sortBy]: sortOrder === "asc" ? 1 : -1 };

    const [data, total] = await Promise.all([
      Warehouse.find(filter).sort(sort).skip(skip).limit(limit).populate("storeId", "name slug"),
      Warehouse.countDocuments(filter),
    ]);

    return { meta: { page, limit, total }, data };
  },

  async getSingleFromDB(id: string, tenantId: string) {
    const doc = await Warehouse.findOne({ _id: id, tenantId }).populate("storeId", "name slug");
    if (!doc) throw new AppError(httpStatus.NOT_FOUND, "Warehouse not found");
    return doc;
  },

  async updateIntoDB(id: string, tenantId: string, payload: any, user: any) {
    const updateData: any = { ...payload, updatedBy: user?.objectId };

    if (payload.name && !payload.slug) updateData.slug = slugify(payload.name);
    if (payload.slug) updateData.slug = slugify(payload.slug);

    // if changing storeId validate tenant store
    if (payload.storeId) {
      const store = await Store.findOne({ _id: payload.storeId, tenantId });
      if (!store) throw new AppError(httpStatus.BAD_REQUEST, "Store not found for this tenant");
    }

    const doc = await Warehouse.findOneAndUpdate({ _id: id, tenantId }, updateData, { new: true });
    if (!doc) throw new AppError(httpStatus.NOT_FOUND, "Warehouse not found");
    return doc;
  },

  async deleteIntoDB(id: string, tenantId: string, user: any) {
    const doc = await Warehouse.findOneAndUpdate(
      { _id: id, tenantId },
      { isDeleted: true, status: "inactive", updatedBy: user?.objectId },
      { new: true }
    );
    if (!doc) throw new AppError(httpStatus.NOT_FOUND, "Warehouse not found");
    return doc;
  },
};
