import { Checkbox, Collapse, Radio, RadioGroup, Title } from '@mantine/core'
import { randomId } from '@mantine/hooks'
import { iconSet } from '@prom-cms/icons'
import { ApiResultModel, SecurityOptionOptions } from '@prom-cms/shared'
import { FC } from 'react'
import { Controller } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

const options = [
  { label: 'Create', isSimple: true, key: randomId() },
  { label: 'Read', key: randomId() },
  { label: 'Update', key: randomId() },
  { label: 'Delete', key: randomId() },
]

export const ModelPermissionToggles: FC<{
  modelInfo: ApiResultModel
  modelName: string
}> = ({ modelInfo, modelName }) => {
  const { t } = useTranslation()

  const items = options.map(({ label, key, isSimple }) => (
    <Controller
      key={key}
      name={`permissions.models.${modelName}.${label.at(0)?.toLowerCase()}`}
      render={({ field: { value, onChange } }) => (
        <div className="mt-5">
          <Checkbox
            mt="xs"
            className="cursor-pointer"
            label={label}
            checked={!!value}
            onChange={() =>
              onChange(
                !value ? ('allow-everything' as SecurityOptionOptions) : false
              )
            }
          />
          {!isSimple && modelName !== 'settings' && (
            <Collapse in={!!value}>
              <RadioGroup
                required
                spacing={'xs'}
                value={value}
                ml={33}
                orientation="vertical"
                size="sm"
                onChange={onChange}
              >
                <Radio
                  disabled={!value}
                  value="allow-everything"
                  label={t('Allow on everything')}
                />
                <Radio
                  disabled={!value}
                  value="allow-own"
                  label={t('Allow on only own and shared')}
                />
              </RadioGroup>
            </Collapse>
          )}
        </div>
      )}
    />
  ))

  const Icon = iconSet[modelInfo.icon]

  return (
    <div>
      <Title mb="sm" order={5} className="text-blue-500">
        <Icon size={17} className="mr-2 -mb-0.5" />
        {t(modelName)}
      </Title>

      {items}
    </div>
  )
}
