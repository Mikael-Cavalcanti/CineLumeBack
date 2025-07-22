import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateUserDto): Promise<User> {
    try {
      return await this.prisma.user.create({
        data: {
          name: dto.name,
          email: dto.email,
          password: dto.password,
          birthDate: new Date(dto.birthDate),
        },
      });
    } catch (err) {
      console.error('Error creating user:', err);
      throw new Error('Error creating user');
    }
  }

  async findOne(id: number): Promise<User | null> {
    try {
      return await this.prisma.user.findUnique({
        where: { id },
      });
    } catch (e) {
      console.error('Error finding user:', e);
      return null;
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      return await this.prisma.user.findUnique({
        where: { email },
      });
    } catch (err) {
      console.error('Error finding user by email:', err);
      return null;
    }
  }

  async update(id: number, dto: UpdateUserDto): Promise<User | null> {
    try {
      return await this.prisma.user.update({
        where: { id },
        data: {
          name: dto.name,
          email: dto.email,
          password: dto.password,
          birthDate: new Date(dto.birthDate),
        },
      });
    } catch (e) {
      console.error('Error updating user:', e);
      return null;
    }
  }

  async remove(id: number): Promise<User | null> {
    try {
      return await this.prisma.user.delete({
        where: { id },
      });
    } catch (err) {
      console.error('Error removing user:', err);
      return null;
    }
  }
}
