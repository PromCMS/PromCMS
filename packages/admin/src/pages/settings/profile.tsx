import ImageSelect from '@components/form/ImageSelect'
import { ProfileLayout } from '@layouts'
import { useGlobalContext } from '@contexts/GlobalContext'
import clsx from 'clsx'
import { DetailedHTMLProps, FC, HTMLAttributes, useMemo } from 'react'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { NextPage } from '@custom-types'
import { ProfileService } from '@services'
import { getObjectDiff } from '@utils'
import { User } from '@prom-cms/shared'
import { useNotifications } from '@mantine/notifications'
import { Button, TextInput } from '@mantine/core'
import { LanguageSelect } from '@components/pages/Settings/Profile'
import { iconSet } from '@prom-cms/icons'

const Row: FC<
  DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>
> = ({ className, children, ...rest }) => (
  <div className={clsx('grid grid-cols-2 gap-6', className)} {...rest}>
    {children}
  </div>
)

const SettingsPage: NextPage = () => {
  const { currentUser, updateValue } = useGlobalContext()
  const { t } = useTranslation()
  const notifications = useNotifications()
  const formMethods = useForm({
    defaultValues: currentUser,
  })
  const { register, control, handleSubmit, watch } = formMethods

  const values = watch()

  const canSubmit = useMemo(() => {
    return !!Object.keys(getObjectDiff(currentUser, values)).length
  }, [currentUser, values])

  const onSubmit = async (values) => {
    const id = notifications.showNotification({
      id: 'settings-update-notification',
      loading: true,
      title: 'Updating',
      message: t('Updating your data, please wait...'),
      autoClose: false,
      disallowClose: true,
    })

    const diffedUser = getObjectDiff(currentUser, values) as User

    try {
      await ProfileService.save(diffedUser)

      updateValue('currentUser', {
        ...currentUser,
        ...diffedUser,
      } as typeof currentUser)

      notifications.updateNotification(id, {
        message: t('Update done!'),
        autoClose: 2000,
      })
    } catch (e) {
      notifications.updateNotification(id, {
        color: 'red',
        message: t('An error happened'),
        autoClose: 2000,
      })
    }
  }

  return (
    <ProfileLayout>
      <FormProvider {...formMethods}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-6 grid w-full max-w-6xl gap-4 pb-5"
          autoComplete="off"
        >
          <Row>
            <TextInput
              label={t('Full name')}
              className="w-full"
              {...register('name')}
            />
          </Row>
          <Row className="items-end">
            <TextInput
              disabled
              label="Email"
              className="w-full"
              {...register('email')}
            />
            {/* TODO */}
            {false && (
              <div className="w-full">
                <Button
                  className="flex-none"
                  color="ghost"
                  leftIcon={<iconSet.At />}
                >
                  {t('Change email')}
                </Button>
              </div>
            )}
          </Row>
          <Row className="items-end">
            <LanguageSelect />
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
                  onChange={(value) => value && onChange(value)}
                  onBlur={onBlur}
                />
              )}
            />
          </Row>
          <Button
            className="mt-10 max-w-[150px]"
            size="md"
            color="success"
            type="submit"
            disabled={!canSubmit}
            loading={formMethods.formState.isSubmitting}
          >
            {t('Save')}
          </Button>
        </form>
      </FormProvider>
    </ProfileLayout>
  )
}

export default SettingsPage
