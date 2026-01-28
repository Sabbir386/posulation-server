import { Schema, model } from "mongoose";
import { TSubCategory, SubCategoryModel } from "./subCategory.interface";

const SubCategorySchema = new Schema<TSubCategory, SubCategoryModel>(
  {
    tenantId: { type: String, required: true, index: true },

    categoryId: { type: Schema.Types.ObjectId, ref: "Category", required: true, index: true },

    subCategoryName: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true, lowercase: true },

    code: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    imageUrl: { type: String, default: "" },

    status: { type: String, enum: ["active", "inactive"], default: "active" },
    isDeleted: { type: Boolean, default: false },

    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

// ✅ unique within tenant + category
SubCategorySchema.index({ tenantId: 1, categoryId: 1, slug: 1 }, { unique: true });
SubCategorySchema.index({ tenantId: 1, code: 1 }, { unique: true });

// hide deleted
SubCategorySchema.pre("find", function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});
SubCategorySchema.pre("findOne", function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});
SubCategorySchema.pre("aggregate", function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  next();
});

export const SubCategory = model<TSubCategory, SubCategoryModel>("SubCategory", SubCategorySchema);
