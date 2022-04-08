import useCurrentModel from '@hooks/useCurrentModel'
import { VFC } from 'react'
import { useTranslation } from 'react-i18next'
import { useEntryUnderpageContext } from '..'
import { EditableTitle } from './EditableTitle'

export const Header: VFC = () => {
  const { currentView } = useEntryUnderpageContext()
  const model = useCurrentModel()
  const { t } = useTranslation()

  return (
    <header className="mr-9 w-full border-b-2 border-project-border pb-5 xl:mr-0">
      {model?.admin?.layout === 'simple' ? (
        <h1 className="text-5xl font-bold">
          {t(currentView == 'update' ? 'Update an entry' : 'Create an entry')}
        </h1>
      ) : (
        <EditableTitle />
      )}
    </header>
  )
}
