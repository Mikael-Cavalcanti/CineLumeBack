import { Test, TestingModule } from '@nestjs/testing';
import { ProfileController } from '../profile.controller';
import { ProfileService } from '../profile.service';
import { JwtAuthGuard } from '../../../src/auth/jwt-auth.guard';
import { CreateProfileDto } from '../dto/create-profile.dto';
import { UpdateProfileDto } from '../dto/update-profile.dto';
import { HttpException, HttpStatus } from '@nestjs/common';

// Mock do serviço
const mockProfileService = {
  getAllProfiles: jest.fn(),
  createProfile: jest.fn(),
  updateProfile: jest.fn(),
  removeProfile: jest.fn(),
};

// Mock do Guard
const mockJwtAuthGuard = {
  canActivate: jest.fn(() => true),
};

describe('ProfileController', () => {
  let controller: ProfileController;
  let service: ProfileService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProfileController],
      providers: [
        {
          provide: ProfileService,
          useValue: mockProfileService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue(mockJwtAuthGuard)
      .compile();

    controller = module.get<ProfileController>(ProfileController);
    service = module.get<ProfileService>(ProfileService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Feature: Listar Perfis', () => {
    it('When getAllProfiles é chamado, then deve retornar uma lista de perfis', async () => {
      // Given
      const mockProfiles = [{ id: 1, name: 'Adulto 1' }];
      mockProfileService.getAllProfiles.mockResolvedValue(mockProfiles);

      // When
      const result = await controller.getAllProfiles();

      // Then
      expect(service.getAllProfiles).toHaveBeenCalled();
      expect(result).toEqual({ success: true, data: mockProfiles });
    });
  });

  describe('Feature: Criar Perfil', () => {
    it('When createProfile é chamado com dados válidos, then deve retornar o perfil criado', async () => {
      // Given
      const createDto: CreateProfileDto = {
        userId: 1,
        name: 'Adulto 1',
        avatarUrl: 'url',
        isKidProfile: false,
      };
      const createdProfile = { id: 1, ...createDto };
      mockProfileService.createProfile.mockResolvedValue(createdProfile);

      // When
      const result = await controller.createProfile(createDto);

      // Then
      expect(service.createProfile).toHaveBeenCalledWith(createDto);
      expect(result).toEqual({ success: true, data: createdProfile });
    });
  });

  describe('Feature: Atualizar Perfil', () => {
    it('When update é chamado com dados válidos, then deve retornar o perfil atualizado', async () => {
      // Given
      const profileId = 1;
      const updateDto: UpdateProfileDto = {
        name: 'Novo Nome',
        isKidProfile: false,
      };
      const updatedProfile = { id: profileId, ...updateDto };
      mockProfileService.updateProfile.mockResolvedValue(updatedProfile);

      // When
      const result = await controller.update(profileId, updateDto);

      // Then
      expect(service.updateProfile).toHaveBeenCalledWith(profileId, updateDto);
      expect(result).toEqual(updatedProfile);
    });

    it('When update é chamado para um perfil inexistente, then deve lançar HttpException', async () => {
      // Given
      const profileId = 999;
      const updateDto: UpdateProfileDto = {
        name: 'Novo Nome',
        isKidProfile: false,
      };
      mockProfileService.updateProfile.mockResolvedValue(null);

      // When & Then
      await expect(controller.update(profileId, updateDto)).rejects.toThrow(
        new HttpException('Profile not found', HttpStatus.NOT_FOUND),
      );
    });
  });

  describe('Feature: Remover Perfil', () => {
    it('When remove é chamado com um ID válido, then deve retornar o perfil removido', async () => {
      // Given
      const profileId = 1;
      const removedProfile = { id: profileId, name: 'Perfil Removido' };
      mockProfileService.removeProfile.mockResolvedValue(removedProfile);

      // When
      const result = await controller.remove(profileId);

      // Then
      expect(service.removeProfile).toHaveBeenCalledWith(profileId);
      expect(result).toEqual(removedProfile);
    });

    it('When remove é chamado para um perfil inexistente, then deve lançar HttpException', async () => {
      // Given
      const profileId = 999;
      mockProfileService.removeProfile.mockResolvedValue(null);

      // When & Then
      await expect(controller.remove(profileId)).rejects.toThrow(
        new HttpException('Profile not found', HttpStatus.NOT_FOUND),
      );
    });
  });
});
