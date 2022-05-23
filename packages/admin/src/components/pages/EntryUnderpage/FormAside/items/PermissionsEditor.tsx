import AsideItemWrap from '@components/AsideItemWrap'
import { useCurrentUser } from '@hooks/useCurrentUser'
import { useModelItems } from '@hooks/useModelItems'
import { Checkbox, Skeleton, Text } from '@mantine/core'
import { PagedResult, UserRole } from '@prom-cms/shared'
import clsx from 'clsx'
import { FC, useMemo } from 'react'
import { Controller } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

const loadingPlaceholder = (
  <>
    <Skeleton width="100%" height={30} />
    <Skeleton width="100%" height={30} />
    <Skeleton width="100%" height={30} />
    <Skeleton width="100%" height={30} />
  </>
)

const Item: FC<UserRole> = ({ id, label }) => {
  const inputId = useMemo(() => `user-${id}-edit-permission`, [id])

  return (
    <Controller
      name={`permissions.${id}`}
      render={({ field: { onChange, value, onBlur, name } }) => (
        <label
          htmlFor={inputId}
          className={clsx(
            'flex cursor-pointer items-center rounded-lg p-1.5 duration-200',
            value ? 'bg-blue-100' : 'hover:bg-blue-50'
          )}
        >
          <Checkbox
            id={inputId}
            tabIndex={-1}
            size="md"
            mr="xl"
            styles={{ input: { cursor: 'pointer' } }}
            name={name}
            checked={value ?? false}
            onChange={onChange}
            onBlur={onBlur}
          />
          <Text weight={500}>{label}</Text>
        </label>
      )}
    />
  )
}

export const PermissionsEditor: FC = () => {
  const { data, isLoading } = useModelItems<PagedResult<UserRole>>(
    'user-roles',
    { page: 1, limit: 999 }
  )
  const currentUser = useCurrentUser()
  const { t } = useTranslation()

  if (
    !currentUser?.can({
      action: 'update',
      targetModel: 'userRoles',
    })
  ) {
    return null
  }

  return (
    <AsideItemWrap title={t('Permission to update')} className="mt-10">
      <div className="grid grid-cols-1 gap-2.5 p-2.5">
        {isLoading
          ? loadingPlaceholder
          : data?.data.map((props) => <Item key={props.id} {...props} />)}
      </div>
    </AsideItemWrap>
  )
}
