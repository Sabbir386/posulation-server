import { Model, Types } from "mongoose";

export type TWarehouseStatus = "active" | "inactive";

export type TWarehouse = {
  tenantId: string;

  storeId: Types.ObjectId;   // ✅ link to Store
  name: string;
  slug: string;

  phone?: string;
  address?: string;

  status: TWarehouseStatus;
  isDeleted: boolean;

  createdBy?: Types.ObjectId;
  updatedBy?: Types.ObjectId;
};

export type WarehouseModel = Model<TWarehouse>;
