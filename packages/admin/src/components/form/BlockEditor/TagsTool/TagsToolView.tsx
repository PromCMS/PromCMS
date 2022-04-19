import {
  ActionIcon,
  Badge,
  Group,
  MultiSelect,
  Text,
  TextInput,
} from '@mantine/core'
import { useInputState } from '@mantine/hooks'
import { iconSet } from '@prom-cms/icons'
import { useCallback, useEffect, useState, VFC } from 'react'
import { useTranslation } from 'react-i18next'
import { TagsToolData } from './TagsTool'

export const TagsToolView: VFC<{
  dataFromParent: TagsToolData
  onDataChange: (data: TagsToolData) => void
  readOnly: boolean
}> = ({ readOnly, dataFromParent, onDataChange }) => {
  const [data, setData] = useState<TagsToolData>(dataFromParent)
  const [inputValue, setInputValue] = useInputState('')
  const { t } = useTranslation()

  useEffect(() => {
    setData(dataFromParent)
  }, [dataFromParent])

  useEffect(() => {
    onDataChange(data)
  }, [data, onDataChange])

  const onRemoveClick = (tagContent) => () =>
    setData({
      ...data,
      tags: data.tags.filter((tagValue) => tagValue !== tagContent),
    })

  const onAddClick = () => {
    setData({
      ...data,
      tags: [
        ...data.tags.filter((tagValue) => tagValue !== inputValue),
        inputValue,
      ],
    })
    setInputValue('')
  }

  return (
    <div className="rounded-lg border-2 border-project-border bg-white p-5">
      <p className="text-xl font-semibold">{t('Tags')}</p>
      <Group className="my-5">
        {data.tags.length ? (
          data.tags.map((tagContent, index) => (
            <Badge
              variant="outline"
              sx={{ paddingRight: 3 }}
              rightSection={
                !readOnly && (
                  <ActionIcon
                    size="xs"
                    color="blue"
                    radius="xl"
                    variant="transparent"
                    onClick={onRemoveClick(tagContent)}
                  >
                    <iconSet.X size={10} />
                  </ActionIcon>
                )
              }
              key={tagContent}
            >
              {tagContent}
            </Badge>
          ))
        ) : (
          <p className="text-gray-400">{t('No tags, start by adding some')}</p>
        )}
      </Group>
      {!readOnly && (
        <Group noWrap>
          <TextInput
            icon={<iconSet.Tag size={20} />}
            placeholder={t('New badge name')}
            className="w-full"
            value={inputValue}
            onInput={setInputValue}
            rightSection={
              <ActionIcon
                size="lg"
                color="green"
                variant="light"
                className="flex-none"
                onClick={onAddClick}
              >
                <iconSet.Send size={20} />
              </ActionIcon>
            }
          />
        </Group>
      )}
    </div>
  )
}
