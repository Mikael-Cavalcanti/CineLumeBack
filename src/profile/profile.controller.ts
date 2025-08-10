import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Patch,
  Delete,
  UseGuards,
  HttpException,
  HttpStatus,
  Request,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

interface AuthenticatedRequest extends Request {
  user: {
    userId: number;
  };
}

@ApiTags('Profiles')
@Controller('profiles')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get()
  async getAllProfiles(@Request() req: AuthenticatedRequest) {
    try {
      const userId = req.user.userId;
      return await this.profileService.getAllProfiles(userId);
    } catch (error) {
      console.log(error.message);
      throw new HttpException(
        'Error fetching profiles',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post()
  async createProfile(
    @Request() req: AuthenticatedRequest,
    @Body() body: CreateProfileDto,
  ) {
    try {
      const userId = req.user.userId;
      const profileData = { ...body, userId };
      return await this.profileService.createProfile(profileData);
    } catch (error) {
      console.log(error.message);
      throw new HttpException(
        'Error creating profile',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch('Update/:id')
  async update(@Param('id') id: number, @Body() dto: UpdateProfileDto) {
    const profile = await this.profileService.updateProfile(+id, dto);
    if (!profile) {
      throw new HttpException('Profile not found', HttpStatus.NOT_FOUND);
    }
    return;
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete(':id')
  async remove(@Param('id') id: number) {
    const profile = await this.profileService.removeProfile(+id);
    if (!profile) {
      throw new HttpException('Profile not found', HttpStatus.NOT_FOUND);
    }
    return;
  }
}
