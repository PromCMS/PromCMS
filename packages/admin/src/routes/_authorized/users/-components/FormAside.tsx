import AsideItemWrap from '@components/editorialPage/AsideItemWrap';
import { AsideWrapper } from '@components/editorialPage/AsideWrapper';
import { MESSAGES } from '@constants';
import clsx from 'clsx';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { useData } from '../-context';
import { useCurrentUser } from '../-hooks/useCurrentUser';

export const FormAside: FC = () => {
  const { view } = useData();
  const { data: user } = useCurrentUser();
  const { t } = useTranslation();

  return (
    <AsideWrapper isOpen>
      <AsideItemWrap className="!pt-0" title={t(MESSAGES.PUBLISH_INFO)}>
        {view === 'update' && (
          <div className={clsx('w-full bg-white py-5 px-4')}>
            <ul className="flex list-disc flex-col gap-2 pl-5">
              <li>
                {t(MESSAGES.STATE)}:{' '}
                <span className="font-semibold text-blue-600">
                  {user?.state}
                </span>
              </li>
            </ul>
          </div>
        )}
      </AsideItemWrap>
    </AsideWrapper>
  );
};
