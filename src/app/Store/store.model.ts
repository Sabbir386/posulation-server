import { Schema, model } from "mongoose";
import { StoreModel, TStore } from "./store.interface";

const StoreSchema = new Schema<TStore, StoreModel>(
  {
    tenantId: { type: String, required: true, index: true },

    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true },

    phone: { type: String, trim: true },
    email: { type: String, trim: true },
    address: { type: String, trim: true },

    status: { type: String, enum: ["active", "inactive"], default: "active" },
    isDeleted: { type: Boolean, default: false },

    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

StoreSchema.index({ tenantId: 1, slug: 1 }, { unique: true });

StoreSchema.pre("find", function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});
StoreSchema.pre("findOne", function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});
StoreSchema.pre("aggregate", function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  next();
});

export const Store = model<TStore, StoreModel>("Store", StoreSchema);
