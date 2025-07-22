import { Test, TestingModule } from '@nestjs/testing';
import { SubscribeController } from '../subscribe.controller';
import { SubscribeService } from '../subscribe.service';
import { JwtAuthGuard } from '../../../src/auth/jwt-auth.guard';
import { CreateSubscribeDto } from '../dto/create-subscribe.dto';
import { HttpException, HttpStatus } from '@nestjs/common';

// Mock do serviço
const mockSubscribeService = {
  getAllSubscribes: jest.fn(),
  createSubscribe: jest.fn(),
  removeSubscribe: jest.fn(),
};

// Mock do Guard
const mockJwtAuthGuard = {
  canActivate: jest.fn(() => true),
};

describe('SubscribeController', () => {
  let controller: SubscribeController;
  let service: SubscribeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubscribeController],
      providers: [
        {
          provide: SubscribeService,
          useValue: mockSubscribeService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue(mockJwtAuthGuard)
      .compile();

    controller = module.get<SubscribeController>(SubscribeController);
    service = module.get<SubscribeService>(SubscribeService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Feature: Listar Inscrições', () => {
    it('When getAllSubscribes é chamado, then deve retornar uma lista de inscrições', async () => {
      // Given
      const profileId = 1;
      const mockSubscribes = [{ profileId: 1, channelId: 10 }];
      mockSubscribeService.getAllSubscribes.mockResolvedValue(mockSubscribes);

      // When
      const result = await controller.getAllSubscribes(profileId);

      // Then
      expect(service.getAllSubscribes).toHaveBeenCalledWith(profileId);
      expect(result).toEqual({ success: true, data: mockSubscribes });
    });
  });

  describe('Feature: Criar Inscrição', () => {
    it('When createSubscribe é chamado com dados válidos, then deve retornar a inscrição criada', async () => {
      // Given
      const createDto: CreateSubscribeDto = { profileId: 1, channelId: 10 };
      const createdSubscribe = { id: 1, ...createDto };
      mockSubscribeService.createSubscribe.mockResolvedValue(createdSubscribe);

      // When
      const result = await controller.createSubscribe(createDto);

      // Then
      expect(service.createSubscribe).toHaveBeenCalledWith(createDto);
      expect(result).toEqual({ success: true, data: createdSubscribe });
    });
  });

  describe('Feature: Remover Inscrição', () => {
    it('When remove é chamado com IDs válidos, then deve retornar a inscrição removida', async () => {
      // Given
      const profileId = '1';
      const channelId = '10';
      const removedSubscribe = { profileId: 1, channelId: 10 };
      mockSubscribeService.removeSubscribe.mockResolvedValue(removedSubscribe);

      // When
      const result = await controller.remove(profileId, channelId);

      // Then
      expect(service.removeSubscribe).toHaveBeenCalledWith(+profileId, +channelId);
      expect(result).toEqual(removedSubscribe);
    });

    it('When remove é chamado para uma inscrição inexistente, then deve lançar HttpException', async () => {
      // Given
      const profileId = '1';
      const channelId = '999';
      mockSubscribeService.removeSubscribe.mockResolvedValue(null);

      // When & Then
      await expect(controller.remove(profileId, channelId)).rejects.toThrow(
        new HttpException('Subscribe not found', HttpStatus.NOT_FOUND),
      );
    });
  });
});
