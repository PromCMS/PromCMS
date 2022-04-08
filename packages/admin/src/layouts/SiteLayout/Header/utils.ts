import { useGlobalContext } from '@contexts/GlobalContext'
import { iconSet } from '@prom-cms/icons'
import { EntryService } from '@services'
import { useMemo } from 'react'
import { modelIsCustom } from '@utils'

const menuItems = [
  { label: 'Domů', href: '/', icon: iconSet.HomeIcon },
  { label: 'Files', href: '/files', icon: iconSet.PhotographIcon },
]

export const useConstructedMenuItems = () => {
  const { models } = useGlobalContext()

  const finalMenuItems = useMemo(() => {
    let finalValue = menuItems
    if (models) {
      finalValue = [
        ...finalValue,
        ...Object.keys(models)
          .filter(
            (modelKey) =>
              !modelIsCustom(models[modelKey].tableName?.toLowerCase() || '')
          )
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
