import {
  ActionIcon,
  InputWrapper,
  Paper,
  SimpleGrid,
  Text,
  TextInput,
  Title,
} from '@mantine/core'
import { useInputState } from '@mantine/hooks'
import { iconSet } from '@prom-cms/icons'
import { useMemo, VFC } from 'react'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

interface DndListHandleProps {
  data: {
    id: string
    value: string
  }[]
}

export const List: VFC = () => {
  const { register, watch, setValue } = useFormContext()
  const [stringValue, setStringValue] = useInputState('')
  const data: DndListHandleProps['data'] = watch('content.data', {})
  const { t } = useTranslation()

  const onDeleteClick = (id: string) => () => {
    setValue(
      'content.data',
      Object.fromEntries(
        Object.entries(data).filter(([key, item]) => item.id !== id)
      )
    )
  }

  const onAdd = () => {
    if (!stringValue) {
      return
    }

    const id = Date.now().toString(36) + Math.random().toString(36).substring(2)
    setValue(`content.data[${id}]`, {
      id,
      value: stringValue,
    })
    setStringValue('')
  }

  const arrayedData = Object.values(data || {})

  return (
    <>
      <Paper shadow="xs" p="md" withBorder>
        <TextInput
          value={stringValue}
          label={t('Add new entry')}
          placeholder={t('Some text')}
          icon={<iconSet.Plus size={20} />}
          onChange={setStringValue}
          onKeyDown={(e) => {
            if (e.key.toLowerCase() === 'enter') {
              e.preventDefault()
              e.stopPropagation()
              onAdd()
            }
          }}
        />
        <InputWrapper label={t('Items')} mt="lg">
          <SimpleGrid cols={1}>
            {!!arrayedData.length ? (
              arrayedData.map((item) => (
                <div className={'flex items-center'} key={item.id}>
                  <TextInput
                    className="w-full"
                    {...register(`content.data[${item.id}].value`)}
                  />
                  <ActionIcon
                    ml="md"
                    color="red"
                    onClick={onDeleteClick(item.id)}
                  >
                    <iconSet.Trash />
                  </ActionIcon>
                </div>
              ))
            ) : (
              <Text color="dimmed">{t('No items for now')}</Text>
            )}
          </SimpleGrid>
        </InputWrapper>
      </Paper>
    </>
  )
}
