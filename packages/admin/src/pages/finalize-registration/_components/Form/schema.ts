import { object, string, ref } from 'yup';

export const finalizeRegistrationFormSchema = object()
  .shape({
    new_password: string().required('Dont forget to include this value'),
    confirmed_new_password: string()
      .required('Dont forget to include this value')
      .oneOf([ref('new_password'), null], 'Passwords must match'),
    token: string().required('Dont forget to include this value'),
  })
  .noUnknown();
