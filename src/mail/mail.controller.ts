import { Body, Param, Controller, Post } from '@nestjs/common';
import { VerifyEmailDto } from '../auth/dto/verify-email.dto';
import { ApiTags } from '@nestjs/swagger';
import { MailService } from './mail.service';

@ApiTags('Mail')
@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post('verify-email')
  async verifyEmail(@Body() dto: VerifyEmailDto) {
    await this.mailService.verifyEmailCode(dto);
    return { message: 'E-mail confirmado com sucesso.' };
  }

  @Post('resend-email/:email')
  async resendEmail(@Param('email') email: string) {
    await this.mailService.reSendEmailCode(email);
    return { message: 'Código de verificação reenviado com sucesso.' };
  }
}
