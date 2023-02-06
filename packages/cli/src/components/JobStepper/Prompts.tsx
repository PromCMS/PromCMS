import { Box, Text } from 'ink';
import { FC, useCallback, useMemo, useState } from 'react';
import { LoggedWorkerJob } from '@custom-types';

export type PromptsProps = {
  onSuccess: (props: Record<string, any>) => void;
  prompts: NonNullable<LoggedWorkerJob<any>['prompts']>;
};

export const Prompts: FC<PromptsProps> = ({ onSuccess, prompts }) => {
  const [shownPrompts, setShownPrompts] = useState(0);
  const [promptResults, setPromptResults] = useState<
    Partial<Record<keyof PromptsProps['prompts'], any>>
  >({});

  const getOnSubmit = useCallback(
    (key) => (value) => {
      let promptValues;

      setPromptResults((prev) => {
        const next = { ...prev, [key]: value };

        promptValues = next;

        return next;
      });

      setShownPrompts((prev) => {
        const next = prev + 1;

        if (next === prompts.length) {
          onSuccess(promptValues);
        }

        return next;
      });
    },
    [onSuccess]
  );

  const slicedPrompts = useMemo(
    () => prompts.slice(0, shownPrompts + 1),
    [prompts, shownPrompts]
  );

  return (
    <>
      {slicedPrompts.map(([key, value]) => {
        const resultValue = promptResults[key];
        const isDone = !!resultValue;
        const Component = value.type;

        return (
          <Box key={key as any}>
            {isDone ? (
              <Text>
                {'? '}
                {value.props?.label}...{' '}
                <Text color="green">{JSON.stringify(resultValue)}</Text>
              </Text>
            ) : (
              <Component onSubmit={getOnSubmit(key)} {...value.props} />
            )}
          </Box>
        );
      })}
    </>
  );
};
