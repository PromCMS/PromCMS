import { DetailedHTMLProps, FC, ProgressHTMLAttributes } from 'react';

export interface ProgressProps
  extends DetailedHTMLProps<
    ProgressHTMLAttributes<HTMLProgressElement>,
    HTMLProgressElement
  > {
  loading?: boolean;
}

export const Progress: FC<ProgressProps> = ({ className }) => {
  return (
    <div>
      <span />
    </div>
  );
};
