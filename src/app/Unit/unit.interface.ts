import { Model, Types } from "mongoose";

export type TUnitStatus = "active" | "inactive";

export type TUnit = {
  tenantId: string;

  name: string;       // Unit *
  shortName: string;  // Short Name *
  status: TUnitStatus;

  isDeleted: boolean;

  createdBy?: Types.ObjectId;
  updatedBy?: Types.ObjectId;
};

export type UnitModel = Model<TUnit>;
