import { Button } from '@components/Button'
import { ButtonProps } from '@components/Button/Button'
import Input from '@components/form/Input'
import { iconSet } from '@prom-cms/icons'
import { VFC } from 'react'
import { useTranslation } from 'react-i18next'

export interface SearchBarProps {
  onAddButtonClick: ButtonProps['onClick']
}

export const SearchBar: VFC<SearchBarProps> = ({ onAddButtonClick }) => {
  const { t } = useTranslation()

  return (
    <div className="flex w-full items-center">
      <div className="mr-5 flex-1">
        <Input
          name="query"
          className="w-full"
          placeholder={t('Your filename, id, description...')}
        />
      </div>
      <Button color="success" className="flex-none" onClick={onAddButtonClick}>
        <iconSet.PlusIcon className="!-mx-2 aspect-square w-8" />
      </Button>
    </div>
  )
}
