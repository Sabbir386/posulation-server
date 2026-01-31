import { Model, Types } from "mongoose";

export type TVariantStatus = "active" | "inactive";

export type TVariantAttribute = {
    tenantId: string;

    name: string;        // Variant (e.g., Size)
    values: string[];    // Values (e.g., ["XS","S","M"])

    status: TVariantStatus;
    isDeleted: boolean;

    createdBy?: Types.ObjectId;
    updatedBy?: Types.ObjectId;
};

export type VariantAttributeModel = Model<TVariantAttribute>;
