import { TextInput } from '@mantine/core'
import { iconSet } from '@prom-cms/icons'
import { VFC } from 'react'
import { useTranslation } from 'react-i18next'

export interface SearchBarProps {}

export const SearchBar: VFC<SearchBarProps> = () => {
  const { t } = useTranslation()

  return (
    <div className="flex w-full items-center">
      <div className="flex-1">
        <TextInput
          icon={<iconSet.Search size={20} />}
          name="query"
          className="w-full"
          placeholder={t('Your filename, id, description...')}
        />
      </div>
    </div>
  )
}
