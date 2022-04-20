import { Paper, Title } from '@mantine/core'
import clsx from 'clsx'
import { DetailedHTMLProps, FC, HTMLAttributes } from 'react'

const AsideItemWrap: FC<
  DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>
> = ({ children, className, title, ref, ...rest }) => (
  <Paper
    className={clsx(
      'rounded-lg border-2 border-project-border shadow-lg shadow-blue-100',
      className
    )}
    shadow="smallBlue"
    withBorder
    {...rest}
  >
    {title && (
      <Title
        order={5}
        sx={(theme) => ({
          borderBottom: `2px solid ${theme.colors.gray[2]}`,
        })}
        className="w-full px-4 py-4 text-2xl font-semibold"
      >
        {title}
      </Title>
    )}
    {children}
  </Paper>
)

export default AsideItemWrap
