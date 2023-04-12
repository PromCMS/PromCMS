import { ZodString, ZodNumber, ZodError } from 'zod';

/**
 * Runs zod parse function and catches error with formatting it accordingly
 */
export const modifiedParse = (
  parseFnc: ZodString['parse'] | ZodNumber['parse'],
  inputValue: unknown
) => {
  try {
    return parseFnc(inputValue);
  } catch (error) {
    if (error instanceof ZodError) {
      throw new Error(
        error.errors.map((value) => value.message).join(' and ') ?? ''
      );
    }

    throw error;
  }
};
