import ImageSelect from '@components/form/ImageSelect'
import { VFC } from 'react'
import { Controller, useFormContext } from 'react-hook-form'

export const Image: VFC = () => {
  const { control } = useFormContext()

  return (
    <>
      <Controller
        name="content.data"
        control={control}
        render={({ field: { onChange, value } }) => (
          <ImageSelect label="Image" onChange={onChange} selected={value} />
        )}
      />
    </>
  )
}
