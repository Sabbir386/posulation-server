import { z } from 'zod';
import { BloodGroup, Gender } from './normalUser.constant';

export const createNormalUserValidationSchema = z.object({
  body: z.object({
    password: z.string().max(20).optional(),
    normalUser: z.object({
      name: z.string().min(1).max(40),
      gender: z.enum([...Gender] as [string, ...string[]]).optional(),
      dateOfBirth: z.string().optional(),
      email: z.string().email(),
      ip: z.string().optional(),
      device: z.string().optional(),
      deviceFingerprint: z.string().min(1).optional(), // Required and must be a non-empty string
      country: z.string().optional(),
      contactNo: z.string().optional(),
      emergencyContactNo: z.string().optional(),
      tenantId: z.string().optional(),
      bloodGroup: z.enum([...BloodGroup] as [string, ...string[]]).optional(),
      state: z.string().optional(),
      city: z.string().optional(),
      postalCode: z.string().optional(),
      presentAddress: z.string().optional(),
      permanentAddress: z.string().optional(),
    }),
  }),
});



export const updateNormalUserValidationSchema = z.object({
  body: z.object({
    normalUser: z.object({
      name: z.string().min(1).max(40).optional(),
      referralId: z.string().optional(),
      referredBy: z.string().optional(),
      refferCount: z.string().optional(),
      designation: z.string().max(30).optional(),
      gender: z.enum([...Gender] as [string, ...string[]]).optional(),
      dateOfBirth: z.string().optional(),
      email: z.string().email().optional(),
      tenantId: z.string().optional(),
      contactNo: z.string().optional(),
      emergencyContactNo: z.string().optional(),
      bloodGroup: z.enum([...BloodGroup] as [string, ...string[]]).optional(),
      state: z.string().optional(),
      city: z.string().optional(),
      postalCode: z.string().optional(),
      presentAddress: z.string().optional(),
      permanentAddress: z.string().optional(),
    }),
  }),
});

export const NormalUserValidations = {
  createNormalUserValidationSchema,
  updateNormalUserValidationSchema,
};
