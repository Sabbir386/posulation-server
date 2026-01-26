import { Schema, model } from 'mongoose';
import { NormalUserModel, TNormalUser } from './normalUser.interface';
import { BloodGroup, Gender } from './normalUser.constant'; // Ensure these constants are defined appropriately

// Define the NormalUser schema
const NormalUserSchema = new Schema<TNormalUser, NormalUserModel>(
  {
    id: {
      type: String,
      required: [true, 'ID is required'],
      unique: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      required: [true, 'User id is required'],
      unique: true,
      ref: 'User',
    },
    designation: {
      type: String,
    },
    ip: {
      type: String,
      // unique: true,
      // sparse: true,
    },
    device: {
      type: String, 
      // required: [true, 'Device signature is required'], 
      // unique: true,
    },
    deviceFingerprint: {
      type: String,
      unique: true, // Ensure it's unique across users
      sparse: true, // Allow null values for legacy users
    },
    
    country: {
      type: String,
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
    },
    referralId: { type: String, unique: true },
    referredBy: { type: String, default: null },
    refferCount: {
      type: Number,
      default: 0,
    },
    gender: {
      type: String,
      enum: {
        values: Object.values(Gender), // Use Object.values for enum values
        message: '{VALUE} is not a valid gender',
      },
      required: [true, 'Gender is required'],
    },
    dateOfBirth: { type: Date },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
    },
   tenantId: { type: String, required: true, unique: true, index: true },

    contactNo: { type: String },
    emergencyContactNo: {
      type: String,
    },
    bloodGroup: {
      type: String,
      enum: {
        values: Object.values(BloodGroup), // Use Object.values for enum values
        message: '{VALUE} is not a valid blood group',
      },
    },
    state: {
      type: String,
    },
    city: {
      type: String,
    },
    postalCode: {
      type: String,
    },
    presentAddress: {
      type: String,
      required: [true, 'Present address is required'],
    },
    permanentAddress: {
      type: String,
    },
    profileImg: { type: String, default: '' },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
  },
);

// Filter out deleted documents
NormalUserSchema.pre('find', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

NormalUserSchema.pre('findOne', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

NormalUserSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  next();
});

// Static methods to check if user exists
NormalUserSchema.statics.isUserExists = async function (id: string) {
  const existingUser = await this.findOne({ id });
  return existingUser;
};

NormalUserSchema.statics.isIPExists = async function (ip: string) {
  const existingUser = await this.findOne({ ip });
  return existingUser;
};
// NormalUserSchema.statics.isDeviceExists = async function (device: string) {
//   return await this.findOne({ device });
// };




// Export the model
export const NormalUser = model<TNormalUser, NormalUserModel>('NormalUser', NormalUserSchema);
