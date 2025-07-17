import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../user/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ResetToken, User } from '@prisma/client';
import { MailService } from '../mail/mail.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
    private readonly prisma: PrismaService,
  ) {}

  async register(dto: RegisterDto): Promise<{ accessToken: string }> {
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

      const userToken: ResetToken = await this.generateToken(user.id);

      await this.prisma.resetToken.update({
        where: { id: userToken.id },
        data: { used: true },
      });

      return { accessToken: userToken.token };
    } catch (error) {
      console.error('Error during registration:', error);
      throw new UnauthorizedException('Erro ao registrar usuário');
    }
  }

  async login(dto: LoginDto): Promise<{ accessToken: string }> {
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

      let token: ResetToken | null = await this.prisma.resetToken.findFirst({
        where: {
          userId: user.id,
          expiresAt: {
            gt: new Date(Date.now()),
          },
        },
        orderBy: {
          expiresAt: 'desc',
        },
      });

      if (!token) {
        token = await this.generateToken(user.id);
      }

      if (!token.used) {
        token = await this.prisma.resetToken.update({
          where: {
            id: token.id,
          },
          data: {
            used: true,
          },
        });
      }

      return { accessToken: token.token };
    } catch (err) {
      console.error('Error during login:', err);
      throw new UnauthorizedException('Erro ao fazer login');
    }
  }

  private async generateToken(userId: number): Promise<ResetToken> {
    const payload = { id: userId };
    const jwtToken = this.jwtService.sign(payload);
    return this.prisma.resetToken.create({
      data: {
        userId: userId,
        token: jwtToken,
        expiresAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      },
    });
  }
}
