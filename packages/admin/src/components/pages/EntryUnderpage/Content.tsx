import { useEffect, useMemo, VFC } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useEntryUnderpageContext } from './context'
import { EntryUnderpageForm } from './Form'
import { Header } from './Header'
import { yupResolver } from '@hookform/resolvers/yup'
import { getModelItemSchema } from '@schemas'
import useCurrentModel from '@hooks/useCurrentModel'
import { FormWrapper } from './FormWrapper'
import { FormAside } from './FormAside'
import UnderPageBreadcrumbsMenu from '@components/UnderPageBreadcrumbsMenu'
import { EntryService } from '@services'
import { capitalizeFirstLetter } from '@prom-cms/shared'
import Skeleton from '@components/Skeleton'
import { useTranslation } from 'react-i18next'

const Content: VFC = () => {
  const { currentView, itemData, itemIsLoading } = useEntryUnderpageContext()
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
      <FormWrapper>
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
            <EntryUnderpageForm />
          </div>
          <FormAside isSubmitting={formMethods.formState.isSubmitting} />
        </div>
      </FormWrapper>
    </FormProvider>
  )
}

export default Content
