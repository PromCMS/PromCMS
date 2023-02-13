import { object, string, ref } from 'yup';

export const finalizeRegistrationFormSchema = object()
  .shape({
    new_password: string().required('This field is required'),
    confirmed_new_password: string()
      .required('This field is required')
      .oneOf([ref('new_password'), null], 'Passwords must match'),
    token: string().required('This field is required'),
  })
  .noUnknown();
