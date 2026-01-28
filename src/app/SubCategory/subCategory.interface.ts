import { Model, Types } from "mongoose";

export type TSubCategoryStatus = "active" | "inactive";

export type TSubCategory = {
  tenantId: string;

  categoryId: Types.ObjectId; // reference Category _id
  subCategoryName: string;
  slug: string;

  code: string;         // "Category Code *" (from UI)
  description?: string;
  imageUrl?: string;

  status: TSubCategoryStatus;
  isDeleted: boolean;

  createdBy?: Types.ObjectId;
  updatedBy?: Types.ObjectId;
};

export type SubCategoryModel = Model<TSubCategory>;
