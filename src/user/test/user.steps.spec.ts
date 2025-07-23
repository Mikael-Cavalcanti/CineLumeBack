import { defineFeature, loadFeature } from 'jest-cucumber';
import { PrismaService } from '../../prisma/prisma.service';
import { UsersService } from '../../user/users.service';
import { CreateUserDto } from '../../user/dto/create-user.dto';
import { User } from '@prisma/client';
import { UpdateUserDto } from '../dto/update-user.dto';

const feature = loadFeature('src/user/test/user.feature');

let usersService: UsersService;
let prisma: PrismaService;
let resultant: User | null;

defineFeature(feature, (test) => {
  beforeEach(() => {
    prisma = {
      user: {
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    } as unknown as PrismaService;

    usersService = new UsersService(prisma);
    jest.clearAllMocks();
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

        (prisma.user.update as jest.Mock).mockResolvedValue({
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
});
