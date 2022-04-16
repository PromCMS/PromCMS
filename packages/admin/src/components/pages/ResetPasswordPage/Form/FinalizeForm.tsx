import { Button } from '@components/Button'
import Input from '@components/form/Input'
import { CheckIcon, XIcon } from '@heroicons/react/solid'
import { yupResolver } from '@hookform/resolvers/yup'
import { useNotifications } from '@mantine/notifications'
import axios from 'axios'
import { ProfileService } from '@services'
import { VFC } from 'react'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import Link from 'next/link'

import { finalizeResetPasswordFormSchema } from './schema'
import { useTranslation } from 'react-i18next'

type FormValues = {
  new_password: string
  confirmed_new_password: string
  token: string
}

export const FinalizeForm: VFC<{ token?: string }> = ({ token }) => {
  const { t } = useTranslation()
  const notifications = useNotifications()
  const formMethods = useForm<FormValues>({
    resolver: yupResolver(finalizeResetPasswordFormSchema),
    defaultValues: {
      new_password: '',
      confirmed_new_password: '',
      token,
    },
  })
  const { register, formState, handleSubmit, setError } = formMethods

  const onSubmitCallback: SubmitHandler<FormValues> = async ({
    confirmed_new_password,
    ...values
  }) => {
    try {
      await ProfileService.finalizePasswordReset(values)
    } catch (e) {
      if (axios.isAxiosError(e)) {
        if (e.response?.status) {
          setError('token', { message: 'Your token seems expired...' })
        } else {
          notifications.showNotification({
            id: 'reset-password-finalization-notification',
            color: 'red',
            title: 'An error happened',
            message: 'An error happened during request. Please try again...',
          })
        }

        throw e
      }
    }
  }

  const tokenErrorMessage = formState.errors.token?.message
  const tokenFailed = !!tokenErrorMessage

  return (
    <FormProvider {...formMethods}>
      <div className="flex min-h-screen w-full">
        <div className="m-auto w-full max-w-lg">
          <h1 className="mb-3 ml-5 text-2xl font-semibold">
            {t('Create a new password')}
          </h1>
          <form
            onSubmit={handleSubmit(onSubmitCallback)}
            className="w-full rounded-lg border-2 border-project-border bg-white p-5 shadow-xl shadow-blue-100"
          >
            {!formState.isSubmitSuccessful && !tokenFailed ? (
              <>
                <div className="grid gap-5">
                  <Input
                    label={t('Your new password')}
                    className="w-full"
                    type="password"
                    error={t(formState.errors.new_password?.message || '')}
                    {...register('new_password')}
                  />
                  <Input
                    label={t('Your new password again')}
                    className="w-full"
                    type="password"
                    error={t(
                      formState.errors.confirmed_new_password?.message || ''
                    )}
                    {...register('confirmed_new_password')}
                  />
                </div>
                <Button
                  disabled={formState.isSubmitting}
                  type="submit"
                  color="success"
                  className="mt-7"
                >
                  {t(formState.isSubmitting ? 'Working...' : 'Send')}
                </Button>
              </>
            ) : (
              <>
                <div className="text-center">
                  {tokenFailed ? (
                    <XIcon className="mx-auto aspect-square w-16 text-red-400" />
                  ) : (
                    <CheckIcon className="mx-auto aspect-square w-16 text-green-400" />
                  )}
                  <p className="mt-3 text-xl">
                    {t(
                      tokenFailed
                        ? tokenErrorMessage
                        : 'We are done here! You can login again and continue with your work.'
                    )}
                  </p>
                  <Link href="/login">
                    <a className="mt-5 block font-semibold text-blue-400 hover:underline">
                      {t('Login to my account')}
                    </a>
                  </Link>
                </div>
              </>
            )}
          </form>
        </div>
      </div>
    </FormProvider>
  )
}
