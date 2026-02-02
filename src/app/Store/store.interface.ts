import { Model, Types } from "mongoose";

export type TStoreStatus = "active" | "inactive";

export type TStore = {
  tenantId: string;

  name: string;
  slug: string;

  phone?: string;
  email?: string;
  address?: string;

  status: TStoreStatus;
  isDeleted: boolean;

  createdBy?: Types.ObjectId;
  updatedBy?: Types.ObjectId;
};

export type StoreModel = Model<TStore>;
