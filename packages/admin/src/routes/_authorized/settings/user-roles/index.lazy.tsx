import { useUserRoles } from '@hooks/useUserRoles';
import { PageLayout } from '@layouts/PageLayout';
import { Alert, JsonInput, LoadingOverlay } from '@mantine/core';
import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/_authorized/settings/user-roles/')({
  component: Page,
});

function Page() {
  const { data, isLoading, isError, isRefetching } = useUserRoles();

  return (
    <PageLayout>
      <PageLayout.Header title="User roles" />
      <PageLayout.Content>
        <div className="relative min-h-[400px]">
          <LoadingOverlay
            visible={isLoading || isRefetching || isError}
            overlayProps={{ blur: 2 }}
          />

          <Alert>Editting is only allowed through code configuration</Alert>

          <JsonInput
            className="mt-5"
            disabled
            autosize
            value={JSON.stringify(data ?? [], null, 2)}
          />
        </div>
      </PageLayout.Content>
    </PageLayout>
  );
}
