import { MESSAGES } from '@constants';
import { z } from 'zod';

export const updateUserSchema = z.object({
  email: z.string().email('This is not valid email').optional().nullable(),
  firstname: z.string().optional().nullable(),
  lastname: z.string().optional().nullable(),
  role: z.string().optional().nullable(),
  avatar: z.object({ id: z.string() }).optional().nullable(),
});

export const createUserSchema = z.object({
  email: z
    .string({
      required_error: MESSAGES.FIELD_REQUIRED,
    })
    .email('This is not valid email'),

  firstname: z
    .string({
      required_error: MESSAGES.FIELD_REQUIRED,
    })
    .min(1, MESSAGES.FIELD_REQUIRED),

  lastname: z
    .string({
      required_error: MESSAGES.FIELD_REQUIRED,
    })
    .min(1, MESSAGES.FIELD_REQUIRED),

  state: z
    .string({
      required_error: MESSAGES.FIELD_REQUIRED,
    })
    .min(1, MESSAGES.FIELD_REQUIRED),

  avatar: z.object({ id: z.string() }),

  role: z.string().optional().nullable(),
});
