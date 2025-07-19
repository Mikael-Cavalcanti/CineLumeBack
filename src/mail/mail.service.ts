import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { VerifyEmailDto } from '../auth/dto/verify-email.dto';
import { UsersService } from '../user/users.service';
import * as process from 'node:process';
import { ActivationCode, User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly prisma: PrismaService,
  ) {}

  private async generateVerificationCode(
    userId: number,
  ): Promise<ActivationCode> {
    const code = Math.floor(100000 + Math.random() * 999999).toString();

    return this.prisma.activationCode.create({
      data: {
        userId,
        code,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
      },
    });
  }

  private transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  async sendEmailCode(user: User): Promise<void> {
    try {
      let code: ActivationCode | null =
        await this.prisma.activationCode.findFirst({
          where: {
            userId: user.id,
            used: false,
            expiresAt: {
              gt: new Date(Date.now()),
            },
          },
        });

      if (code) {
        throw new BadRequestException(
          `Código ${code.code} de verificação já enviado recentemente, expira em ${code.expiresAt.toLocaleString(
            'pt-BR',
            {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
            },
          )}.`,
        );
      }

      code = await this.generateVerificationCode(user.id);

      await this.transporter.sendMail({
        from: `"CineLume" <${process.env.EMAIL_USER}>`,
        to: user.email,
        subject: 'Confirmação de cadastro',
        html: `
          <h2>Olá${user.name ? ', ' + user.name : ''}!</h2>
          <p>Obrigado por assinar o CineLume.</p>
          <p>Seu código de verificação é:</p>
          <h1>${code.code}</h1>
          <p>Insira este código no app para confirmar seu cadastro. E não precisa responder este email</p>
          <p>Se não foi você, ignore este e-mail.</p>
        `,
      });
    } catch (error) {
      this.logger.error('Erro ao enviar e-mail', error);
      throw new BadRequestException(error);
    }
  }

  async reSendEmailCode(email: string): Promise<void> {
    try {
      const user: User | null = await this.usersService.findByEmail(email);
      if (!user) throw new BadRequestException('Usuário não encontrado');

      if (user.isActive)
        throw new BadRequestException('Usuário com email verificado');

      await this.sendEmailCode(user);
    } catch (error) {
      this.logger.error('Erro ao reenviar e-mail', error);
      throw new BadRequestException(error);
    }
  }

  async verifyEmailCode(
    dto: VerifyEmailDto,
  ): Promise<{ isVerified: boolean; message: string }> {
    try {
      const user: User | null = await this.usersService.findByEmail(dto.email);

      if (!user) throw new BadRequestException('Usuário não encontrado');
      if (user.isActive) throw new BadRequestException('Usuário já verificado');

      const code = await this.prisma.activationCode.findFirst({
        where: {
          userId: user.id,
          used: false,
          expiresAt: {
            gt: new Date(Date.now()),
          },
        },
      });

      if (!code) {
        throw new BadRequestException(
          'Código de verificação expirado ou inválido. Por favor, solicite um novo código.',
        );
      }

      if (dto.code !== code.code)
        throw new BadRequestException('Código incorreto ou não encontrado');

      await this.prisma.user.update({
        where: { id: user.id },
        data: { isActive: true },
      });

      await this.prisma.activationCode.update({
        where: { id: code.id },
        data: { used: true },
      });

      return { isVerified: true, message: 'E-mail verificado com sucesso.' };
    } catch (err) {
      this.logger.error('Erro ao verificar e-mail', err);
      throw new BadRequestException(err);
    }
  }
}
