import { useGlobalContext } from '@contexts/GlobalContext';
import { iconSet } from '@prom-cms/icons';
import { EntryService } from '@services';
import { useMemo } from 'react';
import { modelIsCustom } from '@utils';
import { useCurrentUser } from '@hooks/useCurrentUser';

const menuItems = [
  { label: 'Domů', href: '/', icon: iconSet.Home },
  { label: 'Files', href: '/files', icon: iconSet.Photo },
];

export const useConstructedMenuItems = () => {
  const { models } = useGlobalContext();
  const currentUser = useCurrentUser();

  const finalMenuItems = useMemo(() => {
    let finalValue = menuItems;
    if (models && currentUser) {
      finalValue = [
        ...finalValue,
        ...Object.entries(models)
          .filter(([modelKey]) => !modelIsCustom(modelKey || ''))
          .filter(([modelKey]) =>
            currentUser.can({ action: 'read', targetModel: modelKey })
          )
          .map(([modelKey, { icon }]) => ({
            href: EntryService.getListUrl(modelKey),
            icon: iconSet[icon],
            label: modelKey.toUpperCase(),
          })),
      ].filter((item) => !!item.icon);
    }
    return finalValue;
  }, [models, currentUser]);

  return finalMenuItems;
};
