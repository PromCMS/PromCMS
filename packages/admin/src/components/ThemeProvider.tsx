import { MantineProvider, MantineThemeOverride } from '@mantine/core';
import { FC, PropsWithChildren } from 'react';

export const theme: MantineThemeOverride = {
  /** Put your mantine theme override here */
  colorScheme: 'light',
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
    },
    Modal: {
      defaultProps: {
        size: 'lg',
        overflow: 'outside',
        transition: 'slide-up',
        centered: 'true',
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
  <MantineProvider withGlobalStyles withNormalizeCSS theme={theme}>
    {children}
  </MantineProvider>
);

export default ThemeProvider;
