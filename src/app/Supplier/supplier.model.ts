import mongoose, { Schema } from "mongoose";
import { ISupplier, SupplierModel } from "./supplier.interface";

const SupplierSchema = new Schema<ISupplier, SupplierModel>(
  {
    supplierId: { type: String, required: true, unique: true },
    tenantId: {
      type: String,
      required: true,
      index: true
    },

    name: { type: String, required: true },
    phone: String,
    email: String,
    address: String,
    balance: { type: Number, default: 0 },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
  },
  { timestamps: true }
);

export const Supplier = mongoose.model<ISupplier, SupplierModel>("Supplier", SupplierSchema);
