import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  private users: User[] = [];
  private idCounter = 1;

  create(dto: CreateUserDto): User {
    const user = new User({
      id: this.idCounter++,
      name: dto.name,
      email: dto.email,
      password: dto.password,
      birthDate: new Date(dto.birthDate),
    });
    this.users.push(user);
    return user;
  }

  findAll(): User[] {
    return this.users;
  }

  findOne(id: number): User {
    return <User>this.users.find((user: User) => user.id === id);
  }

  findByEmail(email: string): User {
    return <User>this.users.find((user: User) => user.email === email);
  }

  update(id: number, dto: UpdateUserDto): User | null {
    const user = this.findOne(id);
    if (!user) return null;
    Object.assign(user, dto);
    return user;
  }

  remove(id: number): void {
    this.users = this.users.filter((u) => u.id !== id);
  }
}
