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
import { capitalizeFirstLetter } from '@prom-cms/shared'
import Skeleton from '@components/Skeleton'
import { useTranslation } from 'react-i18next'
import { useOnSubmit } from './useOnSubmit'

const Content: VFC = () => {
  const { currentView, itemData, itemIsLoading } = useEntryUnderpageContext()
  const [onFormSubmit, editorRef] = useOnSubmit()
  // We make copy out of ref that came from useOnSubmit hook and make an object that contains refs
  const formContentRefs = useRef({ editorRef })
  const model = useCurrentModel()
  const { t } = useTranslation()
  const schema = useMemo(
    () => model && getModelItemSchema(model, currentView === 'update'),
    [model, currentView]
  )
  const formMethods = useForm({
    defaultValues: itemData?.data || {},
    reValidateMode: 'onBlur',
    mode: 'onTouched',
    resolver: schema && yupResolver(schema),
  })

  useEffect(
    () => itemData && formMethods.reset(itemData),
    [itemData, formMethods]
  )

  return (
    <FormProvider {...formMethods}>
      <form
        onSubmit={formMethods.handleSubmit(onFormSubmit)}
        autoComplete="off"
      >
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
