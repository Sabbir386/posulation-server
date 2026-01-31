import { Schema, model } from "mongoose";
import { TUnit, UnitModel } from "./unit.interface";

const UnitSchema = new Schema<TUnit, UnitModel>(
  {
    tenantId: { type: String, required: true, index: true },

    name: { type: String, required: true, trim: true },
    shortName: { type: String, required: true, trim: true },

    status: { type: String, enum: ["active", "inactive"], default: "active" },
    isDeleted: { type: Boolean, default: false },

    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

// ✅ Unique per tenant (so same tenant can't create "kg" twice)
UnitSchema.index({ tenantId: 1, name: 1 }, { unique: true });
UnitSchema.index({ tenantId: 1, shortName: 1 }, { unique: true });

// hide deleted docs
UnitSchema.pre("find", function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});
UnitSchema.pre("findOne", function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});
UnitSchema.pre("aggregate", function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  next();
});

export const Unit = model<TUnit, UnitModel>("Unit", UnitSchema);
