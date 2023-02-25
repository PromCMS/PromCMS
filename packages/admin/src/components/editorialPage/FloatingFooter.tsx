import { useAsideToggle } from '@hooks/useAsideToggle';
import { ActionIcon, clsx, Paper, Tooltip } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { FC, PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronLeft } from 'tabler-icons-react';

export const FloatingFooter: FC<
  PropsWithChildren & { isSubmitting?: boolean }
> = ({ children, isSubmitting = false }) => {
  const { isOpen: asideOpen, setIsOpen: setAsideOpen } = useAsideToggle();
  const { t } = useTranslation();
  const isDesktop = useMediaQuery('(min-width: 1024px)');

  return (
    <Paper
      shadow={isDesktop ? 'lg' : undefined}
      component="footer"
      className="align-center container mb-10 lg:mb-0 lg:sticky bottom-1 left-0 z-10 mx-auto flex max-h-20 border-2 gap-3 border-project-border p-3"
    >
      <div className="items-center justify-between flex w-full">{children}</div>
      <Tooltip
        withArrow
        label={t('Toggle more options')}
        position="top"
        color="gray"
      >
        <ActionIcon
          size="xl"
          color="blue"
          variant="light"
          type="button"
          loading={isSubmitting}
          className={clsx(
            isSubmitting && '!cursor-progress',
            'flex-none hidden lg:flex'
          )}
          sx={{
            width: 50,
            height: 50,
          }}
          onClick={() => setAsideOpen((prev) => !prev)}
        >
          <ChevronLeft
            className={clsx(
              'aspect-square w-20 duration-150',
              asideOpen && 'rotate-180'
            )}
          />
        </ActionIcon>
      </Tooltip>
    </Paper>
  );
};
