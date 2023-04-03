import { MESSAGES } from '@constants';
import { useFileInfo } from '@hooks/useFileInfo';
import { ItemID } from '@prom-cms/shared';
import { FC } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { QuestionMark } from 'tabler-icons-react';

export const SingleItemDisplay: FC<{ pickedFileId?: ItemID }> = ({
  pickedFileId,
}) => {
  const { t } = useTranslation();
  const { data } = useFileInfo(pickedFileId);

  return (
    <div className="flex items-center gap-5">
      <div className="w-14 aspect-square relative bg-gray-50 flex items-center justify-center border-2 border-gray-100 rounded-lg text-sm">
        {pickedFileId ? (
          data ? (
            <>.{data.filename?.split('.').at(-1)}</>
          ) : (
            '...'
          )
        ) : (
          <QuestionMark />
        )}
      </div>
      <p className="text-gray-400">
        {pickedFileId ? (
          data ? (
            <Trans
              t={t}
              i18nKey={MESSAGES.FILE_IS_SELECTED__WITH_NAME}
              values={{ filename: data.filename }}
            >
              File has been selected: {{ filename: data.filename }}
            </Trans>
          ) : (
            t(MESSAGES.PLEASE_WAIT)
          )
        ) : (
          t(MESSAGES.NO_SELECTED_FILE)
        )}
      </p>
    </div>
  );
};
