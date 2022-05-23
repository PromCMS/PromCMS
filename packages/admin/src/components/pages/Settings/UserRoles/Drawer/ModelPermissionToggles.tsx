import { Checkbox, Grid, Title } from '@mantine/core'
import { randomId } from '@mantine/hooks'
import { iconSet } from '@prom-cms/icons'
import {
  ApiResultModel,
  ProjectSecurityRoleModelPermission,
} from '@prom-cms/shared'
import { FC } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

const options = [
  { label: 'Create', key: randomId() },
  { label: 'Read', key: randomId() },
  { label: 'Update', key: randomId() },
  { label: 'Delete', key: randomId() },
]

export const ModelPermissionToggles: FC<{
  modelInfo: ApiResultModel
  modelName: string
}> = ({ modelInfo, modelName }) => {
  const { watch, setValue } = useFormContext()
  const { t } = useTranslation()

  const values = watch(
    `permissions.models.${modelName}`,
    {}
  ) as ProjectSecurityRoleModelPermission

  const allChecked = Object.keys(values ?? {}).length
    ? Object.values(values ?? {}).findIndex((val) => !val) == -1
    : false
  const indeterminate =
    Object.values(values ?? {}).some((value) => value) && !allChecked

  const items = options.map(({ label, key }, index) => (
    <Controller
      name={`permissions.models.${modelName}.${label.at(0)?.toLowerCase()}`}
      key={key}
      render={({ field: { value, onChange } }) => (
        <Checkbox
          mt="xs"
          ml={33}
          label={label}
          checked={!!value}
          onChange={() => onChange(!value)}
        />
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

      <Checkbox
        checked={allChecked}
        indeterminate={indeterminate}
        label="Allow everything"
        transitionDuration={0}
        onChange={() =>
          setValue(
            `permissions.models.${modelName}`,
            allChecked
              ? { c: false, r: false, u: false, d: false }
              : { c: true, r: true, u: true, d: true }
          )
        }
      />
      {items}
    </div>
  )

  return <></>
}
