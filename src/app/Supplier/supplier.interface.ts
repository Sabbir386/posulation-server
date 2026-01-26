import mongoose, { Document, Model } from "mongoose";

export interface ISupplier extends Document {
  supplierId: string;
  tenantId: string;
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  balance?: number;
  createdBy: mongoose.Types.ObjectId;
  status: "active" | "inactive";
}

export interface SupplierModel extends Model<ISupplier> {}
