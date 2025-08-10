import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../user/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ResetToken, User } from '@prisma/client';
import { MailService } from '../mail/mail.service';
import { ProfileService } from '../profile/profile.service';
import { PrismaService } from '../prisma/prisma.service';

interface JwtPayload {
  id: number;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
    private readonly prisma: PrismaService,
    private readonly profileService: ProfileService,
  ) {}

  async register(
    dto: RegisterDto,
  ): Promise<{ accessToken: string; expiresAt: Date }> {
    try {
      const existingUser: User | null = await this.usersService.findByEmail(
        dto.email,
      );
      if (existingUser) throw new UnauthorizedException('Usuário já existe!');

      //verify if is minor
      const birthDate = new Date(dto.birthDate);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      const dayDiff = today.getDate() - birthDate.getDate();

      if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
        age--;
      }

      if (age < 18) {
        throw new UnauthorizedException(
          'Usuário menor de idade não pode se registrar',
        );
      }

      const hashedPassword: string = await bcrypt.hash(dto.password, 10);

      const user: User = await this.usersService.create({
        name: dto.name,
        email: dto.email,
        password: hashedPassword,
        birthDate: new Date(dto.birthDate),
      });

      //create profile
      await this.profileService.createProfile({
        name: dto.name,
        userId: user.id,
        isKidProfile: false,
      });

      await this.mailService.sendEmailCode(user);

      const userToken: ResetToken = await this.generateToken(user.id);

      await this.prisma.resetToken.update({
        where: { id: userToken.id },
        data: { used: true },
      });

      return {
        accessToken: userToken.token,
        expiresAt: userToken.expiresAt,
      };
    } catch (error) {
      console.error('Error during registration:', error);
      throw new UnauthorizedException('Erro ao registrar usuário');
    }
  }

  async login(
    dto: LoginDto,
  ): Promise<{ accessToken: string; verified: boolean; expiresAt: Date }> {
    try {
      const user: User | null = await this.usersService.findByEmail(dto.email);
      if (!user) throw new UnauthorizedException('Email não encontrado');

      const isValidPassword = await bcrypt.compare(dto.password, user.password);

      if (!isValidPassword) throw new UnauthorizedException('Senha inválida');

      if (!user.isActive) {
        await this.mailService.sendEmailCode(user);
      }

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

      return {
        accessToken: token.token,
        verified: user.isActive,
        expiresAt: token.expiresAt,
      };
    } catch (err) {
      console.error('Error during login:', err);
      throw new UnauthorizedException('Erro ao fazer login');
    }
  }

  private async generateToken(userId: number): Promise<ResetToken> {
    const expiresAt = 15 * 24 * 60 * 60 * 1000; // 15 days
    const payload = { id: userId } as JwtPayload;
    const jwtToken = this.jwtService.sign(payload, {
      expiresIn: expiresAt,
    });

    return this.prisma.resetToken.create({
      data: {
        userId: userId,
        token: jwtToken,
        expiresAt: new Date(Date.now() + expiresAt),
      },
    });
  }
}
