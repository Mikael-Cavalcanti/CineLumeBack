export interface IUser {
  id: number;
  name: string;
  email: string;
  passwordHash: string;
  birthDate: Date;
  isActive: boolean;
}
