import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existingUser = this.usersService.findByEmail(dto.email);
    if (existingUser)
      throw new UnauthorizedException('Email already registered');

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user: User = this.usersService.create({
      name: dto.name,
      email: dto.email,
      password: hashedPassword,
      birthDate: new Date(dto.birthDate),
    });

    return { message: 'User registered successfully', user };
  }

  async login(dto: LoginDto) {
    const user: User = this.usersService.findByEmail(dto.email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isMatch = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');

    const payload = { sub: user.id, email: user.email };
    const token = await this.jwtService.signAsync(payload);

    return { access_token: token };
  }
}
