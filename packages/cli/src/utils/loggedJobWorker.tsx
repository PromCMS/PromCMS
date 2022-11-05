import { ArgList, Command, GlobalOptions } from '@boost/cli';
import type { PromptProps } from '@boost/cli/src/components/internal/Prompt';
import { useProgram } from '@boost/cli/react';
import { FC, useCallback } from 'react';
import { LoggedWorkerJob } from 'types';
import { JobStepper } from '../components';

export type PromptItem = {
  type: (props: any) => JSX.Element;
  props?: Omit<PromptProps<any>, 'onSubmit'> & Record<string, any>;
};

export const getWorkerJob = <T extends Record<string, unknown>>(
  title: string,
  options: Omit<LoggedWorkerJob, 'job' | 'prompts' | 'title'> & {
    job: LoggedWorkerJob<T>['job'];
    prompts?: LoggedWorkerJob<T>['prompts'];
  }
) => ({
  title,
  ...options,
});

const Component: FC<{
  jobs: LoggedWorkerJob<any>[];
}> = ({ jobs }) => {
  const { exit: exitProgram } = useProgram();

  const onDone = useCallback(() => {
    setTimeout(() => {
      exitProgram();
    }, 200);
  }, []);

  return <JobStepper jobs={jobs} onDone={onDone} />;
};

export async function loggedJobWorker<
  T extends Command<GlobalOptions, ArgList, {}>,
  J extends LoggedWorkerJob<any>[]
>(this: T, jobs: J) {
  const s = await this.render(<Component jobs={jobs} />);
}
