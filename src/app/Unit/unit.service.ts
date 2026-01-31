import httpStatus from "http-status";
import AppError from "../errors/AppError";
import { Unit } from "./unit.model";
import { TUnit } from "./unit.interface";

type TListOpts = {
  search?: string;
  status?: "active" | "inactive";
  sortBy?: "createdAt" | "name" | "shortName";
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
  withCounts?: boolean;
};

export const UnitService = {
  async createIntoDB(payload: Partial<TUnit>, user: any, tenantId: string) {
    if (!payload.name) throw new AppError(httpStatus.BAD_REQUEST, "Unit is required");
    if (!payload.shortName) throw new AppError(httpStatus.BAD_REQUEST, "Short Name is required");

    const doc = await Unit.create({
      tenantId,
      name: payload.name,
      shortName: payload.shortName,
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
        { shortName: { $regex: opts.search, $options: "i" } },
      ];
    }

    const sortBy = opts.sortBy ?? "createdAt";
    const sortOrder = opts.sortOrder ?? "desc";
    const sort: any = { [sortBy]: sortOrder === "asc" ? 1 : -1 };

    // ✅ Simple list (fast)
    const [data, total] = await Promise.all([
      Unit.find(filter).sort(sort).skip(skip).limit(limit),
      Unit.countDocuments(filter),
    ]);

    return { meta: { page, limit, total }, data };
  },

  async getSingleFromDB(id: string, tenantId: string) {
    const doc = await Unit.findOne({ _id: id, tenantId });
    if (!doc) throw new AppError(httpStatus.NOT_FOUND, "Unit not found");
    return doc;
  },

  async updateIntoDB(id: string, tenantId: string, payload: Partial<TUnit>, user: any) {
    const doc = await Unit.findOneAndUpdate(
      { _id: id, tenantId },
      { ...payload, updatedBy: user?.objectId },
      { new: true }
    );

    if (!doc) throw new AppError(httpStatus.NOT_FOUND, "Unit not found");
    return doc;
  },

  async deleteIntoDB(id: string, tenantId: string, user: any) {
    const doc = await Unit.findOneAndUpdate(
      { _id: id, tenantId },
      { isDeleted: true, status: "inactive", updatedBy: user?.objectId },
      { new: true }
    );

    if (!doc) throw new AppError(httpStatus.NOT_FOUND, "Unit not found");
    return doc;
  },

  /**
   * ⭐ OPTIONAL: Units list with "noOfProducts" counts
   * Requires your Product model to have unitId: ObjectId of Unit
   * Example product field:
   *    unitId: { type: Schema.Types.ObjectId, ref: "Unit" }
   */
  async getAllWithProductCounts(tenantId: string, opts: TListOpts) {
    const page = opts.page ?? 1;
    const limit = opts.limit ?? 20;
    const skip = (page - 1) * limit;

    const match: any = { tenantId, isDeleted: { $ne: true } };
    if (opts.status) match.status = opts.status;

    if (opts.search) {
      match.$or = [
        { name: { $regex: opts.search, $options: "i" } },
        { shortName: { $regex: opts.search, $options: "i" } },
      ];
    }

    const sortBy = opts.sortBy ?? "createdAt";
    const sortOrder = opts.sortOrder ?? "desc";
    const sortStage: any = { [sortBy]: sortOrder === "asc" ? 1 : -1 };

    // IMPORTANT: Replace "products" with your real Product collection name in Mongo
    const pipeline: any[] = [
      { $match: match },
      { $sort: sortStage },
      { $skip: skip },
      { $limit: limit },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "unitId",
          as: "products",
          pipeline: [{ $match: { tenantId } }],
        },
      },
      {
        $addFields: {
          noOfProducts: { $size: "$products" },
        },
      },
      { $project: { products: 0 } },
    ];

    const data = await Unit.aggregate(pipeline);

    const total = await Unit.countDocuments(match);
    return { meta: { page, limit, total }, data };
  },
};
