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

interface AuthenticatedRequest extends Request {
  user: {
    userId: number;
  };
}

@ApiTags('User')
@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get()
  async findOne(@Request() req: AuthenticatedRequest) {
    const userId = req.user.userId;

    const user: User | null = await this.usersService.findOne(userId);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch('update')
  @UsePipes(
    new ValidationPipe({
      transform: true,
      skipMissingProperties: true,
    }),
  )
  async update(
    @Request() req: AuthenticatedRequest,
    @Body() dto: UpdateUserDto,
  ) {
    const userId = req.user.userId;

    const user: User | null = await this.usersService.update(userId, dto);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete()
  async remove(@Request() req: AuthenticatedRequest) {
    const userId = req.user.userId;

    const user: User | null = await this.usersService.remove(userId);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return user;
  }
}
