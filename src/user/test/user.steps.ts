import { defineFeature, loadFeature } from 'jest-cucumber';
import { PrismaService } from '../../prisma/prisma.service';
import { User } from '@prisma/client';
import { UpdateUserDto } from '../dto/update-user.dto';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { UsersService } from '../users.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { Test } from '@nestjs/testing';
import { UsersController } from '../users.controller';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

const feature = loadFeature('src/user/test/user.feature');

defineFeature(feature, (test) => {
  let usersService: UsersService;
  let resultant: User | null;
  let app: INestApplication;
  let response: request.Response;

  const prisma = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as unknown as PrismaService,
  } as unknown as PrismaService;

  const mockJwtGuard = {
    canActivate: () => true,
  };

  const mockUserService = {
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    findByEmail: jest.fn(),
    create: jest.fn(),
  };

  beforeAll(async () => {
    const userModuleMock = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUserService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue(mockJwtGuard)
      .compile();

    usersService = new UsersService(prisma);
    app = userModuleMock.createNestApplication();
    await app.init();

    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  afterAll(async () => {
    await app.close();
  });

  //Cenário 1: Criar um usuário com sucesso
  test('Criar um usuário com sucesso', ({ given, when, then }) => {
    given(
      /^que não existe um usuário cadastrado com nome "([^"]+)", email "([^"]+)", senha "([^"]+)" e data de nascimento "([^"]+)"$/,
      (name: string, email: string, password: string, birthDate: string) => {
        (prisma.user.create as jest.Mock).mockResolvedValue({
          id: 1,
          name,
          email,
          password,
          birthDate: new Date(birthDate),
        });
      },
    );

    when(
      /^um novo usuário é criado com nome "([^"]+)", email "([^"]+)", senha "([^"]+)" e data de nascimento "([^"]+)"$/,
      async (
        name: string,
        email: string,
        password: string,
        birthDate: string,
      ) => {
        resultant = await usersService.create({
          name,
          email,
          password,
          birthDate: new Date(birthDate),
        } as unknown as CreateUserDto);
      },
    );

    then(
      /^o usuário é salvo no sistema com nome "([^"]+)", email "([^"]+)", senha "([^"]+)" e data de nascimento "([^"]+)"$/,
      (name: string, email: string, password: string, birthDate: string) => {
        expect(resultant).toEqual({
          id: 1,
          name,
          email,
          password,
          birthDate: new Date(birthDate),
        });

        expect(prisma.user.create).toHaveBeenCalledWith({
          data: {
            name,
            email,
            password,
            birthDate: new Date(birthDate),
          },
        });
      },
    );

    then(/^o usuário deve ser retornado com ID "([^"]+)"$/, (id: string) => {
      expect(resultant).toHaveProperty('id', Number(id));
    });
  });

  // Cenário 2: Buscar um usuário por ID com sucesso
  test('Erro ao buscar um usuário com email inexistente', ({
    given,
    when,
    then,
  }) => {
    given(
      /^existe um usuário cadastrado com nome "([^"]*)", email "([^"]*)"$/,
      (name: string, email: string) => {
        (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
        (prisma.user.create as jest.Mock).mockResolvedValue({
          id: 1,
          name,
          email,
          password: 'password',
          birthDate: new Date('2000-01-01'),
        } as unknown as User);
      },
    );
    when(
      /^é feita uma busca por usuário com email "([^"]*)"$/,
      async (email: string) => {
        resultant = await usersService.findByEmail(email);
      },
    );
    then(
      /^deve retornar "([^"]*)" para o usuário com email "([^"]*)"$/,
      (spected: string, email: string) => {
        expect(resultant).toBeNull();
        expect(spected).toBe('null');
        expect(prisma.user.findUnique).toHaveBeenCalledWith({
          where: { email },
        });
      },
    );
  });

  // Cenário 3: Atualizar um usuário com sucesso
  test('Atualizar um usuário com sucesso', ({ given, when, then }) => {
    given(
      /^que existe um usuário cadastrado com id "([^"]+)", nome "([^"]+)", email "([^"]+)", senha "([^"]+)" e data de nascimento "([^"]+)"$/,
      (
        id: string,
        name: string,
        email: string,
        password: string,
        birthDate: string,
      ) => {
        (prisma.user.findUnique as jest.Mock).mockResolvedValue({
          id: Number(id),
          name,
          email,
          password,
          birthDate: new Date(birthDate),
        });
      },
    );

    when(
      /^o usuário com id "([^"]+)" é atualizado para "([^"]+)" com email "([^"]+)", senha "([^"]+)" e data de nascimento "([^"]+)"$/,
      async (
        id: number,
        name: string,
        email: string,
        password: string,
        birthDate: Date,
      ) => {
        (prisma.user.update as jest.Mock).mockResolvedValue({
          id: Number(id),
          name,
          email,
          password,
          birthDate: new Date(birthDate),
        });

        resultant = await usersService.update(Number(id), {
          name,
          email,
          password,
          birthDate: new Date(birthDate),
        } as UpdateUserDto);
      },
    );

    then(
      /^o usuário é atualizado no sistema com nome "([^"]+)", email "([^"]+)", senha "([^"]+)" e data de nascimento "([^"]+)"$/,
      (name: string, email: string, password: string, birthDate: string) => {
        expect(resultant).toEqual({
          id: 1,
          name,
          email,
          password,
          birthDate: new Date(birthDate),
        });

        expect(prisma.user.update).toHaveBeenCalledWith({
          where: { id: 1 },
          data: {
            name,
            email,
            password,
            birthDate: new Date(birthDate),
          },
        });
      },
    );
  });

  // Cenário 4: Remover um usuário com sucesso
  test('Remover um usuário com sucesso', ({ given, when, then }) => {
    given(
      /^que existe um usuário cadastrado com id "([^"]+)", nome "([^"]+)", email "([^"]+)", senha "([^"]+)" e data de nascimento "([^"]+)"$/,
      (
        id: string,
        name: string,
        email: string,
        password: string,
        birthDate: string,
      ) => {
        (prisma.user.findUnique as jest.Mock).mockResolvedValue({
          id: Number(id),
          name,
          email,
          password,
          birthDate: new Date(birthDate),
        });
      },
    );

    when(
      /^o usuário com id "([^"]+)" é removido do sistema$/,
      async (id: string) => {
        (prisma.user.delete as jest.Mock).mockResolvedValue({
          id: Number(id),
          name: 'João Silva',
          email: 'joao@example.com',
          password: '123456',
          birthDate: new Date('2000-01-01'),
        });

        await usersService.remove(Number(id));
      },
    );

    then(
      /^o usuário com id "([^"]+)" deve retornar "null" ao ser buscado$/,
      async (id: string) => {
        (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

        const result = await usersService.findOne(Number(id));
        expect(result).toBeNull();
      },
    );
  });

  // Cenário 5: Teste de Rota GET para buscar usuário por ID
  test('Buscar usuário existente por ID', ({ given, when, then }) => {
    given(
      /^que existe um usuário cadastrado com id "([^"]*)"$/,
      (id: number) => {
        mockUserService.findOne.mockResolvedValue({ id: Number(id) });
      },
    );

    when(/^faço uma requisição GET para "([^"]*)"$/, async (url) => {
      response = await request(app.getHttpServer()).get(url);
    });

    then(/^a resposta deve ter status (\d+)$/, (status) => {
      expect(response.status).toBe(Number(status));
    });

    then(
      /^a resposta deve conter o usuário com id "([^"]*)"$/,
      (id: number) => {
        expect(response.body.id).toBe(Number(id));
      },
    );
  });
});
