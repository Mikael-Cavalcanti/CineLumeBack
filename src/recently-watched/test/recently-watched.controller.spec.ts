import { Test, TestingModule } from '@nestjs/testing';
import { RecentlyWatchedController } from '../recently-watched.controller';
import { RecentlyWatchedService } from '../recently-watched.service';
import { CreatePlaybackDto } from '../dto/create-playback.dto';
import { FinishPlaybackDto } from '../dto/finish-playback.dto';
import { NotFoundException } from '@nestjs/common';

// Mock dos DTOs para uso nos testes
const mockCreatePlaybackDto: CreatePlaybackDto = {
  profileId: 1,
  videoId: 101,
};

const mockFinishPlaybackDto: FinishPlaybackDto = {
  endedAt: '95.5',
};

// Mock da implementação do RecentlyWatchedService para isolar o teste do controller
const mockRecentlyWatchedService = {
  createPlayback: jest.fn(),
  finishPlayback: jest.fn(),
  getRecentlyWatched: jest.fn(),
};

describe('RecentlyWatchedController', () => {
  let controller: RecentlyWatchedController;
  let service: RecentlyWatchedService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RecentlyWatchedController],
      providers: [
        {
          provide: RecentlyWatchedService,
          useValue: mockRecentlyWatchedService,
        },
      ],
    }).compile();

    controller = module.get<RecentlyWatchedController>(RecentlyWatchedController);
    service = module.get<RecentlyWatchedService>(RecentlyWatchedService);
  });

  // Limpa todos os mocks após cada teste para garantir a independência dos testes
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // Testes para o endpoint POST /
  describe('create', () => {
    it('should call service.createPlayback with the correct DTO and return the result', async () => {
      const expectedResult = { id: 1, ...mockCreatePlaybackDto, startedAt: new Date(), endedAt: null, stoppedAt: null };
      
      (service.createPlayback as jest.Mock).mockResolvedValue(expectedResult);

      const result = await controller.create(mockCreatePlaybackDto);
      
      expect(service.createPlayback).toHaveBeenCalledWith(mockCreatePlaybackDto);
      expect(result).toEqual(expectedResult);
    });
  });

  // Testes para o endpoint PATCH /:id/finish
  describe('finish', () => {
    it('should call service.finishPlayback with the correct id and DTO', async () => {
      const playbackId = '1';
      const expectedResult = { message: 'Playback finished' };
      (service.finishPlayback as jest.Mock).mockResolvedValue(expectedResult);

      const result = await controller.finish(playbackId, mockFinishPlaybackDto);

      // Verifica se o serviço foi chamado com o ID convertido para número
      expect(service.finishPlayback).toHaveBeenCalledWith(+playbackId, mockFinishPlaybackDto);
      expect(result).toEqual(expectedResult);
    });

    it('should throw NotFoundException if service throws it', async () => {
      const nonExistentId = '999';
      (service.finishPlayback as jest.Mock).mockRejectedValue(new NotFoundException());

      await expect(controller.finish(nonExistentId, mockFinishPlaybackDto)).rejects.toThrow(NotFoundException);
    });
  });

  // Testes para o endpoint GET /:profileId
  describe('getList', () => {
    it('should call service.getRecentlyWatched with the correct profileId and return the result', async () => {
      const profileId = '1';
      const expectedResult = [{ id: 1, profileId: +profileId, videoId: 101, video: { title: 'Interestelar' } }];
      
      (service.getRecentlyWatched as jest.Mock).mockResolvedValue(expectedResult);

      const result = await controller.getList(profileId);

      // Verifica se o serviço foi chamado com o ID convertido para número
      expect(service.getRecentlyWatched).toHaveBeenCalledWith(+profileId);
      expect(result).toEqual(expectedResult);
    });
  });
});
