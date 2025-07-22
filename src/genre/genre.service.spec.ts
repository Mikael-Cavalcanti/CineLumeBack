import { Test, TestingModule } from '@nestjs/testing';
import { GenreService } from './genre.service';
import { PrismaService } from '../../src/prisma/prisma.service';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';

// Mock do PrismaService para simular o comportamento do banco de dados
const mockPrismaService = {
  genre: {
    findUnique: jest.fn(),
    create: jest.fn(),
    findMany: jest.fn(),
  },
  videoGenre: {
    create: jest.fn(),
    deleteMany: jest.fn(),
  },
};

describe('GenreService', () => {
  let service: GenreService;
  let prisma: typeof mockPrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GenreService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<GenreService>(GenreService);
    prisma = module.get(PrismaService);
    jest.clearAllMocks(); // Limpa os mocks antes de cada teste
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createGenre', () => {
    it('deve criar um novo gênero com sucesso', async () => {
      const dto = { name: 'Ação' };
      const expectedGenre = { id: 1, name: 'Ação' };

      prisma.genre.findUnique.mockResolvedValue(null);
      prisma.genre.create.mockResolvedValue(expectedGenre);

      const result = await service.createGenre(dto);
      expect(result).toEqual(expectedGenre);
      expect(prisma.genre.findUnique).toHaveBeenCalledWith({ where: { name: 'Ação' } });
      expect(prisma.genre.create).toHaveBeenCalledWith({ data: dto });
    });

    it('deve lançar ConflictException se o gênero já existir', async () => {
      const dto = { name: 'Ficção' };
      prisma.genre.findUnique.mockResolvedValue({ id: 1, name: 'Ficção' });

      await expect(service.createGenre(dto)).rejects.toThrow(
        new ConflictException(`O gênero '${dto.name}' já existe.`),
      );
    });
  });

  describe('getVideosByGenre', () => {
    it('deve retornar os vídeos de um gênero', async () => {
      const genreId = 1;
      const mockGenreWithVideos = {
        id: genreId,
        name: 'Ficção',
        videos: [{ video: { id: 101, title: 'Interestelar' } }],
      };

      prisma.genre.findUnique.mockResolvedValue(mockGenreWithVideos);

      const result = await service.getVideosByGenre(genreId);
      expect(result.genre).toBe('Ficção');
      expect(result.videos.length).toBe(1);
      expect(result.videos[0].title).toBe('Interestelar');
    });

    it('deve lançar NotFoundException se o gênero não for encontrado', async () => {
      const genreId = 999;
      prisma.genre.findUnique.mockResolvedValue(null);

      await expect(service.getVideosByGenre(genreId)).rejects.toThrow(
        new NotFoundException(`Gênero com id ${genreId} não encontrado.`),
      );
    });
  });

  describe('addGenreToVideo', () => {
    it('deve associar um gênero a um vídeo com sucesso', async () => {
        const videoId = 101;
        const genreId = 1;
        const expectedRelation = { id: 1, videoId, genreId };

        prisma.videoGenre.create.mockResolvedValue(expectedRelation);

        const result = await service.addGenreToVideo(videoId, genreId);
        expect(result).toEqual(expectedRelation);
    });

    it('deve lançar NotFoundException se o vídeo ou gênero não existir', async () => {
        const videoId = 999;
        const genreId = 1;
        // Simula o erro de chave estrangeira do Prisma
        const prismaError = new Prisma.PrismaClientKnownRequestError(
            'Foreign key constraint failed',
            { code: 'P2003', clientVersion: 'x.x.x' }
        );
        prisma.videoGenre.create.mockRejectedValue(prismaError);

        await expect(service.addGenreToVideo(videoId, genreId)).rejects.toThrow(
            new NotFoundException(`Vídeo com id ${videoId} ou Gênero com id ${genreId} não encontrado.`)
        );
    });
  });

  describe('removeGenreFromVideo', () => {
    it('deve remover a associação com sucesso', async () => {
        const videoId = 101;
        const genreId = 1;
        prisma.videoGenre.deleteMany.mockResolvedValue({ count: 1 });

        await expect(service.removeGenreFromVideo(videoId, genreId)).resolves.toBeUndefined();
    });

    it('deve lançar NotFoundException se a associação não existir', async () => {
        const videoId = 101;
        const genreId = 1;
        prisma.videoGenre.deleteMany.mockResolvedValue({ count: 0 });

        await expect(service.removeGenreFromVideo(videoId, genreId)).rejects.toThrow(
            new NotFoundException(`Associação entre vídeo ${videoId} e gênero ${genreId} não encontrada.`)
        );
    });
  });
});
