import { FC } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import {
  Button,
  Drawer as MantineDrawer,
  DrawerProps as MantineDrawerProps,
  Grid,
  Input,
  InputWrapper,
  SimpleGrid,
  Textarea,
  TextInput,
  Title,
} from '@mantine/core'
import { ItemID } from '@prom-cms/shared'
import { useTranslation } from 'react-i18next'
import { useRequestWithNotifications } from '@hooks/useRequestWithNotifications'
import { UserRolesService } from '@services'
import { useGlobalContext } from '@contexts/GlobalContext'
import { Fragment } from 'react'
import { ModelPermissionToggles } from './ModelPermissionToggles'
import { useEffect } from 'react'
import { useModelItem } from '@hooks/useModelItem'

export const Drawer: FC<
  Pick<MantineDrawerProps, 'opened' | 'onClose'> & { optionToEdit?: ItemID }
> = ({ opened, onClose, optionToEdit }) => {
  const formMethods = useForm()
  const { t } = useTranslation()
  const { data } = useModelItem('user-roles', optionToEdit)
  const reqWithNotification = useRequestWithNotifications()
  const { models } = useGlobalContext()
  const { handleSubmit, formState, register, reset } = formMethods

  useEffect(() => {
    if (optionToEdit) {
      if (data) {
        reset(data)
      }
    } else {
      reset({})
    }
  }, [data, reset, optionToEdit, opened])

  console.log({ data })

  const onSubmit = async (values) => {
    console.log({ values })

    return
    try {
      reqWithNotification(
        {
          title: t(optionToEdit ? 'Updating user role' : 'Creating user role'),
          message: t('Please wait...'),
          successMessage: t(
            optionToEdit
              ? 'User role successfully updated'
              : 'User role has been created'
          ),
        },
        async () => {
          if (optionToEdit) {
            const { id, ...newOptionDataset } = values
            await UserRolesService.update(optionToEdit, newOptionDataset)
          } else {
            await UserRolesService.create(values)
          }
          onClose()
        }
      )
    } catch (e) {}
  }

  return (
    <FormProvider {...formMethods}>
      <MantineDrawer
        opened={opened}
        onClose={onClose}
        position="right"
        size={700}
        padding="xl"
        className=" overflow-auto"
        title={
          <Title order={4}>
            {!!optionToEdit ? 'Update user role' : 'Create user role'}
          </Title>
        }
      >
        <form className="h-full" onSubmit={handleSubmit(onSubmit)}>
          <SimpleGrid cols={1} spacing="md">
            <TextInput label="Label" {...register('label')} />
            <Textarea
              autosize
              label={t('Description')}
              minRows={4}
              {...register('description')}
            />
            <Title mt="lg" order={4}>
              Permissions by models
            </Title>
            <SimpleGrid cols={2} className="gap-10">
              {models &&
                Object.entries(models).map(([modelName, modelValue]) => (
                  <Fragment key={modelName}>
                    <ModelPermissionToggles
                      modelInfo={modelValue}
                      modelName={modelName}
                    />
                  </Fragment>
                ))}
            </SimpleGrid>
          </SimpleGrid>
          <div className="right-0 mt-8 rounded-lg pb-4">
            <Button
              className="mr-auto block"
              type="submit"
              loading={formState.isSubmitting}
              loaderPosition="right"
            >
              {t(optionToEdit ? 'Save' : 'Create')}
            </Button>
          </div>
        </form>
      </MantineDrawer>
    </FormProvider>
  )
}
