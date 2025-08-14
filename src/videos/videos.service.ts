import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BaseVideoDto } from './dto/base-video.dto';
import { Video } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class VideosService {
  constructor(private readonly prisma: PrismaService) { }

  async create(dto: BaseVideoDto): Promise<Video> {
    try {
      return await this.prisma.video.create({
        data: {
          title: dto.title,
          description: dto.description,
          releaseYear: dto.releaseYear,
          duration: dto.duration,
          type: dto.type,
          thumbnailUrl: dto.thumbnailUrl,
          videoUrl: dto.url,
          ageRating: dto.ageRating,
        },
      });
    } catch (err) {
      console.error('Error creating video:', err);
      throw new Error('Error creating video');
    }
  }

  async update(id: number, dto: BaseVideoDto): Promise<Video | null> {
    try {
      return await this.prisma.video.update({
        where: { id: id },
        data: {
          title: dto.title,
          description: dto.description,
          releaseYear: dto.releaseYear,
          duration: dto.duration,
          type: dto.type,
          thumbnailUrl: dto.thumbnailUrl,
          ageRating: dto.ageRating,
          videoUrl: dto.url,
        },
      });
    } catch (err) {
      console.error('Error updating video', err);
      return null;
    }
  }

  async updateByTitle(title: string, dto: BaseVideoDto): Promise<Video | null> {
    try {
      const video: Video | null = await this.findByTitle(title);
      if (!video) {
        console.error('Video not found for title:', title);
        return null;
      }
      return await this.update(video.id, dto);
    } catch (err) {
      console.error('Error updating video by title', err);
      return null;
    }
  }

  async findByTitle(title: string): Promise<Video | null> {
    try {
      return await this.prisma.video.findFirst({
        where: { title: title },
      });
    } catch (err) {
      console.error('Error finding video by title', err);
      return null;
    }
  }

  async findById(id: number): Promise<Video | null> {
    try {
      return await this.prisma.video.findFirst({
        where: { id: id },
      });
    } catch (err) {
      console.error('Error finding video by id', err);
      return null;
    }
  }

  async remove(id: number): Promise<Video | null> {
    try {
      return await this.prisma.video.delete({
        where: { id: id },
      });
    } catch (err) {
      console.error('Error deleting video', err);
      return null;
    }
  }

  async getVideoStream(videoId: string, rangeHeader?: string): Promise<any | null> {
    const caminhoFilme = path.join(__dirname, '..', '..', 'videos', `${videoId}.mp4`);

    if (!fs.existsSync(caminhoFilme)) {
      throw new NotFoundException('Filme não encontrado');
    }

    const stat = fs.statSync(caminhoFilme);
    const fileSize = stat.size;

    if (!rangeHeader) {
      return { file: fs.createReadStream(caminhoFilme), fileSize, start: 0, end: fileSize - 1, partial: false };
    }

    const partes = rangeHeader.replace(/bytes=/, '').split('-');
    const start = parseInt(partes[0], 10);
    const end = partes[1] ? parseInt(partes[1], 10) : fileSize - 1;
    const chunkSize = end - start + 1;

    return {
      file: fs.createReadStream(caminhoFilme, { start, end }),
      fileSize,
      start,
      end,
      chunkSize,
      partial: true,
    };
  }

  async saveProgress(profileId: number, videoId: number, tempoAssistido: number): Promise<any | null> {
    return this.prisma.profileVideoWatchtime.upsert({
      where: { profileId_videoId: { profileId, videoId } },
      update: { totalWatch: tempoAssistido },
      create: { profileId, videoId, totalWatch: tempoAssistido },
    });
  }

  async getProgresso(profileId: number, videoId: number): Promise<any | null> {
    const registro = await this.prisma.profileVideoWatchtime.findUnique({
      where: { profileId_videoId: { profileId, videoId } },
    });
    return registro || { totalWatch: 0 };
  }
}
