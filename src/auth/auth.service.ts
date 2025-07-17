import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { User } from '@prisma/client';
import { MailService } from '../mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  private generateVerificationCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async register(dto: RegisterDto): Promise<{ access_token: string }> {
    try {
      const existingUser: User | null = await this.usersService.findByEmail(
        dto.email,
      );
      if (existingUser) throw new UnauthorizedException('Usuário já existe!');

      const hashedPassword = await bcrypt.hash(dto.password, 10);

      const user: User | null = await this.usersService.create({
        name: dto.name,
        email: dto.email,
        password: hashedPassword,
        birthDate: new Date(dto.birthDate),
      });

      if (!user) throw new UnauthorizedException('Erro ao criar usuário');

      //TODO: fazer verificação de email
      // const code = this.generateVerificationCode();
      // await this.mailService.sendVerificationEmail(user.email, code, user.name);

      const payload = { id: user.id };
      const token = await this.jwtService.signAsync(payload);

      return { access_token: token };
    } catch (error) {
      console.error('Error during registration:', error);
      throw new UnauthorizedException('Erro ao registrar usuário');
    }
  }

  async login(dto: LoginDto): Promise<{ access_token: string }> {
    try {
      const user: User | null = await this.usersService.findByEmail(dto.email);
      if (!user) throw new UnauthorizedException('Email não encontrado');

      const isValidPassword = await bcrypt.compare(dto.password, user.password);

      if (!isValidPassword) throw new UnauthorizedException('Senha inválida');

      //TODO: fazer verificação de email
      // if (!user.isActive) {
      //   const code = this.generateVerificationCode();
      //   await this.mailService.sendVerificationEmail(
      //     user.email,
      //     code,
      //     user.name,
      //   );
      // }

      const payload = { id: user.id };
      const token = await this.jwtService.signAsync(payload);

      return { access_token: token };
    } catch (err) {
      console.error('Error during login:', err);
      throw new UnauthorizedException('Erro ao fazer login');
    }
  }
}
