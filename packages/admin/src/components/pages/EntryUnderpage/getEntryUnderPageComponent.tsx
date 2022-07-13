import {
  EntryUnderpageContextProvider,
  Footer,
} from '@components/pages/EntryUnderpage'
import useCurrentModel from '@hooks/useCurrentModel'
import NotFoundPage from '@pages/404'
import { EntryTypeUrlActionType, NextPage } from '@custom-types'
import { EntryEditorLayout } from 'layouts/EntryEditorLayout'
import { Aside, Header, FormContent } from '@components/pages/EntryUnderpage'

export const getEntryUnderPageComponent = (
  viewType: EntryTypeUrlActionType
) => {
  const Component: NextPage = () => {
    const model = useCurrentModel()

    if (!model || model.name === 'users') return <NotFoundPage />

    return (
      <EntryUnderpageContextProvider viewType={viewType}>
        {({ formContentRefs }) => (
          <EntryEditorLayout>
            <EntryEditorLayout.Content>
              <Header />
              {/* We pass multiple refs */}
              <FormContent ref={formContentRefs} />
              <Footer />
            </EntryEditorLayout.Content>
            <EntryEditorLayout.Aside
              open
              className="flex flex-col gap-5"
              onClose={() => {}}
            >
              <Aside />
            </EntryEditorLayout.Aside>
          </EntryEditorLayout>
        )}
      </EntryUnderpageContextProvider>
    )
  }

  return Component
}
