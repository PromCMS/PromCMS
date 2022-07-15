import { MantineProvider } from '@mantine/core'
import { FC } from 'react'

const ThemeProvider: FC = ({ children }) => (
  <MantineProvider
    withGlobalStyles
    withNormalizeCSS
    defaultProps={{
      Input: {
        size: 'md',
      },
      TextInput: {
        size: 'md',
      },
      PasswordInput: {
        size: 'md',
        radius: 'md',
      },
      Textarea: {
        size: 'md',
      },
      Select: {
        size: 'md',
      },
      Modal: {
        size: 'lg',
        overflow: 'outside',
        transition: 'slide-up',
        centered: 'true',
      },
      Popover: {
        shadow: 'lg',
        radius: 'lg',
      },
    }}
    styles={{
      Divider: (theme) => ({
        root: {
          borderTopColor: `#e5e7eb!important`,
        },
      }),
    }}
    theme={{
      /** Put your mantine theme override here */
      colorScheme: 'light',
      fontFamily: "'Open Sans', sans-serif",
      defaultRadius: 'md',
      shadows: {
        smallBlue: '0 10px 15px -3px #dbeafe, 0 4px 6px -4px #dbeafe',
      },
    }}
  >
    {children}
  </MantineProvider>
)

export default ThemeProvider
