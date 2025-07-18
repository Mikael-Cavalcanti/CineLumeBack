import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('User')
@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get(':id')
  async findOne(@Param('id') id: number) {
    return await this.usersService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch('Update/:id')
  async update(@Param('id') id: number, @Body() dto: UpdateUserDto) {
    return await this.usersService.update(+id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete(':id')
  async remove(@Param('id') id: number) {
    return await this.usersService.remove(+id);
  }
}
