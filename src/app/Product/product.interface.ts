import { Model, Types } from "mongoose";

export type TStatus = "active" | "inactive";

export type TBarcodeSymbology = "CODE128" | "EAN13" | "UPC" | "QR";
export type TSellingType = "single" | "variant";

export type TProductVariantSelection = {
  attributeId: Types.ObjectId;  // VariantAttribute _id
  values: string[];             // selected values
};

export type TProduct = {
  tenantId: string;

  // required core
  storeId: Types.ObjectId;
  warehouseId: Types.ObjectId;

  name: string;
  slug: string;

  sku: string;
  sellingType: TSellingType;

  categoryId: Types.ObjectId;
  subCategoryId?: Types.ObjectId;

  brandId?: Types.ObjectId;
  unitId: Types.ObjectId;

  // barcode
  barcodeSymbology?: TBarcodeSymbology;
  itemBarcode?: string;

  // pricing & stock
  quantity: number;
  price: number;
  taxType?: string; // keep flexible (you can make enum later)

  // images
  images: string[];

  // custom fields
  warrantyId?: Types.ObjectId;
  manufacturer?: string;
  manufacturedDate?: Date;
  expiryOn?: Date;

  // variants
  variants?: TProductVariantSelection[];

  // meta
  description?: string;

  status: TStatus;
  isDeleted: boolean;

  createdBy?: Types.ObjectId;
  updatedBy?: Types.ObjectId;
};

export type ProductModel = Model<TProduct>;
