import { FC, useEffect, useState } from 'react';

const symbolSequence = ['|', '/', '-', '\\'] as const;
type Symbols = typeof symbolSequence[number];

export const Spinner: FC<{
  /**
   * @defaultValue false
   */
  disabled?: boolean;
}> = ({ disabled = false }) => {
  const [activeSymbol, setActiveSymbol] = useState<Symbols>('|');

  useEffect(() => {
    let interval: NodeJS.Timer;

    if (!disabled) {
      interval = setInterval(() => {
        setActiveSymbol((prev) => {
          const prevIndex = symbolSequence.findIndex((symb) => symb === prev);

          if (prevIndex === symbolSequence.length - 1) {
            return symbolSequence[0];
          }

          return symbolSequence[prevIndex + 1];
        });
      }, 150);
    }

    return () => clearInterval(interval);
  }, [disabled]);

  return <>{activeSymbol}</>;
};
