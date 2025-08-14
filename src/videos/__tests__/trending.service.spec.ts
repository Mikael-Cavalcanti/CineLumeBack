import { Test, TestingModule } from '@nestjs/testing';
import { TrendingService } from '../trending.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('TrendingService', () => {
  let service: TrendingService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    trending: {
      upsert: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TrendingService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<TrendingService>(TrendingService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('incrementViewCount', () => {
    it('should increment view count for existing video', async () => {
      const videoId = 1;
      const mockTrendingRecord = {
        id: 1,
        videoId: 1,
        viewCount: 100,
        rank: 1,
        recordedAt: new Date(),
      };

      mockPrismaService.trending.upsert.mockResolvedValue(mockTrendingRecord);
      mockPrismaService.trending.findMany.mockResolvedValue([mockTrendingRecord]);
      mockPrismaService.trending.update.mockResolvedValue(mockTrendingRecord);

      await service.incrementViewCount(videoId);

      expect(mockPrismaService.trending.upsert).toHaveBeenCalledWith({
        where: { videoId },
        update: {
          viewCount: {
            increment: 1,
          },
          recordedAt: expect.any(Date),
        },
        create: {
          videoId,
          viewCount: 1,
          rank: 1,
          recordedAt: expect.any(Date),
        },
      });
    });

    it('should handle errors when incrementing view count', async () => {
      const videoId = 1;
      const error = new Error('Database error');

      mockPrismaService.trending.upsert.mockRejectedValue(error);

      await expect(service.incrementViewCount(videoId)).rejects.toThrow(
        'Error incrementing view count',
      );
    });
  });

  describe('getTopTrendingMovies', () => {
    it('should return top 10 trending movies', async () => {
      const mockTrendingData = [
        {
          id: 1,
          videoId: 1,
          rank: 1,
          viewCount: 1000,
          recordedAt: new Date(),
          video: {
            id: 1,
            title: 'Test Movie',
            releaseYear: 2024,
            thumbnailUrl: 'test.jpg',
            description: 'Test description',
            duration: 7200,
            genres: [
              {
                genre: {
                  name: 'Action',
                },
              },
            ],
          },
        },
      ];

      mockPrismaService.trending.findMany.mockResolvedValue(mockTrendingData);

      const result = await service.getTopTrendingMovies();

      expect(result).toEqual({
        movies: [
          {
            id: 1,
            title: 'Test Movie',
            year: '2024',
            image: 'test.jpg',
            rank: 1,
            views: 1000,
            description: 'Test description',
            genre: 'Action',
            duration: '2h 0min',
          },
        ],
        total: 1,
        period: 'week',
      });
    });

    it('should handle errors when fetching top trending movies', async () => {
      const error = new Error('Database error');

      mockPrismaService.trending.findMany.mockRejectedValue(error);

      await expect(service.getTopTrendingMovies()).rejects.toThrow(
        'Error fetching top trending movies',
      );
    });
  });

  describe('getTrendingByPeriod', () => {
    it('should return trending movies for week period', async () => {
      const period = 'week';
      const mockTrendingData = [
        {
          id: 1,
          videoId: 1,
          rank: 1,
          viewCount: 1000,
          recordedAt: new Date(),
          video: {
            id: 1,
            title: 'Test Movie',
            releaseYear: 2024,
            thumbnailUrl: 'test.jpg',
            description: 'Test description',
            duration: 3600,
            genres: [
              {
                genre: {
                  name: 'Action',
                },
              },
            ],
          },
        },
      ];

      mockPrismaService.trending.findMany.mockResolvedValue(mockTrendingData);

      const result = await service.getTrendingByPeriod(period);

      expect(result).toEqual({
        movies: [
          {
            id: 1,
            title: 'Test Movie',
            year: '2024',
            image: 'test.jpg',
            rank: 1,
            views: 1000,
            description: 'Test description',
            genre: 'Action',
            duration: '1h 0min',
          },
        ],
        total: 1,
        period: 'week',
      });
    });

    it('should throw error for invalid period', async () => {
      const invalidPeriod = 'invalid';

      await expect(service.getTrendingByPeriod(invalidPeriod)).rejects.toThrow(
        'Invalid period',
      );
    });
  });

  describe('formatDuration', () => {
    it('should format duration correctly for hours and minutes', () => {
      const seconds = 7320; // 2h 2min
      const result = service['formatDuration'](seconds);
      expect(result).toBe('2h 2min');
    });

    it('should format duration correctly for minutes only', () => {
      const seconds = 1800; // 30min
      const result = service['formatDuration'](seconds);
      expect(result).toBe('30min');
    });
  });
}); 