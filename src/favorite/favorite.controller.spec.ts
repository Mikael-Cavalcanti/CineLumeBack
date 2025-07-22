import { Test, TestingModule } from '@nestjs/testing';
import { FavoriteController } from './favorite.controller';
import { FavoriteService } from './favorite.service';
import { JwtAuthGuard } from '../../src/auth/jwt-auth.guard';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { DeleteFavoriteDto } from './dto/delete-favorite.dto';
import { Favorite } from '@prisma/client';

// Mock do serviço para não depender da implementação real nos testes do controller
const mockFavoriteService = {
  addFavorite: jest.fn(),
  removeFavorite: jest.fn(),
  listFavoritesByProfile: jest.fn(),
  isFavorite: jest.fn(),
};

// Mock do Guard para não depender da lógica de autenticação
const mockJwtAuthGuard = {
  canActivate: jest.fn(() => true), // Permite que todas as rotas protegidas sejam acessadas nos testes
};

describe('FavoriteController', () => {
  let controller: FavoriteController;
  let service: FavoriteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FavoriteController],
      providers: [
        {
          provide: FavoriteService,
          useValue: mockFavoriteService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue(mockJwtAuthGuard)
      .compile();

    controller = module.get<FavoriteController>(FavoriteController);
    service = module.get<FavoriteService>(FavoriteService);
  });

  // Limpa os mocks após cada teste para garantir que os testes sejam independentes
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Feature: Adicionar um filme aos favoritos', () => {
    it('When addFavorite é chamado, then deve chamar o serviço com os dados corretos e retornar o favorito criado', async () => {
      // Given
      const profileId = 1;
      const videoId = 10;
      const createDto: CreateFavoriteDto = { profileId, videoId };
      const expectedResult: Favorite = {
        id: 1,
        profileId,
        videoId,
        addedAt: new Date(),
      };
      mockFavoriteService.addFavorite.mockResolvedValue(expectedResult);

      // When
      const result = await controller.addFavorite(createDto);

      // Then
      expect(service.addFavorite).toHaveBeenCalledWith(createDto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('Feature: Remover um filme dos favoritos', () => {
    it('When removeFavorite é chamado, then deve chamar o serviço com os dados corretos', async () => {
      // Given
      const profileId = 1;
      const videoId = 10;
      const deleteDto: DeleteFavoriteDto = { profileId, videoId };
      mockFavoriteService.removeFavorite.mockResolvedValue({ success: true });

      // When
      await controller.removeFavorite(deleteDto);

      // Then
      expect(service.removeFavorite).toHaveBeenCalledWith(deleteDto);
    });
  });

  describe('Feature: Listar os filmes favoritos de um perfil', () => {
    it('When listFavorites é chamado com um profileId, then deve retornar a lista de favoritos', async () => {
      // Given
      const profileId = 1;
      const expectedFavorites: Favorite[] = [
        { id: 1, profileId, videoId: 10, addedAt: new Date() },
        { id: 2, profileId, videoId: 12, addedAt: new Date() },
      ];
      mockFavoriteService.listFavoritesByProfile.mockResolvedValue(
        expectedFavorites,
      );

      // When
      const result = await controller.listFavorites(profileId);

      // Then
      expect(service.listFavoritesByProfile).toHaveBeenCalledWith(profileId);
      expect(result).toEqual(expectedFavorites);
    });
  });

  describe('Feature: Verificar se um filme é favorito', () => {
    it('When isFavorite é chamado, then deve retornar um objeto com a propriedade isFavorite como true', async () => {
      // Given
      const profileId = 1;
      const videoId = 10;
      mockFavoriteService.isFavorite.mockResolvedValue(true);

      // When
      const result = await controller.isFavorite(profileId, videoId);

      // Then
      expect(service.isFavorite).toHaveBeenCalledWith(profileId, videoId);
      expect(result).toEqual({ isFavorite: true });
    });

    it('When isFavorite é chamado para um filme não favorito, then deve retornar um objeto com a propriedade isFavorite como false', async () => {
      // Given
      const profileId = 1;
      const videoId = 99; // Vídeo não favorito
      mockFavoriteService.isFavorite.mockResolvedValue(false);

      // When
      const result = await controller.isFavorite(profileId, videoId);

      // Then
      expect(service.isFavorite).toHaveBeenCalledWith(profileId, videoId);
      expect(result).toEqual({ isFavorite: false });
    });
  });
});
