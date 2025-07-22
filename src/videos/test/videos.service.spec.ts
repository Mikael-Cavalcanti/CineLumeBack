import { Test, TestingModule } from '@nestjs/testing';
import { VideosService } from '../videos.service';
import { PrismaService } from '../../prisma/prisma.service';
import { BaseVideoDto } from '../dto/base-video.dto';
import { Video } from '@prisma/client';

// Mock do Prisma
const mockPrismaService = {
  video: {
    create: jest.fn(),
    findFirst: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

describe('VideosService', () => {
  let service: VideosService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VideosService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<VideosService>(VideosService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('When um vídeo é criado com sucesso, then deve retornar o novo vídeo', async () => {
      // Given
      const dto: BaseVideoDto = {
        title: 'Matrix',
        description: 'Um filme de ficção científica',
        releaseYear: 1999,
        duration: 136,
        type: 'action',
        thumbnailUrl: '',
        url: '',
        ageRating: '16',
      };
      const expectedVideo: Video = {
        id: 1,
        title: dto.title,
        description: dto.description || null,
        releaseYear: dto.releaseYear || null,
        duration: dto.duration,
        type: dto.type,
        thumbnailUrl: dto.thumbnailUrl || null,
        videoUrl: dto.url,
        ageRating: dto.ageRating || null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockPrismaService.video.create.mockResolvedValue(expectedVideo);

      // When
      const result = await service.create(dto);

      // Then
      expect(prisma.video.create).toHaveBeenCalledWith({
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
      expect(result).toEqual(expectedVideo);
    });
  });

  describe('findById', () => {
    it('When um vídeo é buscado por um ID existente, then deve retornar o vídeo', async () => {
      // Given
      const videoId = 1;
      const expectedVideo: Video = {
        id: videoId,
        title: 'Matrix',
        description: 'Um filme de ficção científica',
        releaseYear: 1999,
        duration: 136,
        type: "action",
        thumbnailUrl: '',
        videoUrl: '',
        ageRating: "16",
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockPrismaService.video.findFirst.mockResolvedValue(expectedVideo);

      // When
      const result = await service.findById(videoId);

      // Then
      expect(prisma.video.findFirst).toHaveBeenCalledWith({ where: { id: videoId } });
      expect(result).toEqual(expectedVideo);
    });
  });

  describe('update', () => {
    it('When um vídeo é atualizado com sucesso, then deve retornar o vídeo com os novos dados', async () => {
      // Given
      const videoId = 1;
      const dto: BaseVideoDto = {
        title: 'Matrix Reloaded',
        description: 'A continuação',
        releaseYear: 2003,
        duration: 138,
        type: "action",
        thumbnailUrl: '',
        url: '',
        ageRating: "16",
      };
      const expectedVideo: Video = {
        id: videoId,
        title: 'Matrix Reloaded',
        description: 'A continuação',
        releaseYear: 2003,
        duration: 138,
        type: "action",
        thumbnailUrl: '',
        videoUrl: '',
        ageRating: "16",
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockPrismaService.video.update.mockResolvedValue(expectedVideo);

      // When
      const result = await service.update(videoId, dto);

      // Then
      expect(prisma.video.update).toHaveBeenCalledWith({
        where: { id: videoId },
        data: {
          title: dto.title,
          description: dto.description,
          releaseYear: dto.releaseYear,
          duration: dto.duration,
          type: dto.type,
          thumbnailUrl: dto.thumbnailUrl,
        },
      });
      expect(result).toEqual(expectedVideo);
    });
  });

  describe('remove', () => {
    it('When um vídeo é removido com sucesso, then deve retornar o vídeo removido', async () => {
      // Given
      const videoId = 1;
      const expectedVideo: Video = {
        id: videoId,
        title: 'Matrix',
        description: 'Um filme de ficção científica',
        releaseYear: 1999,
        duration: 136,
        type: "action",
        thumbnailUrl: '',
        videoUrl: '',
        ageRating: "16",
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockPrismaService.video.delete.mockResolvedValue(expectedVideo);

      // When
      const result = await service.remove(videoId);

      // Then
      expect(prisma.video.delete).toHaveBeenCalledWith({ where: { id: videoId } });
      expect(result).toEqual(expectedVideo);
    });
  });
});
