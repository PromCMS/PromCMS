import { PromptItem } from './utils';

export type MaybePromise<T> = Promise<T> | T;

export type LoggedWorkerJob<
  T extends Record<string, any> | undefined = undefined
> = {
  title: string;
  prompts?: [keyof T, PromptItem][];
  job: (params?: T) => MaybePromise<void>;
  skip?: boolean;
};
