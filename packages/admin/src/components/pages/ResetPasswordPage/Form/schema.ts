import { object, string, ref } from 'yup'

export const initializeResetPasswordFormSchema = object()
  .shape({
    email: string()
      .email('Please enter valid email address')
      .required('Dont forget to include this value'),
  })
  .noUnknown()

export const finalizeResetPasswordFormSchema = object()
  .shape({
    new_password: string().required('Dont forget to include this value'),
    confirmed_new_password: string()
      .required('Dont forget to include this value')
      .oneOf([ref('new_password'), null], 'Passwords must match'),
    token: string().required('Dont forget to include this value'),
  })
  .noUnknown()
