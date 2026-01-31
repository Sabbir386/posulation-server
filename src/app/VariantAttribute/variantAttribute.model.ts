import { Schema, model } from "mongoose";
import { TVariantAttribute, VariantAttributeModel } from "./variantAttribute.interface";

const VariantAttributeSchema = new Schema<TVariantAttribute, VariantAttributeModel>(
    {
        tenantId: { type: String, required: true, index: true },

        name: { type: String, required: true, trim: true },
        values: { type: [String], required: true, default: [] },

        status: { type: String, enum: ["active", "inactive"], default: "active" },
        isDeleted: { type: Boolean, default: false },

        createdBy: { type: Schema.Types.ObjectId, ref: "User" },
        updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
    },
    { timestamps: true }
);

// ✅ same tenant can't create "Size" twice
VariantAttributeSchema.index({ tenantId: 1, name: 1 }, { unique: true });

// hide deleted docs
VariantAttributeSchema.pre("find", function (next) {
    this.find({ isDeleted: { $ne: true } });
    next();
});
VariantAttributeSchema.pre("findOne", function (next) {
    this.find({ isDeleted: { $ne: true } });
    next();
});
VariantAttributeSchema.pre("aggregate", function (next) {
    this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
    next();
});

export const VariantAttribute = model<TVariantAttribute, VariantAttributeModel>(
    "VariantAttribute",
    VariantAttributeSchema
);
