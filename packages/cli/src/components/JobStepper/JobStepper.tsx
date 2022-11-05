import { Box, Text } from 'ink';
import { FC, useCallback, useState } from 'react';
import { LoggedWorkerJob } from '../../types';
import { WorkerJob } from './WorkerJob';

interface JobStepperProps {
  jobs: LoggedWorkerJob<any>[];
  onJobDone?: () => void;
  onDone: () => void;
}

export const JobStepper: FC<JobStepperProps> = ({
  jobs,
  onJobDone: onJobDonePropagator,
  onDone,
}) => {
  const [shownJobs, setShownJobs] = useState(0);
  const isDone = shownJobs === jobs.length;

  const onJobDone = useCallback(() => {
    if (onJobDonePropagator) {
      onJobDonePropagator();
    }

    setShownJobs((prev) => {
      const nextValue = prev + 1;
      if (nextValue === jobs.length) {
        onDone();
      }

      return nextValue;
    });
  }, [onJobDonePropagator, onDone, jobs]);

  return (
    <Box flexDirection="column">
      {jobs.slice(0, shownJobs + 1).map((props) => (
        <WorkerJob key={props.title} info={props} onSuccess={onJobDone} />
      ))}

      {isDone && (
        <Text color="white" backgroundColor="white">
          Done! Bye!
        </Text>
      )}
    </Box>
  );
};
