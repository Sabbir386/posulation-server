import { Schema, model } from 'mongoose';
import { TTenant, TenantModel } from './tenant.interface';

const tenantSchema = new Schema<TTenant, TenantModel>(
  {
    tenantId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String },
    phone: { type: String },
    address: { type: String },
    ownerAdmin: { type: Schema.Types.ObjectId, ref: 'User' },
    logo: { type: String },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
  },
  { timestamps: true },
);

export const Tenant = model<TTenant, TenantModel>('Tenant', tenantSchema);
