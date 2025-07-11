import { IUser } from '../interfaces/user.interface';

export class User implements IUser {
  id: number;
  name: string;
  email: string;
  password: string;
  birthDate: Date;

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}
