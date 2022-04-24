import { useEffect, VFC } from 'react'
import {
  Button,
  Drawer as MantineDrawer,
  DrawerProps as MantineDrawerProps,
  Paper,
  Select,
  SimpleGrid,
  TextInput,
  Title,
} from '@mantine/core'
import { useModelItem } from '@hooks/useModelItem'
import { ItemID } from '@prom-cms/shared'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import { useGlobalContext } from '@contexts/GlobalContext'
import { List } from './contentTypes/List'
import { t } from 'i18next'
import { SettingsService } from '@services'
import { Textarea } from './contentTypes/Textarea'

export const Drawer: VFC<
  Pick<MantineDrawerProps, 'opened' | 'onClose'> & { optionToEdit?: ItemID }
> = ({ opened, onClose, optionToEdit }) => {
  const { currentUserIsAdmin } = useGlobalContext()
  const { data, isLoading } = useModelItem('settings', optionToEdit)
  const formMethods = useForm({
    defaultValues: {} as any,
  })
  const { register, watch, reset, control, handleSubmit, setValue, formState } =
    formMethods

  useEffect(() => {
    if (optionToEdit) {
      if (data) {
        reset(data)
      }
    } else {
      reset({})
    }
  }, [data, reset, optionToEdit, opened])

  const content = watch('content')

  const onSubmit = async (values) => {
    try {
      if (optionToEdit) {
        const { id, ...newOptionDataset } = values
        await SettingsService.update(optionToEdit, newOptionDataset)
      } else {
        await SettingsService.create(values)
      }
      onClose()
    } catch (e) {
      // TODO
      alert('An error happened')
    }
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
            {!!optionToEdit ? 'Update an option' : 'Create an option'}
          </Title>
        }
      >
        <form className="h-full" onSubmit={handleSubmit(onSubmit)}>
          <SimpleGrid cols={1} spacing="md">
            {currentUserIsAdmin && (
              <Paper withBorder shadow="lg" mb="lg" radius="md" p="xs">
                <TextInput label="Slug" {...register('name')} />

                <Controller
                  name="content.type"
                  control={control}
                  render={({ field: { name, onChange, onBlur, value } }) => (
                    <Select
                      placeholder="Select type"
                      name={name}
                      onChange={(value) => {
                        onChange(value)
                        setValue('content.data', undefined)
                      }}
                      onBlur={onBlur}
                      value={value}
                      label="Select datatype"
                      pt="md"
                      data={[
                        { value: 'list', label: 'List' },
                        { value: 'textArea', label: 'Long text' },
                      ]}
                    />
                  )}
                />
              </Paper>
            )}
            <TextInput label="Label" {...register('label')} />
            {content?.type === 'list' && <List />}
            {content?.type === 'textArea' && <Textarea />}
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