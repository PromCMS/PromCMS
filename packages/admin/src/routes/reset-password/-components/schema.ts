import { MESSAGES } from '@constants';
import { z } from 'zod';

export const initializeResetPasswordFormSchema = z
  .object({
    email: z
      .string({
        required_error: MESSAGES.FIELD_REQUIRED,
      })
      .email('Please enter valid email address'),
  })
  .strict();

export const finalizeResetPasswordFormSchema = z
  .object({
    new_password: z.string({
      required_error: MESSAGES.FIELD_REQUIRED,
    }),
    confirmed_new_password: z.string({
      required_error: MESSAGES.FIELD_REQUIRED,
    }),
    token: z.string({
      required_error: MESSAGES.FIELD_REQUIRED,
    }),
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
