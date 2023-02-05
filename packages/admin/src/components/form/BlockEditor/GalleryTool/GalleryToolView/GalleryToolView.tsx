import clsx from 'clsx';
import ContextProviders from '../../../../../layouts/ContextProviders';
import { FC } from 'react';
import { GalleryToolData } from '../GalleryTool';
import { GalleryToolViewContextProvider } from './context';
import { ImageList } from './ImageList';
import { Label } from './Label';

export const ImageToolView: FC<{
  data: GalleryToolData;
  onDataChange: (data: Partial<GalleryToolData>) => void;
  readOnly: boolean;
}> = ({ data, onDataChange, readOnly }) => (
  <ContextProviders>
    <GalleryToolViewContextProvider
      onDataChange={onDataChange}
      readOnly={readOnly}
      initialData={data}
    >
      <div className={clsx('relative min-h-[200px] w-full rounded-lg')}>
        <Label />
        <ImageList />
      </div>
    </GalleryToolViewContextProvider>
  </ContextProviders>
);
