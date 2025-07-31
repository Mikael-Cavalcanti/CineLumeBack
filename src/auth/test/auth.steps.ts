import { defineFeature, loadFeature } from 'jest-cucumber';
import { PrismaService } from '../../prisma/prisma.service';
import { ProfileService } from '../../profile/profile.service';
import { UsersService } from '../../user/users.service';
import { AuthService } from '../auth.service';
import { JwtService } from '@nestjs/jwt';
import { MailService } from '../../mail/mail.service';
import { CreateUserDto } from '../../user/dto/create-user.dto';
import { CreateProfileDto } from '../../profile/dto/create-profile.dto';
import { RegisterDto } from '../dto/register.dto';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt', () => ({
  ...jest.requireActual('bcrypt'),
  compare: jest.fn(() => true),
}));

const feature = loadFeature('src/auth/test/auth.feature');

let authService: AuthService;
let userService: UsersService;
let profileService: ProfileService;

let result: { accessToken: string };
let resultProfile: { userId: number };
let resultUser: User | null;

const prisma = {
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
  resetToken: {
    create: jest.fn(),
    update: jest.fn(),
    findFirst: jest.fn(),
  },
  profile: {
    create: jest.fn(),
  },
} as unknown as PrismaService;

const jwtService = {
  sign: jest.fn(),
} as unknown as JwtService;

const mailService = {
  sendEmailCode: jest.fn(),
} as unknown as MailService;

defineFeature(feature, (test) => {
  beforeAll(() => {
    userService = new UsersService(prisma);
    profileService = new ProfileService(prisma);
    authService = new AuthService(
      userService,
      jwtService,
      mailService,
      prisma,
      profileService,
    );
  });

  beforeEach(() => {
    jest.clearAllMocks();
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
  });

  test('Cadastro de usuário com sucesso', ({ given, when, then }) => {
    given('que não existe um usuário cadastrado', () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
    });

    when(
      /^um novo usuário é criado com id "([^"]+)", nome "([^"]+)", email "([^"]+)", senha "([^"]+)" e data de nascimento "([^"]+)"$/,
      async (
        id: number,
        name: string,
        email: string,
        password: string,
        birthDate: Date,
      ) => {
        (prisma.user.create as jest.Mock).mockResolvedValue({
          id: Number(id),
          name,
          email,
          password,
          birthDate: new Date(birthDate),
        });

        (mailService.sendEmailCode as jest.Mock).mockResolvedValue(undefined);

        resultUser = await userService.create({
          id: Number(id),
          name,
          email,
          password,
          birthDate: new Date(birthDate),
        } as CreateUserDto);
      },
    );

    when(
      /^é criado um perfil do usuário "([^"]+)" com nome "([^"]+)", isKid "([^"]+)" e avatar "([^"]+)"$/,
      async (id: number, name: string, isKid: boolean, avatar: string) => {
        (prisma.profile.create as jest.Mock).mockResolvedValue({
          userId: Number(id),
          name,
          isKidProfile: Boolean(isKid),
          avatar,
        });

        resultProfile = await profileService.createProfile({
          name,
          userId: Number(id),
          isKidProfile: Boolean(isKid),
          avatar,
        } as CreateProfileDto);
      },
    );

    when(
      /^é criado um token "([^"]+)" para o usuário com id "([^"]+)"$/,
      async (token: string, id: number) => {
        (jwtService.sign as jest.Mock).mockReturnValue(token);

        const expiresAt = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000);
        (prisma.resetToken.create as jest.Mock).mockResolvedValue({
          userId: Number(id),
          token,
          expiresAt,
          used: false,
        });

        (prisma.resetToken.update as jest.Mock).mockResolvedValue({
          userId: Number(id),
          token,
          expiresAt,
          used: true,
        });

        result = await authService.register({
          name: resultUser?.name,
          email: resultUser?.email,
          password: resultUser?.password,
          birthDate: resultUser?.birthDate,
        } as RegisterDto);
      },
    );

    then(
      /^o usuário é salvo no sistema com nome "([^"]+)", email "([^"]+)"$/,
      (name: string, email: string) => {
        expect(resultUser?.name).toEqual(name);
        expect(resultUser?.email).toEqual(email);
      },
    );

    then(/^o id do perfil tem que ser "([^"]+)" do usuário$/, (id: number) => {
      expect(resultProfile.userId).toEqual(Number(id));
    });

    then(
      /^o usuário com id "([^"]+)" recebe o token de autenticação "([^"]+)"$/,
      (id: number, token: string) => {
        expect(resultUser?.id).toEqual(Number(id));
        expect(result.accessToken).toEqual(token);
      },
    );
  });

  test('Login de usuário com sucesso', ({ given, when, then }) => {
    given(
      /^que existe um usuário cadastrado com email "([^"]+)" e senha "([^"]+)", id "([^"]+)", nome "([^"]+)" e nascimento "([^"]+)"$/,
      async (
        email: string,
        password: string,
        id: number,
        name: string,
        birthDate: Date,
      ) => {
        (prisma.user.findUnique as jest.Mock).mockResolvedValue({
          id: Number(id),
          name,
          email,
          password,
          birthDate: new Date(birthDate),
          isActive: true,
        });

        resultUser = await userService.findByEmail(email);
      },
    );

    given(
      /^o token "([^"]+)" para o usuário com id "([^"]+)" ainda não está expirado$/,
      (token: string, id: number) => {
        (prisma.resetToken.findFirst as jest.Mock).mockResolvedValue({
          userId: Number(id),
          token,
          expiresAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
          used: true,
        });
      },
    );

    when(
      /^o usuário tenta fazer login com email "([^"]+)" e senha "([^"]+)"$/,
      async (email: string, password: string) => {
        (jwtService.sign as jest.Mock).mockReturnValue('token123456');
        result = await authService.login({ email, password });
      },
    );

    then(
      /^o login é bem-sucedido e o retorna o token de autenticação "([^"]+)" para o usuário com id "([^"]+)"$/,
      (token: string, id: number) => {
        expect(resultUser?.id).toEqual(Number(id));
        expect(result.accessToken).toEqual(token);
      },
    );
  });
});
