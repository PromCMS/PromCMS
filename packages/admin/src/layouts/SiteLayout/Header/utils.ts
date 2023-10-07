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
          .filter(
            ([_modelKey, modelInfo]) =>
              !modelInfo.admin.hidden && modelInfo.enabled
          )
          .filter(
            ([modelKey, model]) =>
              currentUser.can({ action: 'read', targetModel: modelKey }) &&
              (model.isSingleton
                ? currentUser.can({ action: 'update', targetModel: modelKey })
                : true)
          )
          .map(([modelKey, { icon, isSingleton, title }]) => ({
            href: isSingleton
              ? pageUrls.singletons.view(modelKey)
              : pageUrls.entryTypes(modelKey).list,
            icon: iconSet[icon],
            label: title || modelKey,
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
