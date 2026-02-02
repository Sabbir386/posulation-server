import { Schema, model } from "mongoose";
import { ProductModel, TProduct } from "./product.interface";

const ProductSchema = new Schema<TProduct, ProductModel>(
  {
    tenantId: { type: String, required: true, index: true },

    storeId: { type: Schema.Types.ObjectId, ref: "Store", required: true, index: true },
    warehouseId: { type: Schema.Types.ObjectId, ref: "Warehouse", required: true, index: true },

    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true, index: true },

    sku: { type: String, required: true, trim: true, index: true },
    sellingType: { type: String, enum: ["single", "variant"], default: "single" },

    categoryId: { type: Schema.Types.ObjectId, ref: "Category", required: true, index: true },
    subCategoryId: { type: Schema.Types.ObjectId, ref: "SubCategory", index: true },

    brandId: { type: Schema.Types.ObjectId, ref: "Brand", index: true },
    unitId: { type: Schema.Types.ObjectId, ref: "Unit", required: true, index: true },

    barcodeSymbology: { type: String, enum: ["CODE128", "EAN13", "UPC", "QR"], default: "CODE128" },
    itemBarcode: { type: String, trim: true },

    quantity: { type: Number, required: true, min: 0 },
    price: { type: Number, required: true, min: 0 },

    taxType: { type: String, trim: true },

    images: { type: [String], default: [] },

    warrantyId: { type: Schema.Types.ObjectId, ref: "Warranty", index: true },
    manufacturer: { type: String, trim: true },
    manufacturedDate: { type: Date },
    expiryOn: { type: Date },

    variants: {
      type: [
        {
          attributeId: { type: Schema.Types.ObjectId, ref: "VariantAttribute", required: true },
          values: { type: [String], required: true, default: [] },
        },
      ],
      default: [],
    },

    description: { type: String },

    status: { type: String, enum: ["active", "inactive"], default: "active" },
    isDeleted: { type: Boolean, default: false },

    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

// ✅ SKU unique per tenant (most important)
ProductSchema.index({ tenantId: 1, sku: 1 }, { unique: true });

// (optional) slug unique per tenant
ProductSchema.index({ tenantId: 1, slug: 1 }, { unique: true });

// soft delete filters
ProductSchema.pre("find", function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});
ProductSchema.pre("findOne", function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});
ProductSchema.pre("aggregate", function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  next();
});

export const Product = model<TProduct, ProductModel>("Product", ProductSchema);
