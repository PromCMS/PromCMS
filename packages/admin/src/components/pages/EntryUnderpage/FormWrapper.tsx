import { FC } from 'react'
import { useFormContext } from 'react-hook-form'
import { ItemFormValues } from './types'
import { useOnSubmitCallback } from './useOnSubmitCallback'

export const FormWrapper: FC = ({ children }) => {
  const { handleSubmit } = useFormContext<ItemFormValues>()
  const onSubmitCallback = useOnSubmitCallback()

  return (
    <form onSubmit={handleSubmit(onSubmitCallback)} autoComplete="off">
      {children}
    </form>
  )
}
