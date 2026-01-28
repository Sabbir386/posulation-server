import { Schema, model } from "mongoose";
import { TCategory, CategoryModel } from "./category.interface";

const CategorySchema = new Schema<TCategory, CategoryModel>(
  {
    tenantId: { type: String, required: true, index: true },

    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true, lowercase: true },

    description: { type: String, default: "" },
    imageUrl: { type: String, default: "" },

    status: { type: String, enum: ["active", "inactive"], default: "active" },
    isDeleted: { type: Boolean, default: false },

    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

// ✅ Prevent duplicates inside same tenant
CategorySchema.index({ tenantId: 1, slug: 1 }, { unique: true });
// optional (if you want unique names per tenant)
// CategorySchema.index({ tenantId: 1, name: 1 }, { unique: true });

// hide deleted by default
CategorySchema.pre("find", function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});
CategorySchema.pre("findOne", function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});
CategorySchema.pre("aggregate", function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  next();
});

export const Category = model<TCategory, CategoryModel>("Category", CategorySchema);
