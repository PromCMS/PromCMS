import { useLocalStorage } from '@mantine/hooks';
import { useMemo } from 'react';

export const useAsideToggle = () => {
  const [isOpen, setIsOpen] = useLocalStorage({
    key: 'aside-toggled',
    defaultValue: true,
    deserialize: (value) => value === 'true',
  });

  return useMemo(() => ({ isOpen, setIsOpen }), [setIsOpen, isOpen]);
};
