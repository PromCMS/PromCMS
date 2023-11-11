import { AxiosError } from 'axios';

export class FileTooLargeError extends AxiosError {
  constructor(predicate?: AxiosError) {
    const message = 'File too large';
    super(
      message,
      predicate?.code,
      predicate?.config,
      predicate?.request,
      predicate?.response
    );

    this.name = 'FileTooLargeError';
  }
}
