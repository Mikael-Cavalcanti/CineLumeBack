import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Profile } from '@prisma/client';

@Injectable()
export class ProfileService {
  constructor(private readonly prisma: PrismaService) {}

  async createProfile(dto: CreateProfileDto): Promise<Profile> {
    try {
      return await this.prisma.profile.create({
        data: {
          userId: dto.userId,
          name: dto.name,
          avatarUrl: dto.avatarUrl,
          isKidsProfile: dto.isKidProfile,
        },
      });
    } catch (error) {
      if (error.code === 'P2002') {
        console.error(`Profile name already exists:`, error);
        throw new Error('Profile name already exists');
      }
      throw new Error('Error creating profile');
    }
  }

  async getAllProfiles(): Promise<Profile[]> {
    try {
      return await this.prisma.profile.findMany({});
    } catch (error) {
      console.error('Error fetching profiles:', error);
      throw new Error('Error fetching profiles');
    }
  }

  async updateProfile(
    id: number,
    dto: UpdateProfileDto,
  ): Promise<Profile | null> {
    try {
      return await this.prisma.profile.update({
        where: { id },
        data: {
          name: dto.name,
          avatarUrl: dto.avatarUrl,
          isKidsProfile: dto.isKidProfile,
        },
      });
    } catch (e) {
      console.error('Error updating profile:', e);
      return null;
    }
  }

  async removeProfile(id: number): Promise<Profile | null> {
    try {
      return await this.prisma.profile.delete({
        where: { id },
      });
    } catch (err) {
      console.error('Error removing profile:', err);
      return null;
    }
  }
}
