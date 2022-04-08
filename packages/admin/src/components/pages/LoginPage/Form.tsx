import { Button } from '@components/Button'
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
          console.log({ data })

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
          <h1 className="mb-3 ml-5 text-2xl font-semibold">
            <Trans i18nKey="Log in (step ...)" humanStep={humanStep}>
              Log in (step <strong>{{ humanStep }}</strong>).
            </Trans>
          </h1>
          <form
            onSubmit={handleSubmit(onSubmitCallback)}
            className="w-full rounded-lg border-2 border-project-border bg-white p-5 shadow-xl shadow-blue-100"
          >
            {step === 0 && <FirstStep />}
            <Button
              disabled={formState.isSubmitting}
              type="submit"
              color="success"
              className="mt-7"
            >
              {t(formState.isSubmitting ? 'Working...' : 'Log in')}
            </Button>
          </form>
          <div className="mt-3 text-center">
            <Link href="/reset-password">
              <a className="font-semibold hover:underline">
                {t('Forgot password?')}
              </a>
            </Link>
          </div>
        </div>
      </div>
    </FormProvider>
  )
}
