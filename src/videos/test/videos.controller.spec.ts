import { Test, TestingModule } from '@nestjs/testing';
import { VideosController } from '../videos.controller';
import { VideosService } from '../videos.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { BaseVideoDto } from '../dto/base-video.dto';
import { Video } from '@prisma/client';
import { Genre } from '@prisma/client';

// Mock do serviço
const mockVideosService = {
  findById: jest.fn(),
  findByTitle: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  updateByTitle: jest.fn(),
  remove: jest.fn(),
};

// Mock do Guard
const mockJwtAuthGuard = {
  canActivate: jest.fn(() => true),
};

describe('VideosController', () => {
  let controller: VideosController;
  let service: VideosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VideosController],
      providers: [
        {
          provide: VideosService,
          useValue: mockVideosService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue(mockJwtAuthGuard)
      .compile();

    controller = module.get<VideosController>(VideosController);
    service = module.get<VideosService>(VideosService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Feature: Buscar Vídeo', () => {
    it('When findVideo é chamado com um ID válido, then deve retornar o vídeo', async () => {
      // Given
      const videoId = 1;
      const mockVideo: Video = {
        id: videoId,
        title: 'Matrix',
        description: 'Um filme de ficção científica',
        releaseYear: 1999,
        duration: 136,
        type: 'action',
        thumbnailUrl: '',
        videoUrl: '',
        ageRating: '16',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockVideosService.findById.mockResolvedValue(mockVideo);

      // When
      const result = await controller.findVideo(videoId);

      // Then
      expect(service.findById).toHaveBeenCalledWith(videoId);
      expect(result).toEqual(mockVideo);
    });

    it('When findVideoByTitle é chamado com um título válido, then deve retornar o vídeo', async () => {
      // Given
      const title = 'Matrix';
      const mockVideo: Video = {
        id: 1,
        title: title,
        description: 'Um filme de ficção científica',
        releaseYear: 1999,
        duration: 136,
        type: 'action',
        thumbnailUrl: '',
        videoUrl: '',
        ageRating: '16',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockVideosService.findByTitle.mockResolvedValue(mockVideo);

      // When
      const result = await controller.findVideoByTitle(title);

      // Then
      expect(service.findByTitle).toHaveBeenCalledWith(title);
      expect(result).toEqual(mockVideo);
    });
  });

  describe('Feature: Criar Vídeo', () => {
    it('When createVideo é chamado com dados válidos, then deve retornar o vídeo criado', async () => {
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
      const createdVideo: Video = {
        id: 1,
        ...dto,
        videoUrl: dto.url,
        createdAt: new Date(),
      };
      mockVideosService.create.mockResolvedValue(createdVideo);

      // When
      const result = await controller.createVideo(dto);

      // Then
      expect(service.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(createdVideo);
    });
  });

  describe('Feature: Atualizar Vídeo', () => {
    it('When updateVideoById é chamado com dados válidos, then deve retornar o vídeo atualizado', async () => {
      // Given
      const videoId = 1;
      const dto: BaseVideoDto = {
        title: 'Matrix Reloaded',
        description: 'A continuação',
        releaseYear: 2003,
        duration: 138,
        type: 'action',
        thumbnailUrl: '',
        url: '',
        ageRating: '16',
      };
      const updatedVideo: Video = {
        id: videoId,
        ...dto,
        videoUrl: dto.url,
        createdAt: new Date(),
      };
      mockVideosService.update.mockResolvedValue(updatedVideo);

      // When
      const result = await controller.updateVideoById(videoId, dto);

      // Then
      expect(service.update).toHaveBeenCalledWith(videoId, dto);
      expect(result).toEqual(updatedVideo);
    });
  });

  describe('Feature: Remover Vídeo', () => {
    it('When remove é chamado com um ID válido, then deve retornar o vídeo removido', async () => {
      // Given
      const videoId = 1;
      const removedVideo: Video = {
        id: videoId,
        title: 'Matrix',
        description: 'Um filme de ficção científica',
        releaseYear: 1999,
        duration: 136,
        type: 'action',
        thumbnailUrl: '',
        videoUrl: '',
        ageRating: '16',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockVideosService.remove.mockResolvedValue(removedVideo);

      // When
      const result = await controller.remove(videoId);

      // Then
      expect(service.remove).toHaveBeenCalledWith(videoId);
      expect(result).toEqual(removedVideo);
    });
  });
});
