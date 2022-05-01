import { ItemID } from '@prom-cms/shared'
import { FileService } from '@services'
import clsx from 'clsx'
import { DetailedHTMLProps, ImgHTMLAttributes, useMemo, VFC } from 'react'

export interface BackendImageProps
  extends Omit<
    DetailedHTMLProps<ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>,
    'src'
  > {
  imageId: ItemID | Record<string, string>
}

const BackendImage: VFC<BackendImageProps> = ({
  imageId,
  className,
  ...rest
}) => {
  const imageSrc = useMemo(
    () =>
      imageId
        ? typeof imageId === 'number' || typeof imageId === 'string'
          ? '/api' + FileService.getApiRawUrl(imageId)
          : imageId.path
        : undefined,
    [imageId]
  )

  return imageId ? (
    <img src={imageSrc} className={clsx(className)} {...rest} />
  ) : null
}

export default BackendImage
