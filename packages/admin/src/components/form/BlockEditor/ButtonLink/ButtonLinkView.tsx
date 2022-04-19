import { Group, Select, Text, TextInput } from '@mantine/core'
import { iconSet } from '@prom-cms/icons'
import { capitalizeFirstLetter } from '@prom-cms/shared'
import { forwardRef, useEffect, useMemo, useState, VFC } from 'react'
import { useTranslation } from 'react-i18next'
import { ButtonLinkToolData } from './ButtonLink'

const selectData = Object.entries({
  Download: iconSet['Download'],
  AB: iconSet['AB'],
}).map(([iconName, icon]) => ({
  icon,
  value: iconName,
  label: capitalizeFirstLetter(iconName),
}))

const SelectItem = forwardRef<
  HTMLDivElement,
  { icon: typeof iconSet.AB; label: string }
>(function SelectItem({ icon: Icon, label, ...rest }, ref) {
  return (
    <div ref={ref} {...rest}>
      <Group noWrap>
        <Icon />

        <div>
          <Text size="sm">{label}</Text>
        </div>
      </Group>
    </div>
  )
})

export const ButtonLinkView: VFC<{
  dataFromParent: ButtonLinkToolData
  onDataChange: (data: ButtonLinkToolData) => void
  readOnly: boolean
}> = ({ dataFromParent, readOnly, onDataChange }) => {
  const [data, setData] = useState<ButtonLinkToolData>(dataFromParent)
  const { t } = useTranslation()

  useEffect(() => {
    setData(dataFromParent)
  }, [dataFromParent])

  useEffect(() => {
    onDataChange(data)
  }, [data, onDataChange])

  const onChange = (key: keyof ButtonLinkToolData, value: any) => {
    setData({
      ...data,
      [key]: value,
    })
  }

  const isUrlValid = useMemo(
    () =>
      data.linkTo.length
        ? /^((https|http):\/\/).*/.test(data.linkTo)
          ? true
          : false
        : true,
    [data.linkTo]
  )

  return (
    <div className="rounded-lg border-2 border-project-border bg-white p-5">
      <p className="text-xl font-semibold">{t('Button link')}</p>
      <div>
        <TextInput
          required
          className="mt-2"
          label={t('Link')}
          placeholder="https://google.com"
          error={isUrlValid ? undefined : t('Invalid url')}
          type="url"
          disabled={readOnly}
          value={data.linkTo}
          onChange={(e) => onChange('linkTo', e.currentTarget.value)}
          rightSection={
            isUrlValid ? (
              <iconSet.Check size={16} color="green" />
            ) : (
              <iconSet.Link size={16} />
            )
          }
        />
        <Group className="mt-2" noWrap grow>
          <TextInput
            label={t('Label')}
            placeholder={t('Some text')}
            disabled={readOnly}
            value={data.label}
            onChange={(e) => onChange('label', e.currentTarget.value)}
            rightSection={<iconSet.AB size={16} />}
          />
          <Select
            searchable
            value={data.icon}
            label={t('Icon')}
            placeholder={t('Pick one')}
            itemComponent={SelectItem}
            data={selectData}
            maxDropdownHeight={100}
            nothingFound={t('Icon not found')}
            disabled={readOnly}
            onChange={(value) => onChange('icon', value)}
            filter={(value, item) =>
              !!item?.label?.toLowerCase().includes(value.toLowerCase().trim())
            }
          />
        </Group>
      </div>
    </div>
  )
}
