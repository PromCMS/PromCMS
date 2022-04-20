import Input from '@components/form/Input'
import { Anchor, Group, PasswordInput, Text, TextInput } from '@mantine/core'
import Link from 'next/link'
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
      <TextInput
        label={t('Email')}
        type="email"
        error={t(errors?.email?.message)}
        className="w-full"
        {...register('email')}
      />
      <Group position="right" className="z-10 -mb-12">
        <Link href="/reset-password" passHref>
          <Anchor<'a'>
            sx={(theme) => ({
              paddingTop: 2,
              color:
                theme.colors[theme.primaryColor][
                  theme.colorScheme === 'dark' ? 4 : 6
                ],
              fontWeight: 500,
              fontSize: theme.fontSizes.xs,
            })}
          >
            {t('Forgot password?')}
          </Anchor>
        </Link>
      </Group>
      <PasswordInput
        label={t('Password')}
        type="password"
        error={t(errors?.password?.message)}
        className="w-full"
        {...register('password')}
      />
    </div>
  )
}
