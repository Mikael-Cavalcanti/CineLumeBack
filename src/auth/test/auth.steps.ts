import { defineFeature, loadFeature } from 'jest-cucumber';
import { PrismaService } from '../../prisma/prisma.service';
import { Profile, ResetToken, User } from '@prisma/client';
import { ProfileService } from '../../profile/profile.service';
import { UsersService } from '../../user/users.service';
import { CreateUserDto } from '../../user/dto/create-user.dto';
import { CreateProfileDto } from '../../profile/dto/create-profile.dto';

const feature = loadFeature('src/auth/test/auth.feature');

let profileService: ProfileService;
let userService: UsersService;

let resultProfile: Profile;
let resultUser: User;
let resultToken: ResetToken;

// Mock do Prisma
const prisma = {
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
  resetToken: {
    create: jest.fn(),
  },
  profile: {
    create: jest.fn(),
  },
} as unknown as PrismaService;

defineFeature(feature, (test) => {
  beforeAll(() => {
    profileService = new ProfileService(prisma);
    userService = new UsersService(prisma);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Cadastro de usuário com sucesso', ({ given, when, then }) => {
    given(/^que não existe um usuário cadastrado com email "([^"]+)"$/, () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
    });

    when(
      /^um novo usuário é criado com nome "([^"]+)", email "([^"]+)", senha "([^"]+)" e data de nascimento "([^"]+)"$/,
      async (
        name: string,
        email: string,
        password: string,
        birthDay: string,
      ) => {
        (prisma.user.create as jest.Mock).mockResolvedValue({
          id: 1,
          name,
          email,
          password,
          birthDate: new Date(birthDay),
        });

        resultUser = await userService.create({
          name,
          email,
          password,
          birthDate: new Date(birthDay),
        } as CreateUserDto);
      },
    );

    when(
      /^é criado um perfil de usuário com nome "([^"]+)", isKid "([^"]+)" e avatar "([^"]+)"$/,
      async (name: string, isKid: string, avatar: string) => {
        const isKidBool = isKid === 'true';

        (prisma.profile.create as jest.Mock).mockResolvedValue({
          id: 1,
          name,
          isKidProfile: isKidBool,
          avatar,
          userId: resultUser.id,
        });

        resultProfile = await profileService.createProfile({
          userId: resultUser.id,
          name,
          isKidProfile: isKidBool,
          avatar,
        } as CreateProfileDto);
      },
    );

    when(
      /^é criado um token "([^"]+)" para o usuário com id "([^"]+)"$/,
      async (token: string, id: string) => {
        const expiresAt = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000);

        (prisma.resetToken.create as jest.Mock).mockResolvedValue({
          id: 1,
          userId: Number(id),
          token,
          expiresAt,
        });

        resultToken = await prisma.resetToken.create({
          data: {
            userId: Number(id),
            token,
            expiresAt,
          },
        });
      },
    );

    then(
      /^o usuário é salvo no sistema com nome "([^"]+)", email "([^"]+)"$/,
      (name: string, email: string) => {
        expect(resultUser).toEqual(
          expect.objectContaining({
            name,
            email,
          }),
        );
      },
    );

    then(/^o id do perfil tem que ser "([^"]+)" do usuário$/, (id: string) => {
      expect(resultProfile.userId).toBe(Number(id));
      expect(resultProfile.userId).toBe(resultUser.id);
    });

    then(
      /^o usuário com id "([^"]+)" recebe o token de autenticação "([^"]+)"$/,
      (id: string, token: string) => {
        expect(resultToken.userId).toBe(Number(id));
        expect(resultToken.token).toBe(token);
      },
    );
  });
});
