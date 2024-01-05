import { MESSAGES } from '@constants';
import { z } from 'zod';

export const loginFormSchema = z
  .object({
    password: z.string({ required_error: MESSAGES.PLEASE_ENTER_PASSWORD }),
    email: z.string({ required_error: MESSAGES.PLEASE_ENTER_EMAIL }),
  })
  .strict();
