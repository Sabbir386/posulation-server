import { Model, Types } from "mongoose";

export type TWarrantyStatus = "active" | "inactive";
export type TWarrantyPeriod = "day" | "week" | "month" | "year";

export type TWarranty = {
    tenantId: string;

    name: string;          // Warranty *
    duration: number;      // Duration *
    period: TWarrantyPeriod; // Period *

    description: string;   // Description *
    status: TWarrantyStatus;

    isDeleted: boolean;

    createdBy?: Types.ObjectId;
    updatedBy?: Types.ObjectId;
};

export type WarrantyModel = Model<TWarranty>;
