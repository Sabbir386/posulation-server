import { Model, Types } from "mongoose";

export type TBrandStatus = "active" | "inactive";

export type TBrand = {
  tenantId: string;

  name: string;        // Brand *
  slug: string;        // optional but recommended (unique per tenant)
  imageUrl?: string;   // logo/image

  status: TBrandStatus;
  isDeleted: boolean;

  createdBy?: Types.ObjectId;
  updatedBy?: Types.ObjectId;
};

export type BrandModel = Model<TBrand>;
