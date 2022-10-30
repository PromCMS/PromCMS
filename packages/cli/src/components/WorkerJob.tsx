import { Text } from 'ink';
import { FC, useEffect, useRef, useState } from 'react';
import { LoggedWorkerJob, MaybePromise } from 'types';

enum Statuses {
  working = 'WORKING',
  skipped = 'SKIPPED',
  done = 'DONE',
}

export const WorkerJob: FC<{
  info: LoggedWorkerJob;
  onSuccess: () => void;
}> = ({ info, onSuccess }) => {
  const [status, setStatus] = useState(
    info.skip ? Statuses.skipped : Statuses.working
  );
  const workingJob = useRef<MaybePromise<void>>();

  useEffect(() => {
    if (!workingJob.current && !info.skip) {
      workingJob.current = Promise.resolve(info.job()).finally(() => {
        setStatus(Statuses.done);
        onSuccess();
      });
    }

    if (info.skip) {
      onSuccess();
    }
  }, [info]);

  return (
    <>
      <Text color={status === Statuses.working ? 'blue' : 'gray'}>
        {status} {info.title}
      </Text>
    </>
  );
};
