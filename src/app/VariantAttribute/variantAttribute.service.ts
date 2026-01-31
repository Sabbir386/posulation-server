import httpStatus from "http-status";
import AppError from "../errors/AppError";
import { VariantAttribute } from "./variantAttribute.model";
import { TVariantAttribute } from "./variantAttribute.interface";

type TListOpts = {
    search?: string;
    status?: "active" | "inactive";
    sortBy?: "createdAt" | "name";
    sortOrder?: "asc" | "desc";
    page?: number;
    limit?: number;
};

export const VariantAttributeService = {
    async createIntoDB(payload: Partial<TVariantAttribute>, user: any, tenantId: string) {
        if (!payload.name) throw new AppError(httpStatus.BAD_REQUEST, "Variant is required");
        if (!payload.values?.length) throw new AppError(httpStatus.BAD_REQUEST, "Values are required");

        // remove duplicates like ["S","S"]
        const values = Array.from(new Set(payload.values.map((v) => v.trim()).filter(Boolean)));

        const doc = await VariantAttribute.create({
            tenantId,
            name: payload.name.trim(),
            values,
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
                { values: { $elemMatch: { $regex: opts.search, $options: "i" } } },
            ];
        }

        const sortBy = opts.sortBy ?? "createdAt";
        const sortOrder = opts.sortOrder ?? "desc";
        const sort: any = { [sortBy]: sortOrder === "asc" ? 1 : -1 };

        const [data, total] = await Promise.all([
            VariantAttribute.find(filter).sort(sort).skip(skip).limit(limit),
            VariantAttribute.countDocuments(filter),
        ]);

        return { meta: { page, limit, total }, data };
    },

    async getSingleFromDB(id: string, tenantId: string) {
        const doc = await VariantAttribute.findOne({ _id: id, tenantId });
        if (!doc) throw new AppError(httpStatus.NOT_FOUND, "Variant attribute not found");
        return doc;
    },

    async updateIntoDB(id: string, tenantId: string, payload: Partial<TVariantAttribute>, user: any) {
        const updateData: any = { ...payload, updatedBy: user?.objectId };

        if (payload.values) {
            updateData.values = Array.from(
                new Set(payload.values.map((v) => v.trim()).filter(Boolean))
            );
        }

        const doc = await VariantAttribute.findOneAndUpdate(
            { _id: id, tenantId },
            updateData,
            { new: true }
        );

        if (!doc) throw new AppError(httpStatus.NOT_FOUND, "Variant attribute not found");
        return doc;
    },

    async deleteIntoDB(id: string, tenantId: string, user: any) {
        const doc = await VariantAttribute.findOneAndUpdate(
            { _id: id, tenantId },
            { isDeleted: true, status: "inactive", updatedBy: user?.objectId },
            { new: true }
        );

        if (!doc) throw new AppError(httpStatus.NOT_FOUND, "Variant attribute not found");
        return doc;
    },
};
