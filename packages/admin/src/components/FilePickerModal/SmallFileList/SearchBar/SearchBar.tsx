import { Button } from '@components/Button'
import { ButtonProps } from '@components/Button/Button'
import Input from '@components/form/Input'
import { VFC } from 'react'
import { useTranslation } from 'react-i18next'

export interface SearchBarProps {}

export const SearchBar: VFC<SearchBarProps> = () => {
  const { t } = useTranslation()

  return (
    <div className="mt-5 flex w-full items-center">
      <div className="flex-1">
        <Input
          name="query"
          className="w-full"
          placeholder={t('Your filename, id, description...')}
        />
      </div>
    </div>
  )
}
