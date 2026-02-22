import { z } from 'zod'

export const authBaseSchema = z.object({
  email: z.string().trim().email('Masukkan email yang sah.'),
  password: z
    .string()
    .min(6, 'Password minimum 6 aksara.')
    .max(100, 'Password terlalu panjang.'),
})

export const signupSchema = authBaseSchema.extend({
  confirmPassword: z.string(),
}).refine((values) => values.password === values.confirmPassword, {
  message: 'Password dan confirmation mesti sama.',
  path: ['confirmPassword'],
})
