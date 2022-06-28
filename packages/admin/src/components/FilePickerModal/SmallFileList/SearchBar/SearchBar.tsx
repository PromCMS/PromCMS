import { TextInput } from '@mantine/core'
import { iconSet } from '@prom-cms/icons'
import { VFC } from 'react'
import { useTranslation } from 'react-i18next'
import { useSmallFileList } from '../context'

export interface SearchBarProps {}

export const SearchBar: VFC<SearchBarProps> = () => {
  const { t } = useTranslation()
  const { updateValue, searchValue } = useSmallFileList()

  return (
    <div className="flex w-full items-center">
      <div className="flex-1">
        <TextInput
          icon={<iconSet.Search size={20} />}
          name="query"
          className="w-full"
          value={searchValue}
          onInput={(ev) =>
            updateValue({ name: 'searchValue', value: ev.currentTarget.value })
          }
          placeholder={t('Your filename, id, description...')}
        />
      </div>
    </div>
  )
}
