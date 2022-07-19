import { ItemID } from '@prom-cms/shared';
import { FileService } from '@services';
import clsx from 'clsx';
import { DetailedHTMLProps, ImgHTMLAttributes, useMemo, VFC } from 'react';

export interface BackendImageProps
  extends Omit<
    DetailedHTMLProps<ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>,
    'src'
  > {
  imageId: ItemID | Record<string, string> | undefined;
  /**
   * @defaultValue 60
   */
  quality?: number;
}

const BackendImage: VFC<BackendImageProps> = ({
  imageId,
  className,
  quality = 60,
  width,
  height,
  ...rest
}) => {
  const imageSrc = useMemo(
    () =>
      imageId
        ? typeof imageId === 'number' || typeof imageId === 'string'
          ? String(imageId).startsWith('http')
            ? String(imageId)
            : FileService.getApiRawUrl(
                imageId,
                Object.fromEntries(
                  Object.entries({ w: width, h: height, q: quality })
                    .filter(([_, value]) => !!value)
                    .map(([key, value]) => [key, String(value)])
                ),
                true
              )
          : imageId.path
        : undefined,
    [imageId, width, height, quality]
  );

  return imageId ? (
    <img
      src={imageSrc}
      className={clsx(className)}
      width={width}
      height={height}
      alt=""
      {...rest}
    />
  ) : null;
};

export default BackendImage;
