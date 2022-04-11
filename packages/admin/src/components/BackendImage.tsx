import { ItemID } from '@prom-cms/shared'
import { FileService } from '@services'
import clsx from 'clsx'
import { DetailedHTMLProps, ImgHTMLAttributes, useMemo, VFC } from 'react'

export interface BackendImageProps
  extends Omit<
    DetailedHTMLProps<ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>,
    'src'
  > {
  imageId: ItemID
}

const BackendImage: VFC<BackendImageProps> = ({
  imageId,
  className,
  ...rest
}) => {
  const imageSrc = useMemo(
    () => '/api/' + FileService.getApiUrl(imageId),
    [imageId]
  )

  return <img src={imageSrc} className={clsx(className)} {...rest} />
}

export default BackendImage
