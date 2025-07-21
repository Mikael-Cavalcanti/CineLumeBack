import { Controller, Get, Param, Post, Body, Delete, UseGuards } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { AssignProfileDto } from './dto/assign-profile.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateProfileDto } from './dto/create-profile.dto';

@ApiTags('Profiles')
@Controller('profiles')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) { }

  //@UseGuards(JwtAuthGuard)
  //@ApiBearerAuth()
  @Get()
  async getAllProfiles() {
    try {
      const profiles = await this.profileService.getAllProfiles();
      return { success: true, data: profiles };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
  
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post()
  async createProfile(@Body() body: CreateProfileDto) {
    try {
      const profile = await this.profileService.createProfile(body);
      return { success: true, data: profile };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
}
