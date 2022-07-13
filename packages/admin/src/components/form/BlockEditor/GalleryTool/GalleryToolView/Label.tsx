import { TextInput, Title } from '@mantine/core'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { useGalleryToolViewContext } from './context'

export const Label: FC = () => {
  const { t } = useTranslation()
  const { label, changeLabel, readOnly } = useGalleryToolViewContext()

  return readOnly ? (
    label ? (
      <Title order={3}>{label}</Title>
    ) : null
  ) : (
    <TextInput
      label={t('Gallery name')}
      value={label || ''}
      size="xl"
      placeholder={t('Some fancy gallery name...')}
      onChange={(e) => changeLabel(e.currentTarget.value)}
      className="mt-2"
    />
  )
}
