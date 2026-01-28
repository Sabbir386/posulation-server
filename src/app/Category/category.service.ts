import httpStatus from "http-status";
import { Category } from "./category.model";
import { TCategory } from "./category.interface";
import AppError from "../errors/AppError";

type TListOptions = {
    search?: string;
    status?: "active" | "inactive";
    page?: number;
    limit?: number;
};

export const CategoryService = {
    async createIntoDB(payload: Partial<TCategory>, user: any, tenantId: string) {
        const doc = await Category.create({
            tenantId,
            name: payload.name,
            slug: payload.slug,
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

        if (opts.search) {
            filter.$or = [
                { name: { $regex: opts.search, $options: "i" } },
                { slug: { $regex: opts.search, $options: "i" } },
            ];
        }

        const [data, total] = await Promise.all([
            Category.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
            Category.countDocuments(filter),
        ]);

        return {
            meta: { page, limit, total },
            data,
        };
    },

    async getSingleFromDB(id: string, tenantId: string) {
        const doc = await Category.findOne({ _id: id, tenantId });
        if (!doc) throw new AppError(httpStatus.NOT_FOUND, "Category not found");
        return doc;
    },

    async updateIntoDB(id: string, tenantId: string, payload: Partial<TCategory>, user: any) {
        const doc = await Category.findOneAndUpdate(
            { _id: id, tenantId },
            { ...payload, updatedBy: user?.objectId },
            { new: true }
        );
        if (!doc) throw new AppError(httpStatus.NOT_FOUND, "Category not found");
        return doc;
    },

    async deleteIntoDB(id: string, tenantId: string, user: any) {
        // soft delete (recommended)
        const doc = await Category.findOneAndUpdate(
            { _id: id, tenantId },
            { isDeleted: true, status: "inactive", updatedBy: user?.objectId },
            { new: true }
        );
        if (!doc) throw new AppError(httpStatus.NOT_FOUND, "Category not found");
        return doc;
    },
};
