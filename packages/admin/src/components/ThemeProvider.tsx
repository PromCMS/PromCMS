import { MantineProvider, MantineThemeOverride } from '@mantine/core';
import { FC, PropsWithChildren } from 'react';

export const theme: MantineThemeOverride = {
  /** Put your mantine theme override here */
  fontFamily: "'Open Sans', sans-serif",
  defaultRadius: 'md',
  shadows: {
    sm: '0 10px 15px -3px #dbeafe, 0 4px 6px -4px #dbeafe',
  },
  components: {
    Input: {
      defaultProps: {
        size: 'md',
      },
    },
    TextInput: {
      defaultProps: {
        size: 'md',
      },
    },
    ColorInput: {
      defaultProps: {
        size: 'md',
      },
    },
    NumberInput: {
      defaultProps: {
        size: 'md',
      },
    },
    PasswordInput: {
      defaultProps: {
        size: 'md',
        radius: 'md',
      },
    },
    Textarea: {
      defaultProps: {
        size: 'md',
      },
    },
    Select: {
      defaultProps: {
        size: 'md',
      },
      classNames: {
        option: 'dark:text-gray-800',
      },
    },
    Drawer: {
      defaultProps: {
        offset: 8,
        radius: 'md',
      },
    },
    Overlay: {
      defaultProps: {
        blur: 4,
        backgroundOpacity: 0.5,
      },
    },

    Modal: {
      defaultProps: {
        size: 'lg',
        overflow: 'outside',
        transition: 'slide-up',
        centered: 'true',
      },
    },
    Paper: {
      classNames: {
        root: 'border-2 dark:border-0 border-blue-100 dark:backdrop-blur-md dark:bg-gray-800 sm:dark:bg-opacity-60',
      },
      defaultProps: {
        shadow: undefined,
      },
    },
    Popover: {
      defaultProps: {
        shadow: 'lg',
        radius: 'md',
      },
    },
    Divider: {
      styles: (theme) => ({
        root: {
          borderTopColor: `#e5e7eb!important`,
        },
      }),
    },
    Button: {
      defaultProps: {
        radius: 'md',
      },
    },
  },
};

const ThemeProvider: FC<PropsWithChildren> = ({ children }) => (
  <MantineProvider theme={theme}>{children}</MantineProvider>
);

export default ThemeProvider;
