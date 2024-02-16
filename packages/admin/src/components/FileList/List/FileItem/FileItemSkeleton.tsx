import { Skeleton } from '@mantine/core';
import clsx from 'clsx';
import { FC, useRef } from 'react';

import { useClassNames } from '../../useClassNames';

const dynamicClassNames = ['w-4/5', 'w-1/2', 'w-1/3', 'w-4/6', 'w-8/12'];

export const FileItemSkeleton: FC<{
  animate?: boolean;
  className?: string;
}> = ({ animate, className }) => {
  const classNames = useClassNames();
  const widthClassName = useRef(
    dynamicClassNames[Math.floor(Math.random() * dynamicClassNames.length)]
  );

  return (
    <div className={className}>
      <Skeleton animate={animate} className={classNames.itemSquare(false)} />
      <Skeleton
        animate={animate}
        className={clsx(classNames.itemLabel, widthClassName.current, 'h-7')}
      />
    </div>
  );
};
