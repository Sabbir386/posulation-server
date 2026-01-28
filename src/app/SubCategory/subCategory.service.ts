import httpStatus from "http-status";

import { SubCategory } from "./subCategory.model";

import { TSubCategory } from "./subCategory.interface";
import { Types } from "mongoose";
import { Category } from "../Category/category.model";
import AppError from "../errors/AppError";

type TListOptions = {
  categoryId?: string;
  search?: string;
  status?: "active" | "inactive";
  page?: number;
  limit?: number;
};

export const SubCategoryService = {
  async createIntoDB(payload: any, user: any, tenantId: string) {
    // ✅ ensure category exists in same tenant
    const category = await Category.findOne({ _id: payload.categoryId, tenantId });
    if (!category) throw new AppError(httpStatus.BAD_REQUEST, "Invalid category for this tenant");

    const doc = await SubCategory.create({
      tenantId,
      categoryId: new Types.ObjectId(payload.categoryId),
      subCategoryName: payload.subCategoryName,
      slug: payload.slug,
      code: payload.code,
      description: payload.description ?? "",
      imageUrl: payload.imageUrl ?? "",
      status: payload.status ?? "active",
      createdBy: user?.objectId,
    });

    return doc;
  },

  async getAllFromDB(tenantId: string, opts: TListOptions) {
    const page = opts.page ?? 1;
    const limit = opts.limit ?? 20;
    const skip = (page - 1) * limit;

    const filter: any = { tenantId };

    if (opts.status) filter.status = opts.status;
    if (opts.categoryId) filter.categoryId = opts.categoryId;

    if (opts.search) {
      filter.$or = [
        { subCategoryName: { $regex: opts.search, $options: "i" } },
        { slug: { $regex: opts.search, $options: "i" } },
        { code: { $regex: opts.search, $options: "i" } },
      ];
    }

    const [data, total] = await Promise.all([
      SubCategory.find(filter)
        .populate("categoryId", "name slug")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      SubCategory.countDocuments(filter),
    ]);

    return { meta: { page, limit, total }, data };
  },

  async getSingleFromDB(id: string, tenantId: string) {
    const doc = await SubCategory.findOne({ _id: id, tenantId }).populate("categoryId", "name slug");
    if (!doc) throw new AppError(httpStatus.NOT_FOUND, "SubCategory not found");
    return doc;
  },

  async updateIntoDB(id: string, tenantId: string, payload: Partial<TSubCategory>, user: any) {
    // if categoryId is changing, validate tenant ownership
    if ((payload as any).categoryId) {
      const category = await Category.findOne({ _id: (payload as any).categoryId, tenantId });
      if (!category) throw new AppError(httpStatus.BAD_REQUEST, "Invalid category for this tenant");
    }

    const doc = await SubCategory.findOneAndUpdate(
      { _id: id, tenantId },
      { ...payload, updatedBy: user?.objectId },
      { new: true }
    );

    if (!doc) throw new AppError(httpStatus.NOT_FOUND, "SubCategory not found");
    return doc;
  },

  async deleteIntoDB(id: string, tenantId: string, user: any) {
    const doc = await SubCategory.findOneAndUpdate(
      { _id: id, tenantId },
      { isDeleted: true, status: "inactive", updatedBy: user?.objectId },
      { new: true }
    );

    if (!doc) throw new AppError(httpStatus.NOT_FOUND, "SubCategory not found");
    return doc;
  },
};
