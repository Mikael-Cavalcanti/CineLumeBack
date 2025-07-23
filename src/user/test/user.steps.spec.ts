import { defineFeature, loadFeature } from 'jest-cucumber';
import { PrismaService } from '../../prisma/prisma.service';
import { UsersService } from '../../user/users.service';
import { CreateUserDto } from '../../user/dto/create-user.dto';
import { User } from '@prisma/client';

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
      },
    } as unknown as PrismaService;

    usersService = new UsersService(prisma);
    jest.clearAllMocks();
  });

  //Cenário: Criar um usuário com sucesso
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

  // Cenário: Buscar um usuário por ID com sucesso
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
});
