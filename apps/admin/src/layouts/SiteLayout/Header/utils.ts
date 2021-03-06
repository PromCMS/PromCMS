import { useGlobalContext } from '@contexts/GlobalContext';
import { EntryService } from '@services';
import { useMemo } from 'react';
import { modelIsCustom } from '@utils';
import { useCurrentUser } from '@hooks/useCurrentUser';
import { Home, Photo } from 'tabler-icons-react';
import * as iconSet from 'tabler-icons-react';

const menuItems = [
  { label: 'Domů', href: '/', icon: Home },
  { label: 'Files', href: '/files', icon: Photo },
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
