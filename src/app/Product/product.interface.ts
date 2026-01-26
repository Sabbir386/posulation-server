import mongoose, { Document, Model } from "mongoose";

export interface IProduct extends Document {
    tenantId: string;
    supplierId: string;
    name: string;
    description?: string;
    category?: string;
    price: number;
    stock: number;
    imageUrl?: string;
    status: "active" | "inactive";
    createdBy: mongoose.Types.ObjectId;
}

export interface ProductModel extends Model<IProduct> { }
