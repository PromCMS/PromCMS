import {
  ActionIcon,
  InputWrapper,
  Paper,
  SimpleGrid,
  Text,
  TextInput,
} from '@mantine/core'
import { useInputState } from '@mantine/hooks'
import { VFC } from 'react'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { ChevronDown, ChevronUp, Plus, Trash } from "tabler-icons-react"

interface DndListHandleProps {
  data: {
    id: string
    value: string
  }[]
}

export const List: VFC = () => {
  const { register, watch, setValue } = useFormContext()
  const [stringValue, setStringValue] = useInputState('')
  const data: DndListHandleProps['data'] = watch('content.data', [])
  const { t } = useTranslation()

  const onDeleteClick = (id: string) => () => {
    setValue(
      'content.data',
      data.filter((item) => item.id !== id)
    )
  }

  const onAdd = () => {
    if (!stringValue) {
      return
    }

    // Generate unique id
    const id = Date.now().toString(36) + Math.random().toString(36).substring(2)
    setValue(`content.data[${(data || []).length}]`, {
      id,
      value: stringValue,
    })
    setStringValue('')
  }

  const onChangePlace = (direction: 'up' | 'down', id: string) => () => {
    const newData = [...data]
    const index = newData.findIndex(({ id: key }) => key === id)

    const nextIndex = direction === 'up' ? index - 1 : index + 1
    // Swap entries
    ;[newData[index], newData[nextIndex]] = [newData[nextIndex], newData[index]]

    setValue('content.data', newData)
  }

  return (
    <>
      <Paper shadow="xs" p="md" withBorder>
        <TextInput
          value={stringValue}
          label={t('Add new entry')}
          placeholder={t('Some text')}
          icon={<Plus size={20} />}
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
            {!!data && Array.isArray(data) ? (
              data.map((item, index) => (
                <div key={item.id} className={'flex items-center'}>
                  <div className="mr-1 flex">
                    <ActionIcon
                      disabled={index === 0}
                      onClick={onChangePlace('up', item.id)}
                    >
                      <ChevronUp size={18} />
                    </ActionIcon>
                    <ActionIcon
                      disabled={(data || []).length - 1 === index}
                      onClick={onChangePlace('down', item.id)}
                    >
                      <ChevronDown size={18} />
                    </ActionIcon>
                  </div>
                  <TextInput
                    className="w-full"
                    {...register(`content.data[${index}].value`)}
                  />
                  {/*<ActionIcon
                    ml="md"
                    color="red"
                    onClick={onDeleteClick(item.id)}
                  >
                    <Trash />
              </ActionIcon>*/}
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
