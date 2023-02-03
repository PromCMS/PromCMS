import { useGlobalContext } from '@contexts/GlobalContext';
import { useMemo } from 'react';
import { modelIsCustom } from '@utils';
import { useCurrentUser } from '@hooks/useCurrentUser';
import { Icon } from 'tabler-icons-react';
import * as iconSet from 'tabler-icons-react';
import { pageUrls } from '@constants';

export type Item = {
  label: string;
  href: string;
  icon: Icon;
  isSingleton?: boolean;
};

export const useConstructedMenuItems = () => {
  const { models, singletons } = useGlobalContext();
  const currentUser = useCurrentUser();

  const finalMenuItems = useMemo(() => {
    let finalValue: Item[] = [];

    if (models && currentUser) {
      finalValue = [
        ...finalValue,
        ...Object.entries({ ...singletons, ...models })
          .filter(([modelKey]) => !modelIsCustom(modelKey || ''))
          .filter(([modelKey]) =>
            currentUser.can({ action: 'read', targetModel: modelKey })
          )
          .map(([modelKey, { icon, isSingleton, ...rest }]) => ({
            href: isSingleton
              ? pageUrls.singletons.view(modelKey)
              : pageUrls.entryTypes(modelKey).list,
            icon: iconSet[icon],
            label: modelKey,
            isSingleton,
          })),
      ].filter((item) => !!item.icon);
    }

    const singletonItems = finalValue.filter(({ isSingleton }) => isSingleton);
    const normalItems = finalValue.filter(({ isSingleton }) => !isSingleton);

    return { singletonItems, normalItems };
  }, [models, currentUser]);

  return finalMenuItems;
};
