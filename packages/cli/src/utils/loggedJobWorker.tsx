import { ArgList, Command, GlobalOptions } from '@boost/cli';
import { useProgram } from '@boost/cli/react';
import { Text, Box, useInput } from 'ink';
import { FC, useEffect, useState } from 'react';

const LAST_JOB_TITLE = '__last';

export type LoggedWorkerJob = {
  title: string;
  job: () => Promise<void>;
  skip?: boolean;
};

const symbols = ['|', '/', '-', '\\'] as const;
type ActiveSymbols = typeof symbols[number];

const Spinner: FC<{
  /**
   * @defaultValue false
   */
  disabled?: boolean;
}> = ({ disabled = false }) => {
  const [activeSymbol, setActiveSymbol] = useState<ActiveSymbols>('|');

  useEffect(() => {
    let interval: NodeJS.Timer;

    if (!disabled) {
      interval = setInterval(() => {
        setActiveSymbol((prev) => {
          const prevIndex = symbols.findIndex((symb) => symb === prev);

          if (prevIndex === symbols.length - 1) {
            return symbols[0];
          }

          return symbols[prevIndex + 1];
        });
      }, 150);
    }

    return () => clearInterval(interval);
  }, [disabled]);

  return <>{activeSymbol}</>;
};

const Component: FC<{ jobs: LoggedWorkerJob[] }> = ({ jobs }) => {
  const [activeJobs, setActiveJobs] = useState<LoggedWorkerJob[]>([]);
  const { exit: exitProgram, log } = useProgram();

  useEffect(() => {
    const run = async () => {
      try {
        for (const jobInfo of jobs) {
          const { job, skip } = jobInfo;
          setActiveJobs((prev) => [jobInfo, ...prev]);

          if (skip) {
            continue;
          }
          await job();
        }

        setActiveJobs((prev) => [
          { job: async () => {}, title: LAST_JOB_TITLE, skip: true },
          ...prev,
        ]);
      } catch (error) {
        exitProgram(error as Error);
      }
    };

    run();
  }, [jobs]);

  const prevJobs = activeJobs.slice(1, 3);
  const latestElement: LoggedWorkerJob | undefined = activeJobs[0];
  const isDone = latestElement?.title === LAST_JOB_TITLE;

  useInput(() => {
    if (isDone) {
      exitProgram();
    }
  });

  return (
    <Box flexDirection="column">
      {prevJobs.reverse().map(({ title, skip }, index) => (
        <Text key={title} color="grey">
          {skip ? 'SKIPPED' : 'DONE'} {title}
        </Text>
      ))}
      {latestElement && !isDone && (
        <Text color="blue">WORKING {latestElement.title}</Text>
      )}
      {isDone ? (
        <Text color="white" backgroundColor="white">
          Done! Press any key to exit..
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
  T extends Command<GlobalOptions, ArgList, {}>
>(this: T, jobs: LoggedWorkerJob[]) {
  await this.render(<Component jobs={jobs} />);
}
