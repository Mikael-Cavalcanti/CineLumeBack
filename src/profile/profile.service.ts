import { Injectable } from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { PrismaService } from '../prisma/prisma.service';
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

  async getProfile(userId: number, id: number): Promise<Profile | null> {
    try {
      return await this.prisma.profile.findUnique({
        where: {
          id,
          userId,
        },
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
  }

  async getAllProfiles(userId: number): Promise<Profile[] | null> {
    try {
      return await this.prisma.profile.findMany({
        where: { userId },
      });
    } catch (error) {
      console.error('Error fetching profiles:', error);
      return null;
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

  async removeProfile(
    userId: number,
    id: number,
  ): Promise<{
    profile: Profile;
    isLastProfile: boolean;
  } | null> {
    try {
      const profileAmount = await this.prisma.profile.count({
        where: { userId },
      });

      if (profileAmount <= 1) {
        console.error('Cannot delete the last profile for a user');
        const lastProfile: Profile | null =
          await this.prisma.profile.findUnique({
            where: { id },
          });

        if (!lastProfile) {
          console.error('Profile not found');
          return null;
        }

        return {
          profile: lastProfile,
          isLastProfile: true,
        };
      }

      const profile: Profile = await this.prisma.profile.delete({
        where: { id },
      });

      return {
        profile,
        isLastProfile: false,
      };
    } catch (err) {
      console.error('Error removing profile:', err);
      return null;
    }
  }
}
