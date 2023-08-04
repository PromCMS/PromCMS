import inquirer, { DistinctQuestion, Answers } from 'inquirer';

/**
 * Creates prompt for only empty values
 * @param questions Question collection
 * @param preselectedValues Values that are already selected and have no need to be asked
 */
export const createPromptWithOverrides = async <T extends Answers>(
  questions: ReadonlyArray<DistinctQuestion<T> & { name: string }>,
  preselectedValues: Partial<T>
) => {
  const overridesAsKeys = Object.keys(preselectedValues);
  const optionsFromPrompt = await inquirer.prompt<Partial<T>>(
    questions.filter(({ name }) => overridesAsKeys.includes(name) == false)
  );

  return {
    ...preselectedValues,
    ...optionsFromPrompt,
  } as T;
};
