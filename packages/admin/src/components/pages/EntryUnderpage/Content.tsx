import { useEffect, useMemo, useRef, VFC } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useEntryUnderpageContext } from './context'
import { FormContent } from './FormContent'
import { Header } from './Header'
import { yupResolver } from '@hookform/resolvers/yup'
import { getModelItemSchema } from '@schemas'
import useCurrentModel from '@hooks/useCurrentModel'
import { FormAside } from './FormAside'
import UnderPageBreadcrumbsMenu from '@components/UnderPageBreadcrumbsMenu'
import { EntryService } from '@services'
import { ApiResultItem, capitalizeFirstLetter } from '@prom-cms/shared'
import Skeleton from '@components/Skeleton'
import { useTranslation } from 'react-i18next'
import { useNotifications } from '@mantine/notifications'
import { getObjectDiff } from '@utils'
import EditorJS from '@editorjs/editorjs'
import { useRouter } from 'next/router'
import axios from 'axios'

const Content: VFC = () => {
  const { currentView, itemData, itemIsLoading, mutateItem } =
    useEntryUnderpageContext()
  const editorRef = useRef<EditorJS>(null)
  // We make copy out of ref that came from useOnSubmit hook and make an object that contains refs
  const formContentRefs = useRef({ editorRef })
  const notifications = useNotifications()
  const model = useCurrentModel()
  const { push } = useRouter()
  const { t } = useTranslation()
  const schema = useMemo(
    () => model && getModelItemSchema(model, currentView === 'update'),
    [model, currentView]
  )
  const formMethods = useForm({
    defaultValues: itemData?.data || {},
    reValidateMode: 'onChange',
    mode: 'onTouched',
    resolver: schema && yupResolver(schema),
  })
  const { setError } = formMethods

  useEffect(
    () => itemData && formMethods.reset(itemData),
    [itemData, formMethods]
  )

  const onSubmit = async (values) => {
    const modelName = (model as NonNullable<typeof model>).name
    const id = notifications.showNotification({
      id: currentView === 'update' ? 'on-update-entry' : 'on-create-entry',
      loading: true,
      title: currentView === 'update' ? 'Updating' : 'Creating',
      message: t(
        currentView === 'update'
          ? 'Updating your entry, please wait...'
          : 'Creating new entry, please wait...'
      ),
      autoClose: false,
      disallowClose: true,
    })

    if (editorRef.current) {
      await editorRef.current?.isReady

      values.content = JSON.stringify(await editorRef.current.save())
    }

    try {
      if (currentView === 'update') {
        const finalValues = getObjectDiff(itemData, values) as ApiResultItem
        const itemId = (itemData as NonNullable<typeof itemData>).id

        await EntryService.update(
          {
            id: itemId,
            model: modelName,
          },
          finalValues
        )

        await mutateItem((prevData) => {
          if (prevData?.id) {
            return {
              ...(prevData || {}),
              finalValues,
            }
          } else {
            return prevData
          }
        })

        notifications.updateNotification(id, {
          message: t('Your entry is updated!'),
          autoClose: 2000,
        })
      } else if (currentView === 'create') {
        const result = await EntryService.create(
          {
            model: modelName,
          },
          values
        )

        if (!result?.data) {
          throw new Error('No data has been received')
        }

        push(EntryService.getListUrl(model?.name as string))
      }
    } catch (e) {
      if (axios.isAxiosError(e) && e.response?.data?.code === 23000) {
        const fieldNames = e.response.data.data
        if (Array.isArray(fieldNames) && fieldNames.length) {
          for (const fieldName of fieldNames) {
            setError(fieldName, {
              message: t(
                'This field is unique and other entry has the same value'
              ),
            })
          }
        }
      }

      notifications.updateNotification(id, {
        color: 'red',
        message: t('An error happened'),
        autoClose: 2000,
      })
    }
  }

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={formMethods.handleSubmit(onSubmit)} autoComplete="off">
        <UnderPageBreadcrumbsMenu
          className="py-5"
          items={[
            { content: t('Entry types') as string },
            {
              isLinkTo: EntryService.getListUrl(model?.name as string),
              content: t(capitalizeFirstLetter(model?.name || '')) as string,
            },
            {
              content: t(
                currentView == 'update' ? 'Update' : 'Create'
              ) as string,
            },
            {
              content: itemIsLoading ? (
                <Skeleton className="h-4 w-16 flex-none" />
              ) : (
                <p className="flex-none text-green-500 underline">
                  {currentView == 'update' ? itemData?.id : t('Create')}
                </p>
              ),
            },
          ]}
        />
        <div className="mt-10 items-start justify-between xl:flex">
          <div className="relative -mx-3 grid w-full max-w-4xl gap-5 px-3">
            <Header />
            {/* We pass multiple refs */}
            <FormContent ref={formContentRefs} />
          </div>
          <FormAside isSubmitting={formMethods.formState.isSubmitting} />
        </div>
      </form>
    </FormProvider>
  )
}

export default Content
