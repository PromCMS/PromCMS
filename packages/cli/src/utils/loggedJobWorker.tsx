import { ArgList, Command, GlobalOptions } from '@boost/cli';
import type { PromptProps } from '@boost/cli/src/components/internal/Prompt';
import { useProgram } from '@boost/cli/react';
import { Spinner, WorkerJob } from '../components';
import { Text, Box } from 'ink';
import { FC, useCallback, useState } from 'react';
import { LoggedWorkerJob, MaybePromise } from 'types';

export type Prompts = { items: PromptItem[] };
export type PromptItem = {
  type: (props: any) => JSX.Element;
  props?: Omit<PromptProps<any>, 'onSubmit'> & Record<string, any>;
};

export const getWorkerJob = <T extends Record<string, unknown>>(
  title: string,
  options: Omit<LoggedWorkerJob, 'job' | 'prompts' | 'title'> & {
    job: (context?: T) => MaybePromise<void>;
    prompts?: () => MaybePromise<Record<keyof T, PromptItem>>;
  }
) => ({
  title,
  ...options,
});

const Component: FC<{
  jobs: LoggedWorkerJob<any>[];
}> = ({ jobs }) => {
  const [shownJobs, setShownJobs] = useState(0);
  const isDone = shownJobs === jobs.length;
  const { exit: exitProgram } = useProgram();

  const onJobDone = useCallback(() => {
    setShownJobs((prev) => {
      const nextValue = prev + 1;
      if (nextValue === jobs.length) {
        setTimeout(() => {
          exitProgram();
        }, 200);
      }

      return nextValue;
    });
  }, []);

  return (
    <Box flexDirection="column">
      {jobs.slice(0, shownJobs + 1).map((props) => (
        <WorkerJob key={props.title} info={props} onSuccess={onJobDone} />
      ))}

      {isDone ? (
        <Text color="white" backgroundColor="white">
          Done! Bye!
        </Text>
      ) : (
        <Text color="green">
          <Spinner /> Please wait...
        </Text>
      )}
    </Box>
  );
};

export async function loggedJobWorker<
  T extends Command<GlobalOptions, ArgList, {}>,
  J extends LoggedWorkerJob<any>[]
>(this: T, jobs: J) {
  await this.render(<Component jobs={jobs} />);
}
