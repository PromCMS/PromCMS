import { useGlobalContext } from '@contexts/GlobalContext'
import { yupResolver } from '@hookform/resolvers/yup'
import { ProfileService } from '@services'
import { useRouter } from 'next/router'
import { VFC } from 'react'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import { FirstStep } from '.'
import { loginFormSchema } from './schema'
import Link from 'next/link'
import { Trans, useTranslation } from 'react-i18next'
import { Button, Paper, Title } from '@mantine/core'

interface LoginFormValues {
  email: string
  step: number
  password: string
  mfaImageUrl?: string
}

export const Form: VFC = () => {
  const { push } = useRouter()
  const { t } = useTranslation()
  const { updateValue } = useGlobalContext()
  const formMethods = useForm<LoginFormValues>({
    resolver: yupResolver(loginFormSchema),
    defaultValues: {
      step: 0,
      email: '',
      password: '',
      mfaImageUrl: '',
    },
  })

  const { watch, handleSubmit, formState, setError } = formMethods
  const step = watch('step')
  const humanStep = step + 1

  const onSubmitCallback: SubmitHandler<LoginFormValues> = async ({
    password,
    step,
    email,
  }) => {
    switch (step) {
      case 0:
        try {
          const { data } = await ProfileService.login({ password, email })
          // set current user since we are logged in
          updateValue('currentUser', data.data)

          // push user to main page
          push('/')
        } catch {
          setError('password', { message: 'Wrong email or password' })
          setError('email', { message: ' ' })
        }
        break
      default:
        console.error(`There are not implemented that much steps... (${step})`)
    }
  }

  return (
    <FormProvider {...formMethods}>
      <div className="flex min-h-screen w-full">
        <div className="m-auto w-full max-w-lg">
          <Title className="mb-3 ml-5 text-2xl font-semibold">
            <Trans i18nKey="Log in (step ...)" humanStep={humanStep}>
              Log in (step <strong>{{ humanStep }}</strong>).
            </Trans>
          </Title>
          <form onSubmit={handleSubmit(onSubmitCallback)}>
            <Paper shadow="xl" p="md" withBorder className="w-full">
              {step === 0 && <FirstStep />}
              <Button
                loading={formState.isSubmitting}
                type="submit"
                color="green"
                size="md"
                className="mt-7"
              >
                {t(formState.isSubmitting ? 'Working...' : 'Log in')}
              </Button>
            </Paper>
          </form>
        </div>
      </div>
    </FormProvider>
  )
}
