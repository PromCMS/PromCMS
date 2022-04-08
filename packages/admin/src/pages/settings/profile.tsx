import { Button } from '@components/Button'
import ImageSelect from '@components/form/ImageSelect'
import Input from '@components/form/Input'
import { ProfileLayout } from '@components/pages/UserProfile'
import { useGlobalContext } from '@contexts/GlobalContext'
import clsx from 'clsx'
import { DetailedHTMLProps, FC, HTMLAttributes } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { NextPage } from '@custom-types'

const Row: FC<
  DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>
> = ({ className, children, ...rest }) => (
  <div className={clsx('grid grid-cols-2 gap-6', className)} {...rest}>
    {children}
  </div>
)

const SettingsPage: NextPage = () => {
  const { currentUser } = useGlobalContext()
  const { t } = useTranslation()
  const { register } = useForm({
    defaultValues: currentUser,
  })

  return (
    <ProfileLayout>
      <form className="mt-6 grid w-full max-w-6xl gap-4 pb-5">
        <Row>
          <Input
            label={t('Full name')}
            className="w-full"
            {...register('name')}
          />
        </Row>
        <Row className="items-end">
          <Input
            disabled
            label="Email"
            className="w-full"
            wrapperClassName="w-full"
            {...register('email')}
          />
          <div className="w-full">
            <Button className="flex-none" color="ghost" icon="AtSymbolIcon">
              {t('Change email')}
            </Button>
          </div>
        </Row>
        <Row>
          <ImageSelect
            label={t('Avatar')}
            className="w-full"
            {...register('avatar')}
          />
        </Row>
        <Button className="mt-10 max-w-[150px]" size="large" color="success">
          {t('Save')}
        </Button>
      </form>
    </ProfileLayout>
  )
}

export default SettingsPage
