import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { VerifyEmailDto } from '../auth/dto/verify-email.dto';
import { UsersService } from '../user/users.service';
import * as process from 'node:process';
import { User } from '@prisma/client';
import { ActivationCode } from '@prisma/client';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(private readonly usersService: UsersService) {}

  private generateVerificationCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  private transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  async sendVerificationEmail(to: string, code: string, userName?: string) {
    try {
      await this.transporter.sendMail({
        from: `"CineLume" <${process.env.EMAIL_USER}>`,
        to,
        subject: 'Confirmação de cadastro',
        html: `
          <h2>Olá${userName ? ', ' + userName : ''}!</h2>
          <p>Obrigado por se cadastrar no nosso sistema.</p>
          <p>Seu código de verificação é:</p>
          <h1>${code}</h1>
          <p>Insira este código no app para confirmar seu cadastro. E não precisa responder este email</p>
          <p>Se não foi você, ignore este e-mail.</p>
        `,
      });
    } catch (error) {
      this.logger.error('Erro ao enviar e-mail', error);
      throw new BadRequestException('Não foi possível enviar o e-mail.');
    }
  }

  async verifyEmail(dto: VerifyEmailDto) {
    try {
      const user: User | null = await this.usersService.findByEmail(dto.email);

      if (!user) throw new BadRequestException('Usuário não encontrado');
      if (user.isActive) throw new BadRequestException('Usuário já verificado');
      // if (user.verificationCode !== dto.code)
      //   throw new BadRequestException('Código inválido');

      user.isActive = true;
    } catch (e) {
      this.logger.error('Erro ao verificar e-mail', e);
      throw new BadRequestException('Não foi possível verificar o e-mail.');
    }
  }
}
