import { MESSAGES } from '@constants';
import { z } from 'zod';

export const finalizeRegistrationFormSchema = z
  .object({
    new_password: z.string({ required_error: MESSAGES.FIELD_REQUIRED }),
    confirmed_new_password: z.string({
      required_error: MESSAGES.FIELD_REQUIRED,
    }),
    token: z.string({ required_error: MESSAGES.FIELD_REQUIRED }),
  })
  .strict()
  .superRefine((value, ctx) => {
    if (value.new_password !== value.confirmed_new_password) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: MESSAGES.PASSWORDS_MUST_MATCH,
      });
    }
  });
