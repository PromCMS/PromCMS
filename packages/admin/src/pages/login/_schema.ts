import { MESSAGES } from '@constants';
import { z } from 'zod';

export const loginFormSchema = z.discriminatedUnion('step', [
  z
    .object({
      step: z.literal(0),
      password: z.string({ required_error: MESSAGES.PLEASE_ENTER_PASSWORD }),
      email: z.string({ required_error: MESSAGES.PLEASE_ENTER_EMAIL }),
      token: z.string().optional(),
    })
    .strict(),
  z
    .object({
      step: z.literal(1),
      password: z.string().optional(),
      email: z.string().optional(),
      token: z.string().optional(),
    })
    .strict(),
  z
    .object({
      step: z.literal(2),
      password: z.string().optional(),
      email: z.string().optional(),
      token: z
        .string({ required_error: MESSAGES.PLEASE_ENTER_MFA_TOKEN })
        .length(6, MESSAGES.MFA_TOKEN_SHORT),
    })
    .strict(),
]);
