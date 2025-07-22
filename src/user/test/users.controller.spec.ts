import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../users.controller';
import { UsersService } from '../users.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { UpdateUserDto } from '../dto/update-user.dto';
import { User } from '@prisma/client';
import { HttpException, HttpStatus } from '@nestjs/common';

// Mock do serviço
const mockUsersService = {
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

// Mock do Guard
const mockJwtAuthGuard = {
  canActivate: jest.fn(() => true),
};

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue(mockJwtAuthGuard)
      .compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Feature: Buscar Usuário', () => {
    it('When findOne é chamado com um ID válido, then deve retornar o usuário', async () => {
      // Given
      const userId = 1;
      const mockUser: User = {
        id: userId,
        name: 'João Silva',
        email: 'joao@email.com',
        password: '123',
        isActive: true,
        birthDate: new Date(),
        createdAt: new Date(),
      };
      mockUsersService.findOne.mockResolvedValue(mockUser);

      // When
      const result = await controller.findOne(userId);

      // Then
      expect(service.findOne).toHaveBeenCalledWith(userId);
      expect(result).toEqual(mockUser);
    });

    it('When findOne é chamado com um ID inexistente, then deve lançar HttpException', async () => {
      // Given
      const userId = 999;
      mockUsersService.findOne.mockResolvedValue(null);

      // When & Then
      await expect(controller.findOne(userId)).rejects.toThrow(
        new HttpException('User not found', HttpStatus.NOT_FOUND),
      );
    });
  });

  describe('Feature: Atualizar Usuário', () => {
    it('When update é chamado com dados válidos, then deve retornar o usuário atualizado', async () => {
      // Given
      const userId = 1;
      const dto: UpdateUserDto = { name: 'João Atualizado', email: "joao@email.com", birthDate: new Date(), isActive: true };
      const updatedUser: User = {
        id: userId,
        name: 'João Atualizado',
        email: 'joao@email.com',
        password: '123',
        isActive: true,
        birthDate: new Date(),
        createdAt: new Date(),
      };
      mockUsersService.update.mockResolvedValue(updatedUser);

      // When
      const result = await controller.update(userId, dto);

      // Then
      expect(service.update).toHaveBeenCalledWith(userId, dto);
      expect(result).toEqual(updatedUser);
    });
  });

  describe('Feature: Remover Usuário', () => {
    it('When remove é chamado com um ID válido, then deve retornar o usuário removido', async () => {
      // Given
      const userId = 1;
      const removedUser: User = {
        id: userId,
        name: 'João Removido',
        email: 'removido@email.com',
        password: '123',
        isActive: false,
        birthDate: new Date(),
        createdAt: new Date(),
      };
      mockUsersService.remove.mockResolvedValue(removedUser);

      // When
      const result = await controller.remove(userId);

      // Then
      expect(service.remove).toHaveBeenCalledWith(userId);
      expect(result).toEqual(removedUser);
    });
  });
});
