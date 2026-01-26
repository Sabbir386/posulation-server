import { z } from 'zod';
import { UserStatus } from './user.constant';

const userValidationSchema = z.object({
  body: z.object({
    password: z
      .string({
        invalid_type_error: 'Password must be string',
      })
      .max(20, { message: 'Password can not be more than 20 characters' })
      .optional(),
    referralId: z.string().optional(),
    referredBy: z.string().optional(),
    refferCount: z.string().optional(),
    country: z.string().optional(),
    gender: z.enum(['male', 'female', 'other']).optional(),
    isVerified:z.boolean().optional(),
    
  }),
});

const changeStatusValidationSchema = z.object({
  body: z.object({
    status: z.enum([...UserStatus] as [string, ...string[]]),
  }),
});

export const UserValidation = {
  userValidationSchema,
  changeStatusValidationSchema
};
