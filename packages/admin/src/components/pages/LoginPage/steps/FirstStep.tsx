import Input from '@components/form/Input'
import { VFC } from 'react'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

export const FirstStep: VFC = () => {
  const { t } = useTranslation()
  const {
    register,
    formState: { errors },
  } = useFormContext()

  return (
    <div className="grid w-full gap-3">
      <Input
        label={t('Email')}
        type="email"
        error={t(errors?.email?.message)}
        className="w-full"
        {...register('email')}
      />
      <Input
        label={t('Password')}
        type="password"
        error={t(errors?.password?.message)}
        className="w-full"
        {...register('password')}
      />
    </div>
  )
}
