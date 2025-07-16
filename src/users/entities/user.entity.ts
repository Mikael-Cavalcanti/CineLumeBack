import { IUser } from '../interfaces/user.interface';

export class User implements IUser {
  id: number;
  name: string;
  email: string;
  passwordHash: string;
  birthDate: Date;
  isActive: boolean;
  verificationCode?: string;

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}
