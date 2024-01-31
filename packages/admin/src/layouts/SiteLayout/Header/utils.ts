import { pageUrls } from '@constants';
import { modelIsCustom } from '@utils';
import { useGlobalContext } from 'contexts/GlobalContext';
import { useCurrentUser } from 'hooks/useCurrentUser';
import { useMemo } from 'react';
import { Icon } from 'tabler-icons-react';
import * as iconSet from 'tabler-icons-react';

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
          .filter(([modelKey, modelInfo]) => {
            if (modelIsCustom(modelKey || '') || modelInfo.admin.isHidden) {
              return false;
            }

            return (
              currentUser.can({
                action: 'read',
                targetEntityTableName: modelKey,
              }) &&
              (modelKey in models === false
                ? currentUser.can({
                    action: 'update',
                    targetEntityTableName: modelKey,
                  })
                : true)
            );
          })
          .map(([modelKey, { title, admin }]) => {
            const isSingleton = modelKey in models === false;

            return {
              href: isSingleton
                ? pageUrls.singletons.view(modelKey)
                : pageUrls.entryTypes(modelKey).list,
              icon: iconSet[admin.icon],
              label: title || modelKey,
              isSingleton,
            };
          }),
      ].filter((item) => !!item.icon);
    }

    const singletonItems = finalValue.filter(({ isSingleton }) => isSingleton);
    const normalItems = finalValue.filter(({ isSingleton }) => !isSingleton);

    return { singletonItems, normalItems };
  }, [models, currentUser]);

  return finalMenuItems;
};
