import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  UseGuards,
  HttpException,
  HttpStatus,
  Request,
  Param,
  BadRequestException,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Profile } from '@prisma/client';

interface AuthenticatedRequest extends Request {
  user: {
    userId: number;
  };
}

@ApiTags('Profile')
@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('all')
  async getAllProfiles(
    @Request() req: AuthenticatedRequest,
  ): Promise<Profile[]> {
    try {
      const userId: number = req.user.userId;
      const profiles = await this.profileService.getAllProfiles(+userId);

      if (!profiles || profiles.length === 0) {
        throw new HttpException('No profiles found', HttpStatus.NOT_FOUND);
      }

      return profiles;
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
  @Get(':id')
  async getProfile(
    @Request() req: AuthenticatedRequest,
    @Param('id') id: number,
  ): Promise<Profile> {
    try {
      const userId: number = req.user.userId;
      const profile = await this.profileService.getProfile(+userId, +id);

      if (!profile) {
        throw new HttpException('No profile found', HttpStatus.NOT_FOUND);
      }

      return profile;
    } catch (error) {
      console.log(error.message);
      throw new HttpException(
        'Error fetching profile',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('new')
  async createProfile(
    @Request() req: AuthenticatedRequest,
    @Body() body: CreateProfileDto,
  ): Promise<Profile> {
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
  @Patch('update/:id')
  async update(
    @Request() req: AuthenticatedRequest,
    @Body() dto: UpdateProfileDto,
  ): Promise<Profile> {
    const userId: number = req.user.userId;
    const profile = await this.profileService.updateProfile(+userId, dto);

    if (!profile) {
      throw new HttpException('Profile not found', HttpStatus.NOT_FOUND);
    }
    return profile;
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete(':id')
  async remove(
    @Request() req: AuthenticatedRequest,
    @Param('id') id: number,
  ): Promise<Profile> {
    const userId: number = req.user.userId;
    const profile = await this.profileService.removeProfile(+userId, +id);

    if (!profile) {
      throw new HttpException('Profile not found', HttpStatus.NOT_FOUND);
    }

    if (profile.isLastProfile) {
      throw new BadRequestException('Cannot delete the last profile');
    }

    return profile.profile;
  }
}
