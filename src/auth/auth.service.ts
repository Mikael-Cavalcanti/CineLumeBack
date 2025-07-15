import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { User } from '../users/entities/user.entity';
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

  async register(dto: RegisterDto) {
    const existingUser = this.usersService.findByEmail(dto.email);
    if (existingUser) throw new UnauthorizedException('Usuário já existe!');

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const code = this.generateVerificationCode();

    const user: User = this.usersService.create({
      name: dto.name,
      email: dto.email,
      password: hashedPassword,
      birthDate: new Date(dto.birthDate),
      verificationCode: code,
      isActive: false,
    });

    await this.mailService.sendVerificationEmail(
      'mikaelcavalcanti@outlook.com',
      code,
      user.name,
    );

    return { message: 'Usuário registrado com sucesso!', user };
  }

  async login(dto: LoginDto) {
    const user: User = this.usersService.findByEmail(dto.email);

    if (!user.isActive) {
      let code: string;
      if (user.verificationCode == undefined) {
        code = user.verificationCode = this.generateVerificationCode();
      } else code = user.verificationCode;

      await this.mailService.sendVerificationEmail(user.email, code, user.name);
    }

    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isValidPassword = await bcrypt.compare(
      dto.password,
      user.passwordHash,
    );

    if (!isValidPassword)
      throw new UnauthorizedException('Invalid credentials');

    const payload = { sub: user.id, email: user.email };
    const token = await this.jwtService.signAsync(payload);

    return { access_token: token };
  }
}
