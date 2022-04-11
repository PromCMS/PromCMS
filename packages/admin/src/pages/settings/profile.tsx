import { Button } from '@components/Button'
import ImageSelect from '@components/form/ImageSelect'
import Input from '@components/form/Input'
import { ProfileLayout } from '@components/pages/UserProfile'
import { useGlobalContext } from '@contexts/GlobalContext'
import clsx from 'clsx'
import { DetailedHTMLProps, FC, HTMLAttributes } from 'react'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { NextPage } from '@custom-types'
import { ProfileService } from '@services'
import { getObjectDiff } from '@utils'
import { User } from '@prom-cms/shared'
import { useNotifications } from '@mantine/notifications'

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
  const notifications = useNotifications()
  const formMethods = useForm({
    defaultValues: currentUser,
  })
  const { register, control, handleSubmit } = formMethods

  const onSubmit = async (values) => {
    const id = notifications.showNotification({
      loading: true,
      title: 'Updating',
      message: t('Updating your data, please wait...'),
      autoClose: false,
      disallowClose: true,
    })

    await ProfileService.save(getObjectDiff(currentUser, values) as User)
      .catch(() => {
        notifications.updateNotification(id, {
          color: 'red',
          message: t('An error happened'),
          autoClose: 2000,
        })
      })
      .then(() => {
        notifications.updateNotification(id, {
          message: t('Update done!'),
          autoClose: 2000,
        })
      })
  }

  return (
    <ProfileLayout>
      <FormProvider {...formMethods}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-6 grid w-full max-w-6xl gap-4 pb-5"
        >
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
            {/* TODO */}
            {false && (
              <div className="w-full">
                <Button className="flex-none" color="ghost" icon="AtSymbolIcon">
                  {t('Change email')}
                </Button>
              </div>
            )}
          </Row>
          <Row>
            <Controller
              control={control}
              name="avatar"
              render={({ field: { onChange, onBlur, value } }) => (
                <ImageSelect
                  label={t('Avatar')}
                  className="w-full"
                  selected={value}
                  multiple={false}
                  onChange={onChange}
                  onBlur={onBlur}
                />
              )}
            />
          </Row>
          <Button
            className="mt-10 max-w-[150px]"
            size="large"
            color="success"
            type="submit"
          >
            {t('Save')}
          </Button>
        </form>
      </FormProvider>
    </ProfileLayout>
  )
}

export default SettingsPage
