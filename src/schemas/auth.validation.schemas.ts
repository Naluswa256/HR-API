import { z } from 'zod';


 const registerSchema = {
  body: z.object({
    fullname: z
      .string()
      .min(1, 'Name is required')
      .trim(),
    email: z
      .string()
      .min(1, 'Email is required')
      .email('Must be a valid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters long')
      .regex(/\d/, 'Password must contain at least one number')
      .regex(/[a-zA-Z]/, 'Password must contain at least one letter'),
  })
};

// Define Zod schema for the login route input validation
 const loginSchema = {
  body: z.object({
    email: z
      .string()
      .min(1, 'Email is required')
      .email('Must be a valid email address'),
    password: z
      .string()
      .min(1, 'Password is required'),
  })
};
export type RegisterInput = z.infer<typeof registerSchema.body>;

// Define the request body type for the login route
export type LoginInput = z.infer<typeof loginSchema.body>;
const logout = {
  body: z.object({
    refreshToken: z.string(),
  }),
};

const refreshTokensSchema = {
  body: z.object({
    refreshToken: z.string(),
  }),
};

const forgotPasswordSchema = {
  body: z.object({
    email: z.string().email(),
  }),
};

const resetPasswordschema = {
  query: z.object({
    token: z.string(),
  }),
  body: z.object({
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters long')
      .regex(/\d/, 'Password must contain at least one number')
      .regex(/[a-zA-Z]/, 'Password must contain at least one letter'),
  }),
};

const verifyEmail = {
  query: z.object({
    token: z.string(),
  }),
};

export {
  verifyEmail, 
  resetPasswordschema, 
  forgotPasswordSchema,
  refreshTokensSchema,
  logout,
  loginSchema, 
  registerSchema

};