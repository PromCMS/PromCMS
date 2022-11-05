import { Spinner } from '../../components/Spinner';
import { Text } from 'ink';
import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { LoggedWorkerJob, MaybePromise } from '../../types';
import { Prompts, PromptsProps } from './Prompts';

enum Statuses {
  working = 'WORKING',
  skipped = 'SKIPPED',
  done = 'DONE',
  asking = 'ASKING',
}

export const WorkerJob: FC<{
  info: LoggedWorkerJob;
  onSuccess: (res?: Record<keyof PromptsProps['prompts'], any>) => void;
}> = ({ info, onSuccess }) => {
  const promptResult = useRef<Record<string, any>>();
  const [status, setStatus] = useState(
    info.skip
      ? Statuses.skipped
      : !!info.prompts && !promptResult.current
      ? Statuses.asking
      : Statuses.working
  );
  const workingJob = useRef<MaybePromise<void>>();

  const attachWorkingJob = (data?: any) => {
    workingJob.current = Promise.resolve(info.job()).finally(() => {
      setStatus(Statuses.done);
      onSuccess(data);
    });
  };

  const onPromptRes = useCallback<PromptsProps['onSuccess']>(
    (res) => attachWorkingJob(res),
    []
  );

  useEffect(() => {
    const hasPrompts = Object.keys(info.prompts || {}).length > 0;

    if (!workingJob.current && !info.skip && !hasPrompts) {
      attachWorkingJob();
    }

    if (info.skip) {
      onSuccess();
    }
  }, [info]);

  return (
    <>
      <Text color={status === Statuses.working ? 'blue' : 'gray'}>
        {!(status === Statuses.done || status === Statuses.skipped) && (
          <>
            <Spinner />{' '}
          </>
        )}
        {status} {info.title}
      </Text>
      {status !== Statuses.skipped && info.prompts && (
        <Prompts prompts={info.prompts} onSuccess={onPromptRes} />
      )}
    </>
  );
};
