import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { loadFeature, defineFeature, DefineStepFunction } from 'jest-cucumber';
import { RecentlyWatchedModule } from '../../../src/recently-watched/recently-watched.module';
import { PrismaService } from 'src/prisma/prisma.service';

// Carrega o arquivo .feature
const feature = loadFeature('./test/features/recently_watched.feature');

// Mock do PrismaService para simular o banco de dados nos testes e2e
const mockPrismaService = {
  profile: {
    findUnique: jest.fn(),
  },
  video: {
    findUnique: jest.fn(),
  },
  playbackSession: {
    create: jest.fn(),
    findMany: jest.fn(),
    delete: jest.fn(), // Adicionado para o cenário de DELETE
  },
};

defineFeature(feature, (test) => {
  let app: INestApplication;
  let prisma: typeof mockPrismaService;
  let response: request.Response;
  let requestBody: any;

  // Antes de todos os testes, inicializa a aplicação NestJS
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [RecentlyWatchedModule],
    })
    .overrideProvider(PrismaService)
    .useValue(mockPrismaService)
    .compile();

    app = moduleFixture.createNestApplication();
    // Usa um ValidationPipe para simular o comportamento real de validação de DTOs
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
    await app.init();
    prisma = app.get(PrismaService);
  });

  // Limpa os mocks antes de cada cenário
  beforeEach(() => {
    jest.clearAllMocks();
    // Reseta o mock para o estado padrão
    prisma.profile.findUnique.mockResolvedValue({ id: 1, name: 'Test User' });
    prisma.video.findUnique.mockResolvedValue({ id: 101, title: 'Interestelar' });
  });

  // Fecha a aplicação após todos os testes
  afterAll(async () => {
    await app.close();
  });

  // Implementação dos passos do Gherkin

  const givenOVideoFoiAdicionado = (given: DefineStepFunction) => {
    given(/^o vídeo com id (\d+) já foi adicionado à lista do perfil (\d+)$/, (videoId, profileId) => {
      // Para este passo, assumimos que a criação já ocorreu.
      // Em um teste e2e real, você poderia popular o banco de dados aqui.
      // Para o GET, vamos mockar o retorno do findMany.
      prisma.playbackSession.findMany.mockResolvedValue([
        { id: 1, profileId: parseInt(profileId), videoId: parseInt(videoId), startedAt: new Date(), endedAt: new Date(), video: { id: parseInt(videoId), title: 'Interestelar' } }
      ]);
      // Para o DELETE, mockamos o retorno do delete.
      prisma.playbackSession.delete.mockResolvedValue({ id: 1, profileId: parseInt(profileId), videoId: parseInt(videoId) });
    });
  };

  const whenARequisicaoForEnviada = (when: DefineStepFunction) => {
    when(/^uma requisição "(POST|GET|DELETE)" for enviada para "([^"]*)"(?: com o corpo:\s*"""\s*([\s\S]*?)\s*""")?$/, async (method, url, body) => {
      requestBody = body ? JSON.parse(body) : {};
      
      // Mock das validações de existência de perfil e vídeo
      if (requestBody.profileId === 999) {
        prisma.profile.findUnique.mockResolvedValue(null);
      }
      if (requestBody.videoId === 999) {
        prisma.video.findUnique.mockResolvedValue(null);
      }
      
      // Mock da criação da sessão
      if(method === 'POST') {
          prisma.playbackSession.create.mockResolvedValue({
              id: 1,
              ...requestBody,
              startedAt: new Date(),
              endedAt: null,
          });
      }

      // Executa a requisição HTTP
      response = await request(app.getHttpServer())
        [method.toLowerCase()](url)
        .send(requestBody);
    });
  };

  const thenOStatusDeveSer = (then: DefineStepFunction) => {
    then(/^o status da resposta deve ser "(\d+)"$/, (statusCode) => {
      expect(response.status).toBe(parseInt(statusCode, 10));
    });
  };

  // Cenário: Adicionar vídeo à lista de assistidos recentemente
  test('Adicionar vídeo à lista de assistidos recentemente', ({ when, then, and }) => {
    whenARequisicaoForEnviada(when);
    thenOStatusDeveSer(then);

    and(/^o JSON da resposta deve conter:$/, (table) => {
      const expectedJson = table.reduce((obj, row) => {
        obj[row.key] = parseInt(row.value, 10);
        return obj;
      }, {});
      expect(response.body).toMatchObject(expectedJson);
    });
  });

  // Cenário: Listar vídeos assistidos recentemente
  test('Listar vídeos assistidos recentemente', ({ given, when, then, and }) => {
    givenOVideoFoiAdicionado(given);
    whenARequisicaoForEnviada(when);
    thenOStatusDeveSer(then);

    and(/^o JSON da resposta deve conter uma lista com (\d+) item$/, (count) => {
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(parseInt(count, 10));
    });

    and(/^o item com videoId "(\d+)" está presente$/, (videoId) => {
      const item = response.body.find(item => item.videoId === parseInt(videoId));
      expect(item).toBeDefined();
    });
  });
  
  // Cenário: Remover vídeo assistido recentemente
  // NOTA: Este cenário requer a implementação do endpoint DELETE no controller.
  test('Remover vídeo assistido recentemente', ({ given, when, then, and }) => {
    givenOVideoFoiAdicionado(given);
    whenARequisicaoForEnviada(when);
    thenOStatusDeveSer(then);

    and(/^a mensagem de sucesso "([^"]*)" é retornada$/, (message) => {
      // Supondo que o endpoint de delete retorne um objeto com uma mensagem.
      // Ex: { message: 'Vídeo removido com sucesso' }
      // Isso precisa ser definido na sua implementação do controller.
      expect(response.body.message).toBe(message);
    });
  });

  // Cenários de erro
  const thenAMensagemDeErroERetornada = (then: DefineStepFunction) => {
    then(/^a mensagem de erro "([^"]*)" é retornada$/, (message) => {
      // A estrutura da mensagem de erro pode variar (ex: { message: '...' } ou { error: '...', message: [...] })
      // Ajuste o expect conforme a resposta de erro real da sua aplicação.
      expect(response.body.message).toContain(message);
    });
  };

  test('Adicionar vídeo inexistente à lista', ({ when, then, and }) => {
    whenARequisicaoForEnviada(when);
    thenOStatusDeveSer(then);
    thenAMensagemDeErroERetornada(and);
  });

  test('Adicionar vídeo com perfil inexistente', ({ when, then, and }) => {
    whenARequisicaoForEnviada(when);
    thenOStatusDeveSer(then);
    thenAMensagemDeErroERetornada(and);
  });

  test('Enviar dados inválidos', ({ when, then, and }) => {
    whenARequisicaoForEnviada(when);
    thenOStatusDeveSer(then);
    thenAMensagemDeErroERetornada(and);
  });
});
