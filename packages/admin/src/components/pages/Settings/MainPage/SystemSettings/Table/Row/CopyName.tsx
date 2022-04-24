import { ActionIcon, Tooltip } from '@mantine/core'
import { useClipboard } from '@mantine/hooks'
import { iconSet } from '@prom-cms/icons'
import { VFC } from 'react'
import { useTranslation } from 'react-i18next'

export const CopyName: VFC<{ name: string }> = ({ name }) => {
  const clipboard = useClipboard()
  const { t } = useTranslation()

  return (
    <Tooltip
      label={t('Copied!')}
      gutter={5}
      placement="center"
      position="bottom"
      radius="xl"
      transition="slide-down"
      transitionDuration={150}
      opened={clipboard.copied}
    >
      <ActionIcon color="blue" onClick={() => clipboard.copy(name)} size={20}>
        <iconSet.Paperclip size={20} />
      </ActionIcon>
    </Tooltip>
  )
}
