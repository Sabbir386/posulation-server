import { Schema, model } from "mongoose";
import { TWarranty, WarrantyModel } from "./warranty.interface";

const WarrantySchema = new Schema<TWarranty, WarrantyModel>(
    {
        tenantId: { type: String, required: true, index: true },

        name: { type: String, required: true, trim: true },
        duration: { type: Number, required: true, min: 1 },
        period: { type: String, enum: ["day", "week", "month", "year"], required: true },

        description: { type: String, required: true, trim: true },

        status: { type: String, enum: ["active", "inactive"], default: "active" },
        isDeleted: { type: Boolean, default: false },

        createdBy: { type: Schema.Types.ObjectId, ref: "User" },
        updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
    },
    { timestamps: true }
);

// ✅ prevent duplicate warranty names per tenant
WarrantySchema.index({ tenantId: 1, name: 1 }, { unique: true });

// hide deleted docs
WarrantySchema.pre("find", function (next) {
    this.find({ isDeleted: { $ne: true } });
    next();
});
WarrantySchema.pre("findOne", function (next) {
    this.find({ isDeleted: { $ne: true } });
    next();
});
WarrantySchema.pre("aggregate", function (next) {
    this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
    next();
});

export const Warranty = model<TWarranty, WarrantyModel>("Warranty", WarrantySchema);
