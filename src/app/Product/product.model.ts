import { Schema, model } from "mongoose";
import { IProduct, ProductModel } from "./product.interface";

const productSchema = new Schema<IProduct, ProductModel>(
    {
        supplierId: { type: String, required: true }, // s-001
        tenantId: { type: String, required: true },   // t-001  <-- FIXED
        name: { type: String, required: true },
        description: { type: String },
        category: { type: String },
        price: { type: Number, required: true },
        stock: { type: Number, default: 0 },
        imageUrl: { type: String },
        status: { type: String, enum: ["active", "inactive"], default: "active" },
        createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    },
    { timestamps: true }
);

export const Product = model<IProduct, ProductModel>("Product", productSchema);
