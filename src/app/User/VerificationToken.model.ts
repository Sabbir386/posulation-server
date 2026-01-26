import mongoose, { Schema, Document } from 'mongoose';

interface IVerificationToken extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  token: string;
  expiresAt: Date;
}

const verificationTokenSchema = new Schema<IVerificationToken>({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  token: { type: String, required: true },
  expiresAt: { type: Date, required: true },
});

export const VerificationToken = mongoose.model<IVerificationToken>('VerificationToken', verificationTokenSchema);
