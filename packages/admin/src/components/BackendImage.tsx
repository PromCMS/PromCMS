import { apiClient } from '@api';
import clsx from 'clsx';
import { DetailedHTMLProps, FC, ImgHTMLAttributes, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { PhotoOff } from 'tabler-icons-react';

import { ItemID } from '@prom-cms/api-client';

export interface BackendImageProps
  extends Omit<
    DetailedHTMLProps<ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>,
    'src'
  > {
  imageId: ItemID | Record<string, string> | undefined | null;
  /**
   * @defaultValue 60
   */
  quality?: number;
  /**
   * @defaultValue 30
   */
  iconSize?: number;
}

const BackendImage: FC<BackendImageProps> = ({
  imageId,
  className,
  quality = 60,
  iconSize = 30,
  width,
  height,
  ...rest
}) => {
  const { t } = useTranslation();

  const imageSrc = useMemo(() => {
    if (typeof imageId === 'object' && imageId?.path) {
      return imageId.path;
    }

    const id = String(imageId);

    if (id === 'null' || id === 'undefined') {
      return undefined;
    }

    return String(id).startsWith('http')
      ? String(id)
      : apiClient.files
          .getAssetUrl(
            id,
            Object.fromEntries(
              Object.entries({ w: width, h: height, q: quality })
                .filter(([_, value]) => !!value)
                .map(([key, value]) => [key, String(value)])
            )
          )
          .toString();
  }, [imageId, width, height, quality]);

  return !!imageSrc ? (
    <img
      src={imageSrc}
      className={clsx(className)}
      width={width}
      height={height}
      alt=""
      {...rest}
    />
  ) : (
    <div
      className={clsx(
        'flex items-center justify-center bg-gray-50',
        !className?.includes('w-') ? 'w-full' : '',
        !className?.includes('h-') ? 'h-full' : '',
        className
      )}
      title={t('Empty')}
    >
      <PhotoOff size={iconSize} className="my-2" />
    </div>
  );
};

export default BackendImage;
