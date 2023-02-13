import { TextInput } from '@mantine/core';
import { VFC } from 'react';
import { useTranslation } from 'react-i18next';
import { Search } from 'tabler-icons-react';
import { useSmallFileList } from '../context';

export interface SearchBarProps {}

export const SearchBar: VFC<SearchBarProps> = () => {
  const { t } = useTranslation();
  const { updateValue, searchValue, isUploading } = useSmallFileList();

  return (
    <div className="flex w-full items-center">
      <div className="flex-1">
        <TextInput
          icon={<Search size={20} />}
          name="query"
          className="w-full"
          value={searchValue}
          disabled={isUploading}
          onInput={(ev) =>
            updateValue({ name: 'searchValue', value: ev.currentTarget.value })
          }
          placeholder={t('Your filename, id, description...')}
        />
      </div>
    </div>
  );
};
