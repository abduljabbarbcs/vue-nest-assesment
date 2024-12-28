import { Auth } from './entities/auth.entity';

export type CreateUserOptions = Pick<Auth,  'email' | 'name' | 'password' | 'role'>;

export type DoesUserExist = Pick<CreateUserOptions, 'email'>;

export type Login = Pick<Auth,  'email' | 'password'>;
