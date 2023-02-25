import { apiClient } from '@api';
import { Image, ImageProps } from '@mantine/core';
import { ItemID } from '@prom-cms/shared';
import clsx from 'clsx';
import { useMemo, FC, forwardRef } from 'react';

export interface BackendImageProps extends Omit<ImageProps, 'src'> {
  imageId: ItemID | Record<string, string> | undefined;
  /**
   * @defaultValue 60
   */
  quality?: number;
  /**
   * @defaultValue false
   */
  previewOnHover?: boolean;
}

export type GetImageSrcOptions = {
  width?: number | string;
  height?: number | string;
  quality?: number;
};

const getNumericValue = (value?: any) => {
  if (!value) {
    return undefined;
  }

  return !Number.isNaN(Number(value)) && !value?.toString().includes('%')
    ? Number(value)
    : undefined;
};

export const getImageSrc = (
  imageInfo: ItemID | Record<string, string> | undefined,
  options: GetImageSrcOptions = {}
) => {
  if (typeof imageInfo === 'object' && imageInfo.path) {
    return imageInfo.path;
  }

  const id = String(imageInfo);

  if (id === 'null' || id === 'undefined') {
    return undefined;
  }

  // If somehow we get already madeup url
  if (id.startsWith('http')) {
    return id;
  }

  return apiClient.files
    .getAssetUrl(
      id,
      Object.fromEntries(
        Object.entries({
          w: getNumericValue(options.width),
          h: getNumericValue(options.height),
          q: options.quality,
        })
          .filter(([_, value]) => !!value)
          .map(([key, value]) => [key, String(value)])
      )
    )
    .toString();
};

const BackendImage: FC<BackendImageProps> = forwardRef<
  HTMLImageElement,
  BackendImageProps
>(function BackendImage(
  { imageId, className, quality = 60, width, height, ...rest },
  ref
) {
  const imageSrc = useMemo(
    () => getImageSrc(imageId, { width, height, quality }),
    [imageId, width, height, quality]
  );

  const image = (
    <Image
      ref={ref}
      alt=""
      src={typeof imageSrc === 'string' ? imageSrc : undefined}
      className={clsx(className)}
      width={width}
      height={height}
      withPlaceholder
      fit="cover"
      {...rest}
    />
  );

  return image;
});

export default BackendImage;
