import ThemeProvider from '@components/ThemeProvider'
import { Group, TextInput } from '@mantine/core'
import { useInputState } from '@mantine/hooks'
import { iconSet } from '@prom-cms/icons'
import clsx from 'clsx'
import { useEffect } from 'react'
import { KeyboardEventHandler } from 'react'
import { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { DynamicBlockToolData } from './DynamicBlockTool'

export interface DynamicBlockToolViewProps {
  data: DynamicBlockToolData
  onDataChange: (data: DynamicBlockToolData) => void
  readOnly: boolean
}

export const DynamicBlockToolView: FC<DynamicBlockToolViewProps> = ({
  readOnly,
  data: dataFromParent,
  onDataChange,
}) => {
  const [data, setData] = useState<DynamicBlockToolData>(dataFromParent)
  const [inputValue, setInputValue] = useInputState('')
  const { t } = useTranslation()

  useEffect(() => {
    setData(dataFromParent)
  }, [dataFromParent])

  useEffect(() => {
    onDataChange(data)
  }, [data, onDataChange])

  const onKeyDownInput: KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key.toLowerCase() === 'enter') {
      e.preventDefault()
      e.stopPropagation()
    }
  }

  const onInput = (e) => {
    const value: string = e.currentTarget.value
    const formattedValue = value.replaceAll(' ', '-').toLocaleLowerCase()

    setInputValue(formattedValue)
    setData((prevData) => ({
      ...prevData,
      blockId: formattedValue,
    }))
  }

  return (
    <ThemeProvider>
      <div
        className={clsx(
          'rounded-lg border-2 border-project-border bg-white p-5'
        )}
      >
        <p className="text-xl font-semibold">{t('Dynamic block')}</p>
        <TextInput
          icon={<iconSet.Brackets size={20} />}
          disabled={readOnly}
          placeholder={t('Dynamic block identifier')}
          className="mt-5 w-full"
          value={inputValue}
          onInput={onInput}
          onKeyDown={onKeyDownInput}
        />
      </div>
    </ThemeProvider>
  )
}
