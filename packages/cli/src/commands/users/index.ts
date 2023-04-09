import { ArgList, Command, RunResult } from '@boost/cli';
import { ChangePasswordUserProgram } from './change-password.js';
import { CreateUsersProgram } from './create.js';
import { DeleteUserProgram } from './delete.js';

export class UsersScaffoldCommand extends Command {
  static path: string = 'users';
  static description: string = 'Users management made easy';

  constructor() {
    super();

    this.register(new CreateUsersProgram());
    this.register(new ChangePasswordUserProgram());
    this.register(new DeleteUserProgram());
  }

  // Just for typescript sake
  run(...params: ArgList): RunResult | Promise<RunResult> {
    throw new Error('Method not implemented.');
  }
}
