import { User } from './User';

type MockDatabaseUserDatabase = Record<'users', User[]>;

type MockDatabaseOthers = Record<string, Record<string, any>[]>;

export type MockDatabaseFormat = MockDatabaseUserDatabase & MockDatabaseOthers;
