import { Test, TestingModule } from '@nestjs/testing';
import { GenreController } from '../genre.controller';
import { GenreService } from '../genre.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

// Mock do GenreService
const mockGenreService = {
  createGenre: jest.fn(),
  getAllGenres: jest.fn(),
  getVideosByGenre: jest.fn(),
  addGenreToVideo: jest.fn(),
  removeGenreFromVideo: jest.fn(),
};

describe('GenreController', () => {
  let controller: GenreController;
  let service: typeof mockGenreService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GenreController],
      providers: [
        {
          provide: GenreService,
          useValue: mockGenreService,
        },
      ],
    })
    // Simula a desativação do guard para testes unitários
    .overrideGuard(JwtAuthGuard)
    .useValue({ canActivate: () => true })
    .compile();

    controller = module.get<GenreController>(GenreController);
    service = module.get(GenreService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createGenre', () => {
    it('deve chamar o service.createGenre e retornar o resultado', async () => {
      const dto = { name: 'Aventura' };
      const expectedResult = { id: 1, ...dto };
      service.createGenre.mockResolvedValue(expectedResult);

      const result = await controller.createGenre(dto);

      expect(result).toEqual(expectedResult);
      expect(service.createGenre).toHaveBeenCalledWith(dto);
    });
  });

  describe('getAllGenres', () => {
    it('deve chamar o service.getAllGenres e retornar uma lista de gêneros', async () => {
      const expectedResult = [{ id: 1, name: 'Ficção' }];
      service.getAllGenres.mockResolvedValue(expectedResult);

      const result = await controller.getAllGenres();

      expect(result).toEqual(expectedResult);
      expect(service.getAllGenres).toHaveBeenCalled();
    });
  });

  describe('getVideosByGenre', () => {
    it('deve chamar o service.getVideosByGenre com o ID correto', async () => {
      const genreId = '1';
      const expectedResult = { genre: 'Ficção', videos: [] };
      service.getVideosByGenre.mockResolvedValue(expectedResult);

      const result = await controller.getVideosByGenre(genreId);

      expect(result).toEqual(expectedResult);
      expect(service.getVideosByGenre).toHaveBeenCalledWith(genreId);
    });
  });

  describe('assignGenre', () => {
    it('deve chamar o service.addGenreToVideo com os dados corretos', async () => {
      const dto = { videoId: 101, genreId: 1 };
      const expectedResult = { id: 1, ...dto };
      service.addGenreToVideo.mockResolvedValue(expectedResult);

      const result = await controller.assignGenre(dto);

      expect(result).toEqual(expectedResult);
      expect(service.addGenreToVideo).toHaveBeenCalledWith(dto.videoId, dto.genreId);
    });
  });

  describe('removeGenre', () => {
    it('deve chamar o service.removeGenreFromVideo', async () => {
      const dto = { videoId: 101, genreId: 1 };
      service.removeGenreFromVideo.mockResolvedValue(undefined); // Retorna void

      await controller.removeGenre(dto);

      expect(service.removeGenreFromVideo).toHaveBeenCalledWith(dto.videoId, dto.genreId);
    });
  });
});
