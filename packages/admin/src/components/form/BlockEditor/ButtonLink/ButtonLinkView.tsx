import { Button as CustomButton } from '@components/Button'
import { Checkbox, Group, Text, TextInput } from '@mantine/core'
import { iconSet } from '@prom-cms/icons'
import { capitalizeFirstLetter } from '@prom-cms/shared'
import { forwardRef, useEffect, useMemo, useState, VFC } from 'react'
import { useTranslation } from 'react-i18next'
import { ButtonLinkToolData } from './ButtonLink'

const selectData = Object.entries(iconSet).map(([iconName, icon]) => ({
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

  const IconComponent = useMemo(
    () => (data.icon ? iconSet[data.icon] : undefined),
    [data.icon]
  )

  return !readOnly ? (
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
            value={data.label}
            onChange={(e) => onChange('label', e.currentTarget.value)}
            rightSection={<iconSet.AB size={16} />}
          />

          {/*
          TODO think of way to inlcude icons on clien
          <Select
            searchable
            value={data.icon}
            label={t('Icon')}
            placeholder={t('Enter name to find')}
            itemComponent={SelectItem}
            data={selectData}
            icon={IconComponent ? <IconComponent /> : undefined}
            maxDropdownHeight={250}
            limit={20}
            nothingFound={t('Icon not found')}
            onChange={(value) => onChange('icon', value)}
            filter={(value, item) =>
              !!item?.label?.toLowerCase().includes(value.toLowerCase().trim())
            }
          />*/}
        </Group>
        <Checkbox
          mt="lg"
          label={t('Download on button click')}
          checked={data.isDownload}
          onChange={(e) => onChange('isDownload', e.currentTarget.checked)}
        />
      </div>
    </div>
  ) : (
    <CustomButton
      color="success"
      size="large"
      className="flex gap-5 !rounded-none"
    >
      {IconComponent && <IconComponent />}
      {data.label || data.linkTo} sdfds
    </CustomButton>
  )
}
