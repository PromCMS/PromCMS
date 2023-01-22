import { ArgList, Command, GlobalOptions } from '@boost/cli';
import { useProgram } from '@boost/cli/react';
import { FC, useCallback } from 'react';
import { LoggedWorkerJob } from '@custom-types';
import { JobStepper } from '@components';

export interface PromptProps<T> {
  /** Label to display before or above the prompt itself. */
  label: NonNullable<React.ReactNode>;
  /** Single character symbol to display before the label. Defaults to "?"". */
  prefix?: string;
  /** Callback triggered when the value is submitted. */
  onSubmit: (value: T) => void;
  /** Function to validate the value on submit. To trigger a failed state, thrown an `Error`. */
  validate?: (value: T) => void;
}

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
