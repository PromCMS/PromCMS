import { MESSAGES } from '@constants';
import { z } from 'zod';

export const updateUserSchema = z.object({
  email: z.string().email('This is not valid email').optional().nullable(),
  name: z.string().optional().nullable(),
  role: z.number().optional().nullable(),
});

export const createUserSchema = z.object({
  email: z
    .string({
      required_error: MESSAGES.FIELD_REQUIRED,
    })
    .email('This is not valid email'),
  name: z.string({
    required_error: MESSAGES.FIELD_REQUIRED,
  }),
  role: z.number().optional().nullable(),
});
