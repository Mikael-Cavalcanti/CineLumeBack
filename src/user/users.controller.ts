import {
  Controller,
  Get,
  Body,
  Patch,
  Delete,
  UseGuards,
  HttpException,
  HttpStatus,
  Request,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User } from '@prisma/client';
import { MailService } from '../mail/mail.service';
import { GenericMailDto } from '../mail/dto/generic.mail.dto';

interface AuthenticatedRequest extends Request {
  user: {
    userId: number;
  };
}

@ApiTags('User')
@Controller('user')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly mailService: MailService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('me')
  async findOne(@Request() req: AuthenticatedRequest): Promise<User> {
    const userId = req.user.userId;

    const user: User | null = await this.usersService.findOne(userId);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch('update/me')
  @UsePipes(
    new ValidationPipe({
      transform: true,
      skipMissingProperties: true,
    }),
  )
  async update(
    @Request() req: AuthenticatedRequest,
    @Body() dto: UpdateUserDto,
  ): Promise<User> {
    const userId = req.user.userId;

    const user: User | null = await this.usersService.update(userId, dto);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete('delete/me')
  async remove(@Request() req: AuthenticatedRequest): Promise<User> {
    const userId = req.user.userId;

    const user: User | null = await this.usersService.remove(userId);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    await this.mailService.sendMessageToEmail({
      email: user.email,
      subject: 'Confirmação de exclusão de conta',
      message: `Olá ${user.name} sua conta com email ${user.email} foi deletada com sucesso!.`,
    });
    return user;
  }
}
