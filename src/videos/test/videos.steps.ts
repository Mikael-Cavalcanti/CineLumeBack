import { defineFeature, DefineStepFunction, loadFeature } from 'jest-cucumber';
import { PrismaService } from '../../prisma/prisma.service';
import { Video } from '@prisma/client';
import { VideosService } from '../videos.service';
import { BaseVideoDto } from '../dto/base-video.dto';

const feature = loadFeature('src/videos/test/video.feature');

defineFeature(feature, (test) => {
  let videosService: VideosService;
  let result: Video | null;
  let videoRef: Video | null;

  const prisma = {
    video: {
      create: jest.fn(),
      update: jest.fn(),
      findFirst: jest.fn(),
      delete: jest.fn(),
    },
  } as unknown as PrismaService;

  beforeAll(() => {
    videosService = new VideosService(prisma);
    jest.clearAllMocks();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  function featureBackground(given: DefineStepFunction, prisma: PrismaService) {
    let ref: Video | null;
    given(
      /^que os dados padrão do vídeo são título "([^"]+)", descrição "([^"]+)", ano de lançamento "([^"]+)", duração "([^"]+)", tipo "([^"]+)", url "([^"]+)", classificação etária "([^"]+)", e thumbnail "([^"]+)"$/,
      (
        title: string,
        description: string,
        releaseYear: string,
        duration: string,
        type: string,
        videoUrl: string,
        ageRating: string,
        thumbnailUrl: string,
      ) => {
        (prisma.video.create as jest.Mock).mockResolvedValue(
          (ref = {
            title,
            description,
            releaseYear: Number(releaseYear),
            duration: Number(duration),
            type,
            thumbnailUrl,
            videoUrl,
            ageRating,
          } as unknown as Video),
        );
      },
    );

    given(/^o ID padrão do vídeo é "([^"]+)"$/, (id: number) => {
      ref!.id = Number(id);

      videoRef = ref;
    });
  }

  // Cenário 1: Criar um novo vídeo
  test('Criar um vídeo com sucesso', ({ given, when, then }) => {
    featureBackground(given, prisma);

    when(/^um novo vídeo é criado$/, async () => {
      result = await videosService.create({
        title: videoRef!.title,
        description: videoRef!.description,
        releaseYear: videoRef!.releaseYear,
        duration: videoRef!.duration,
        type: videoRef!.type,
        thumbnailUrl: videoRef!.thumbnailUrl,
        url: videoRef!.videoUrl,
        ageRating: videoRef!.ageRating,
      } as unknown as BaseVideoDto);
    });

    then(/^o vídeo deve ser salvo no sistema com os dados informados$/, () => {
      expect(result).toEqual(videoRef);

      expect(prisma.video.create).toHaveBeenCalledWith({
        data: {
          title: videoRef!.title,
          description: videoRef!.description,
          releaseYear: videoRef!.releaseYear,
          duration: videoRef!.duration,
          type: videoRef!.type,
          thumbnailUrl: videoRef!.thumbnailUrl,
          videoUrl: videoRef!.videoUrl,
          ageRating: videoRef!.ageRating,
        },
      });
    });

    then(/^o vídeo deve ser retornado com ID "([^"]+)"$/, (id: string) => {
      expect(result).toHaveProperty('id', Number(id));
    });
  });

  // Cenário 2: Atualizar um vídeo existente com sucesso
  test('Atualizar um vídeo existente com sucesso', ({ given, when, then }) => {
    //background
    featureBackground(given, prisma);

    when(
      /^o vídeo é atualizado com novo tipo "([^"]+)"$/,
      async (newType: string) => {
        (prisma.video.update as jest.Mock).mockResolvedValue({
          ...videoRef,
          type: newType,
        });

        result = await videosService.update(videoRef!.id, {
          title: videoRef!.title,
          type: newType,
          description: videoRef!.description,
          releaseYear: videoRef!.releaseYear,
          duration: videoRef!.duration,
          thumbnailUrl: videoRef!.thumbnailUrl,
          ageRating: videoRef!.ageRating,
          url: videoRef!.videoUrl,
        } as unknown as BaseVideoDto);
      },
    );

    then(
      /^o vídeo deve ser atualizado no sistema com tipo "([^"]+)"$/,
      (expectedType: string) => {
        expect(result).toHaveProperty('type', expectedType);

        expect(result).toEqual({
          ...videoRef,
          type: expectedType,
        });

        expect(prisma.video.update).toHaveBeenCalledWith({
          where: { id: videoRef!.id },
          data: {
            title: videoRef!.title,
            description: videoRef!.description,
            releaseYear: videoRef!.releaseYear,
            duration: videoRef!.duration,
            type: expectedType,
            thumbnailUrl: videoRef!.thumbnailUrl,
            videoUrl: videoRef!.videoUrl,
            ageRating: videoRef!.ageRating,
          },
        });
      },
    );
  });
});
