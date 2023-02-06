import { Skeleton } from '@mantine/core';
import {
  DetailedHTMLProps,
  forwardRef,
  ImgHTMLAttributes,
  ReactNode,
  useState,
} from 'react';

export type FallbackType = 'loading' | 'not-found' | 'error';

export type FlagProps = Omit<
  DetailedHTMLProps<ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>,
  'src' | 'placeholder'
> & {
  /**
   * Country code to display
   */
  countryCode: string;
  /**
   * Placeholder element for when the flag is loading
   */
  placeholder?: ReactNode | ((options: { type: FallbackType }) => ReactNode);
};

export const Flag = forwardRef<HTMLImageElement, FlagProps>(function Flag(
  { countryCode, placeholder, width = 20, height = 15, ...rest },
  ref
) {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  return (
    <>
      <img
        ref={ref}
        src={`https://flagicons.lipis.dev/flags/4x3/${countryCode}.svg`}
        width={width}
        height={height}
        style={{
          display: isLoading || isError ? 'none' : undefined,
        }}
        onLoad={() => setIsLoading(false)}
        onError={() => setIsError(true)}
        {...rest}
      />
      {(isLoading || isError) &&
        (placeholder ?? (
          <Skeleton m={0} p={0} width={width} height={height} radius={0} />
        ))}
    </>
  );
});
