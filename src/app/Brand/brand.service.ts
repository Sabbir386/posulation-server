import httpStatus from "http-status";
import { Brand } from "./brand.model";
import { TBrand } from "./brand.interface";
import AppError from "../errors/AppError";

// small helper: make slug from name if frontend doesn't provide
const slugify = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

type TListOpts = {
  search?: string;
  status?: "active" | "inactive";
  sortBy?: "createdAt" | "name";
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
};

export const BrandService = {
  async createIntoDB(payload: Partial<TBrand>, user: any, tenantId: string) {
    const slug = payload.slug ? slugify(payload.slug) : slugify(payload.name || "");

    if (!payload.name) throw new AppError(httpStatus.BAD_REQUEST, "Brand name is required");
    if (!slug) throw new AppError(httpStatus.BAD_REQUEST, "Brand slug is required");

    const doc = await Brand.create({
      tenantId,
      name: payload.name,
      slug,
      imageUrl: payload.imageUrl ?? "",
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
      Brand.find(filter).sort(sort).skip(skip).limit(limit),
      Brand.countDocuments(filter),
    ]);

    return { meta: { page, limit, total }, data };
  },

  async getSingleFromDB(id: string, tenantId: string) {
    const doc = await Brand.findOne({ _id: id, tenantId });
    if (!doc) throw new AppError(httpStatus.NOT_FOUND, "Brand not found");
    return doc;
  },

  async updateIntoDB(id: string, tenantId: string, payload: Partial<TBrand>, user: any) {
    const updateData: any = { ...payload, updatedBy: user?.objectId };

    if (payload.name && !payload.slug) {
      updateData.slug = slugify(payload.name);
    }
    if (payload.slug) {
      updateData.slug = slugify(payload.slug);
    }

    const doc = await Brand.findOneAndUpdate(
      { _id: id, tenantId },
      updateData,
      { new: true }
    );

    if (!doc) throw new AppError(httpStatus.NOT_FOUND, "Brand not found");
    return doc;
  },

  async deleteIntoDB(id: string, tenantId: string, user: any) {
    const doc = await Brand.findOneAndUpdate(
      { _id: id, tenantId },
      { isDeleted: true, status: "inactive", updatedBy: user?.objectId },
      { new: true }
    );

    if (!doc) throw new AppError(httpStatus.NOT_FOUND, "Brand not found");
    return doc;
  },
};
