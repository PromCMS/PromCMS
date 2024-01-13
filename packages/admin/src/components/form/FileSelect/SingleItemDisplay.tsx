import BackendImage from '@components/BackendImage';
import { MESSAGES } from '@constants';
import { useFileInfo } from 'hooks/useFileInfo';
import { FC } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { QuestionMark } from 'tabler-icons-react';

import { FileItem, ItemID } from '@prom-cms/api-client';

const ImageOrExtension: FC<FileItem> = ({ filename, mimeType, id }) => {
  if (mimeType?.includes('image')) {
    return (
      <BackendImage
        className="absolute w-full h-full top-0 left-0 object-contain"
        width={40}
        imageId={id}
      />
    );
  }

  return <>.{filename?.split('.').at(-1)}</>;
};

export const SingleItemDisplay: FC<{ pickedFileId?: ItemID }> = ({
  pickedFileId,
}) => {
  const { t } = useTranslation();
  const { data } = useFileInfo(pickedFileId);

  return (
    <div className="flex items-center gap-5">
      <div
        title={data?.filename}
        className="w-14 overflow-hidden aspect-square relative bg-gray-50 flex items-center justify-center shadow-md rounded-lg text-sm"
      >
        {pickedFileId ? (
          data ? (
            <ImageOrExtension {...data} />
          ) : (
            '...'
          )
        ) : (
          <QuestionMark />
        )}
      </div>
      <p className="text-gray-600">
        {pickedFileId ? (
          data ? (
            <Trans
              t={t}
              i18nKey={MESSAGES.FILE_IS_SELECTED__WITH_NAME}
              values={{ filename: data.filename }}
            >
              File has been selected: <br /> {{ filename: data.filename }}
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
