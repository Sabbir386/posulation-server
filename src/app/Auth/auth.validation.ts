import { z } from 'zod';

// const loginValidationSchema = z.object({
//   body:z.object({
//     username: z.string({
//       required_error: 'username is Required',
//     }),
//     password: z
//       .string({
//         required_error: 'Password is Required',
//       })
//       .min(8, { message: 'Password can not be less then 8 character' }),
//   })
// });
const loginValidationSchema = z.object({
  body: z
    .object({
      id: z.string().optional(),
      email: z.string().email().optional(),
      password: z.string({ required_error: 'Password is required' }),
    })
    .refine((data) => data.id || data.email, {
      message: 'Either id or email is required',
      path: ['id', 'email'], // This causes a more helpful error message
    }),
});
const refreshTokenValidationSchema = z.object({
  cookies: z.object({
    refreshToken: z.string({
      required_error: 'Refresh token is required!',
    }),
  }),
});
const changePasswordValidationSchema = z.object({
  body: z.object({
    oldPassword: z.string({
      required_error: 'Old password is required',
    }),
    newPassword: z.string({ required_error: 'Password is required' }),
  }),
});
const forgetPasswordValidationSchema = z.object({
  body: z.object({
    email: z.string({
      required_error: 'Email is required!',
    }),
  }),
});

const resetPasswordValidationSchema = z.object({
  body: z.object({
    email: z.string({
      required_error: 'User id is required!',
    }),
    newPassword: z.string({
      required_error: 'User password is required!',
    }),
  }),
});
export const AuthValidation = {
  loginValidationSchema,
  refreshTokenValidationSchema,
  changePasswordValidationSchema,
  forgetPasswordValidationSchema,
  resetPasswordValidationSchema,
};
