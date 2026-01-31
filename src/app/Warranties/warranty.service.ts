import httpStatus from "http-status";
import AppError from "../errors/AppError";
import { Warranty } from "./warranty.model";
import { TWarranty } from "./warranty.interface";

type TListOpts = {
    search?: string;
    status?: "active" | "inactive";
    sortBy?: "createdAt" | "name" | "duration";
    sortOrder?: "asc" | "desc";
    page?: number;
    limit?: number;
};

export const WarrantyService = {
    async createIntoDB(payload: Partial<TWarranty>, user: any, tenantId: string) {
        if (!payload.name) throw new AppError(httpStatus.BAD_REQUEST, "Warranty is required");
        if (!payload.description) throw new AppError(httpStatus.BAD_REQUEST, "Description is required");
        if (!payload.duration || payload.duration < 1)
            throw new AppError(httpStatus.BAD_REQUEST, "Duration must be >= 1");
        if (!payload.period) throw new AppError(httpStatus.BAD_REQUEST, "Period is required");

        const doc = await Warranty.create({
            tenantId,
            name: payload.name.trim(),
            description: payload.description.trim(),
            duration: payload.duration,
            period: payload.period,
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
                { description: { $regex: opts.search, $options: "i" } },
            ];
        }

        const sortBy = opts.sortBy ?? "createdAt";
        const sortOrder = opts.sortOrder ?? "desc";
        const sort: any = { [sortBy]: sortOrder === "asc" ? 1 : -1 };

        const [data, total] = await Promise.all([
            Warranty.find(filter).sort(sort).skip(skip).limit(limit),
            Warranty.countDocuments(filter),
        ]);

        return { meta: { page, limit, total }, data };
    },

    async getSingleFromDB(id: string, tenantId: string) {
        const doc = await Warranty.findOne({ _id: id, tenantId });
        if (!doc) throw new AppError(httpStatus.NOT_FOUND, "Warranty not found");
        return doc;
    },

    async updateIntoDB(id: string, tenantId: string, payload: Partial<TWarranty>, user: any) {
        const doc = await Warranty.findOneAndUpdate(
            { _id: id, tenantId },
            { ...payload, updatedBy: user?.objectId },
            { new: true }
        );

        if (!doc) throw new AppError(httpStatus.NOT_FOUND, "Warranty not found");
        return doc;
    },

    async deleteIntoDB(id: string, tenantId: string, user: any) {
        const doc = await Warranty.findOneAndUpdate(
            { _id: id, tenantId },
            { isDeleted: true, status: "inactive", updatedBy: user?.objectId },
            { new: true }
        );

        if (!doc) throw new AppError(httpStatus.NOT_FOUND, "Warranty not found");
        return doc;
    },
};
