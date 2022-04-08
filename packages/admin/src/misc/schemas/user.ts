import { object, string } from 'yup'

export const updateUserSchema = object().shape({
  email: string().optional().nullable(),
})
