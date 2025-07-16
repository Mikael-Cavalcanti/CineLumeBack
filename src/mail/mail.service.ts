import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { VerifyEmailDto } from '../auth/dto/verify-email.dto';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import * as process from 'node:process';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(private readonly usersService: UsersService) {}

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

  verifyEmail(dto: VerifyEmailDto) {
    const user: User = this.usersService.findByEmail(dto.email);

    if (!user) throw new BadRequestException('Usuário não encontrado');
    if (user.isActive) throw new BadRequestException('Usuário já verificado');
    if (user.verificationCode !== dto.code)
      throw new BadRequestException('Código inválido');

    user.isActive = true;
    user.verificationCode = undefined;
  }
}
