import { useGlobalContext } from '@contexts/GlobalContext'
import { iconSet } from '@prom-cms/icons'
import { EntryService } from '@services'
import { useMemo } from 'react'
import { modelIsCustom } from '@utils'

const menuItems = [
  { label: 'Domů', href: '/', icon: iconSet.Home },
  { label: 'Files', href: '/files', icon: iconSet.Photo },
]

export const useConstructedMenuItems = () => {
  const { models } = useGlobalContext()

  const finalMenuItems = useMemo(() => {
    let finalValue = menuItems
    if (models) {
      finalValue = [
        ...finalValue,
        ...Object.keys(models)
          .filter((modelKey) => !modelIsCustom(modelKey || ''))
          .map((modelKey) => ({
            href: EntryService.getListUrl(modelKey),
            icon: iconSet[models[modelKey].icon],
            label: modelKey.toUpperCase(),
          })),
      ].filter((item) => !!item.icon)
    }
    return finalValue
  }, [models])

  return finalMenuItems
}
