import { Model, Types } from 'mongoose';

export type TTenantStatus = 'active' | 'inactive';

export type TTenant = {
  _id?: Types.ObjectId;
  tenantId: string; // t-001
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  ownerAdmin?: Types.ObjectId; // reference to User._id
  logo?: string;
  status: TTenantStatus;
  createdAt?: Date;
  updatedAt?: Date;
};

export interface TenantModel extends Model<TTenant> {}
