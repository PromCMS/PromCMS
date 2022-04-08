import { MESSAGES } from '@constants'
import { number, object, string } from 'yup'

export const loginFormSchema = object()
  .shape({
    step: number().required(),
    password: string().when('step', {
      is: 0,
      then: string().required(MESSAGES.PLEASE_ENTER_PASSWORD),
    }),
    email: string()
      .email()
      .when('step', {
        is: 0,
        then: string().required(MESSAGES.PLEASE_ENTER_EMAIL),
      }),
    token: string().when('step', {
      is: 2,
      then: string()
        .required(MESSAGES.PLEASE_ENTER_MFA_TOKEN)
        .length(6, MESSAGES.MFA_TOKEN_SHORT),
    }),
  })
  .noUnknown()
