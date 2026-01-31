import { Schema, model } from "mongoose";
import { BrandModel, TBrand } from "./brand.interface";

const BrandSchema = new Schema<TBrand, BrandModel>(
  {
    tenantId: { type: String, required: true, index: true },

    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true, lowercase: true },

    imageUrl: { type: String, default: "" },

    status: { type: String, enum: ["active", "inactive"], default: "active" },
    isDeleted: { type: Boolean, default: false },

    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

// unique brand per tenant
BrandSchema.index({ tenantId: 1, slug: 1 }, { unique: true });
// optional: also prevent duplicate name (case sensitive)
// BrandSchema.index({ tenantId: 1, name: 1 }, { unique: true });

// hide deleted docs automatically
BrandSchema.pre("find", function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});
BrandSchema.pre("findOne", function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});
BrandSchema.pre("aggregate", function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  next();
});

export const Brand = model<TBrand, BrandModel>("Brand", BrandSchema);
