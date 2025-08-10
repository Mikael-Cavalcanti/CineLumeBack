import { Injectable } from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProfileService {
  constructor(private readonly prisma: PrismaService) {}

  async createProfile(
    dto: CreateProfileDto,
  ): Promise<{ id: number; name: string; userId: number }> {
    try {
      const profile = await this.prisma.profile.create({
        data: {
          userId: dto.userId,
          name: dto.name,
          avatarUrl: dto.avatarUrl,
          isKidsProfile: dto.isKidProfile,
        },
      });
      return { id: profile.id, name: profile.name, userId: profile.userId };
    } catch (error) {
      if (error.code === 'P2002') {
        console.error(`Profile name already exists:`, error);
        throw new Error('Profile name already exists');
      }
      throw new Error('Error creating profile');
    }
  }

  async getAllProfiles(
    userId: number,
  ): Promise<{ id: number; name: string; userId: number }[]> {
    try {
      const profiles = await this.prisma.profile.findMany({
        where: { userId },
      });
      return profiles.map((profile) => ({
        id: profile.id,
        name: profile.name,
        userId: profile.userId,
      }));
    } catch (error) {
      console.error('Error fetching profiles:', error);
      throw new Error('Error fetching profiles');
    }
  }

  async updateProfile(
    id: number,
    dto: UpdateProfileDto,
  ): Promise<{ id: number; name: string; userId: number } | null> {
    try {
      const profile = await this.prisma.profile.update({
        where: { id },
        data: {
          name: dto.name,
          avatarUrl: dto.avatarUrl,
          isKidsProfile: dto.isKidProfile,
        },
      });

      return { id: profile.id, name: profile.name, userId: profile.userId };
    } catch (e) {
      console.error('Error updating profile:', e);
      return null;
    }
  }

  async removeProfile(
    id: number,
  ): Promise<{ id: number; name: string; userId: number } | null> {
    try {
      const profile = await this.prisma.profile.delete({
        where: { id },
      });

      return { id: profile.id, name: profile.name, userId: profile.userId };
    } catch (err) {
      console.error('Error removing profile:', err);
      return null;
    }
  }
}
