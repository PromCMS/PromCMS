import { Button } from '@components/Button'
import Input from '@components/form/Input'
import { ProfileLayout } from '@components/pages/UserProfile'
import { MESSAGES } from '@constants'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { NextPage } from '@custom-types'

interface FormValues {
  newPassword: string
  oldPassword: string
}

const UserProfilePasswordPage: NextPage = () => {
  const { register } = useForm<FormValues>()
  const { t } = useTranslation()

  return (
    <ProfileLayout>
      <form className="mt-6 w-full max-w-6xl pb-5">
        <div className="grid w-full max-w-lg gap-4">
          <Input
            label={t(MESSAGES.NEW_PASSWORD)}
            className="w-full"
            {...register('newPassword')}
          />
          <Input
            label={t(MESSAGES.OLD_PASSWORD)}
            className="w-full"
            {...register('oldPassword')}
          />
        </div>
        <Button color="success" size="large" type="submit" className="mt-5">
          {t('Submit')}
        </Button>
      </form>
    </ProfileLayout>
  )
}

export default UserProfilePasswordPage
