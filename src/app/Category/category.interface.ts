import { Model, Types } from "mongoose";

export type TCategoryStatus = "active" | "inactive";

export type TCategory = {
    tenantId: string;          // t-0002
    name: string;              // Category *
    slug: string;              // Category Slug *
    description?: string;
    imageUrl?: string;
    status: TCategoryStatus;   // active/inactive
    isDeleted: boolean;

    createdBy?: Types.ObjectId;
    updatedBy?: Types.ObjectId;
};

export type CategoryModel = Model<TCategory>;
