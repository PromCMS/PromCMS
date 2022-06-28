import { object, string, number } from 'yup'

export const updateUserSchema = object().shape({
  email: string().email('This is not valid email').optional().nullable(),
  name: string().optional().nullable(),
  role: number().optional().nullable(),
})

export const createUserSchema = object().shape({
  email: string()
    .email('This is not valid email')
    .required('This field is required'),
  name: string().required('This field is required'),
  role: number().optional().nullable(),
})
