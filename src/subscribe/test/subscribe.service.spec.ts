import { Test, TestingModule } from '@nestjs/testing';
import { SubscribeService } from '../subscribe.service';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateSubscribeDto } from '../dto/create-subscribe.dto';
import { ChannelSubscription } from '@prisma/client';

// Mock do Prisma
const mockPrismaService = {
  channelSubscription: {
    create: jest.fn(),
    findMany: jest.fn(),
    delete: jest.fn(),
  },
};

describe('SubscribeService', () => {
  let service: SubscribeService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SubscribeService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<SubscribeService>(SubscribeService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createSubscribe', () => {
    it('When uma inscrição é criada com sucesso, then deve retornar a nova inscrição', async () => {
      // Given
      const dto: CreateSubscribeDto = { profileId: 1, channelId: 10 };
      const expectedSubscription: ChannelSubscription = {
        id: 1,
        ...dto,
        subscribedAt: new Date(),
      };
      mockPrismaService.channelSubscription.create.mockResolvedValue(
        expectedSubscription,
      );

      // When
      const result = await service.createSubscribe(dto);

      // Then
      expect(prisma.channelSubscription.create).toHaveBeenCalledWith({
        data: dto,
      });
      expect(result).toEqual(expectedSubscription);
    });

    it('When a inscrição já existe (erro P2002), then deve lançar um erro', async () => {
      // Given
      const dto: CreateSubscribeDto = { profileId: 1, channelId: 10 };
      mockPrismaService.channelSubscription.create.mockRejectedValue({
        code: 'P2002',
      });

      // When & Then
      await expect(service.createSubscribe(dto)).rejects.toThrow(
        new Error('Subscrition already exists'),
      );
    });
  });

  describe('getAllSubscribes', () => {
    it('When solicitado, then deve retornar uma lista de inscrições para um perfil', async () => {
      // Given
      const profileId = 1;
      const expectedSubscriptions: ChannelSubscription[] = [
        { id: 1, profileId: 1, channelId: 10, subscribedAt: new Date() },
      ];
      mockPrismaService.channelSubscription.findMany.mockResolvedValue(
        expectedSubscriptions,
      );

      // When
      const result = await service.getAllSubscribes(profileId);

      // Then
      expect(prisma.channelSubscription.findMany).toHaveBeenCalledWith({
        where: { profileId },
      });
      expect(result).toEqual(expectedSubscriptions);
    });
  });

  describe('removeSubscribe', () => {
    it('When uma inscrição é removida com sucesso, then deve retornar a inscrição removida', async () => {
      // Given
      const profileId = 1;
      const channelId = 10;
      const expectedSubscription: ChannelSubscription = {
        id: 1,
        profileId,
        channelId,
        subscribedAt: new Date(),
      };
      mockPrismaService.channelSubscription.delete.mockResolvedValue(
        expectedSubscription,
      );

      // When
      const result = await service.removeSubscribe(profileId, channelId);

      // Then
      expect(prisma.channelSubscription.delete).toHaveBeenCalledWith({
        where: { profileId_channelId: { profileId, channelId } },
      });
      expect(result).toEqual(expectedSubscription);
    });
  });
});
