import { Schema, model } from "mongoose";
import { TWarehouse, WarehouseModel } from "./warehouse.interface";

const WarehouseSchema = new Schema<TWarehouse, WarehouseModel>(
  {
    tenantId: { type: String, required: true, index: true },

    storeId: { type: Schema.Types.ObjectId, ref: "Store", required: true, index: true },

    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true },

    phone: { type: String, trim: true },
    address: { type: String, trim: true },

    status: { type: String, enum: ["active", "inactive"], default: "active" },
    isDeleted: { type: Boolean, default: false },

    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

// unique per store per tenant
WarehouseSchema.index({ tenantId: 1, storeId: 1, slug: 1 }, { unique: true });

WarehouseSchema.pre("find", function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});
WarehouseSchema.pre("findOne", function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});
WarehouseSchema.pre("aggregate", function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  next();
});

export const Warehouse = model<TWarehouse, WarehouseModel>("Warehouse", WarehouseSchema);
