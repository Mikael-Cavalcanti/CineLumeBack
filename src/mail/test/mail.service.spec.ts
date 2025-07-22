import { Test, TestingModule } from '@nestjs/testing';
import { MailService } from './../mail.service';
import { UsersService } from '../../user/users.service';
import { PrismaService } from '../../prisma/prisma.service';
import { BadRequestException } from '@nestjs/common';
import { VerifyEmailDto } from '../../auth/dto/verify-email.dto';
import { User } from '@prisma/client';

// Mocks dos serviços e do Prisma
const mockUsersService = {
  findByEmail: jest.fn(),
};

const mockPrismaService = {
  activationCode: {
    findFirst: jest.fn(),
    update: jest.fn(),
    create: jest.fn(), // Adicionado para o teste de reenvio
  },
  user: {
    update: jest.fn(),
  },
};

describe('MailService', () => {
  let service: MailService;
  let usersService: UsersService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MailService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<MailService>(MailService);
    usersService = module.get<UsersService>(UsersService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('verifyEmailCode', () => {
    it('When o código é válido, then deve verificar o usuário e retornar sucesso', async () => {
      // Given
      const dto: VerifyEmailDto = { email: 'teste@cinelume.com', code: '123456' };
      const mockUser = { id: 1, email: dto.email, isActive: false, birthdate: new Date(), createdAt: new Date() };
      const mockCode = { id: 1, code: '123456', used: false, userId: 1 };

      mockUsersService.findByEmail.mockResolvedValue(mockUser);
      mockPrismaService.activationCode.findFirst.mockResolvedValue(mockCode);

      // When
      const result = await service.verifyEmailCode(dto);

      // Then
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: mockUser.id },
        data: { isActive: true },
      });
      expect(prisma.activationCode.update).toHaveBeenCalledWith({
        where: { id: mockCode.id },
        data: { used: true },
      });
      expect(result).toEqual({ isVerified: true, message: 'E-mail verificado com sucesso.' });
    });

    it('When o código é inválido, then deve lançar uma BadRequestException', async () => {
      // Given
      const dto: VerifyEmailDto = { email: 'teste@cinelume.com', code: '999999' };
      const mockUser = { id: 1, email: dto.email, isActive: false, birthdate: new Date(), createdAt: new Date() };
      const mockCode = { id: 1, code: '123456', used: false, userId: 1 };

      mockUsersService.findByEmail.mockResolvedValue(mockUser);
      mockPrismaService.activationCode.findFirst.mockResolvedValue(mockCode);

      // When & Then
      await expect(service.verifyEmailCode(dto)).rejects.toThrow(
        new BadRequestException('Código incorreto ou não encontrado'),
      );
    });

    it('When o usuário já está verificado, then deve lançar uma BadRequestException', async () => {
        // Given
        const dto: VerifyEmailDto = { email: 'teste@cinelume.com', code: '123456' };
        const mockUser = { id: 1, email: dto.email, isActive: true, birthdate: new Date(), createdAt: new Date() }; // Usuário já ativo
  
        mockUsersService.findByEmail.mockResolvedValue(mockUser);
  
        // When & Then
        await expect(service.verifyEmailCode(dto)).rejects.toThrow(
          new BadRequestException('Usuário já verificado'),
        );
      });
  });

  describe('reSendEmailCode', () => {
    it('When o usuário não está verificado, then deve chamar sendEmailCode', async () => {
      // Given
      const email = 'nao-verificado@cinelume.com';
      const mockUser: User = { id: 2, email, isActive: false, name: 'Teste', password: '123',birthDate: new Date(), createdAt: new Date() };

      mockUsersService.findByEmail.mockResolvedValue(mockUser);
      // Mock para a lógica interna de sendEmailCode
      service.sendEmailCode = jest.fn().mockResolvedValue(undefined);

      // When
      await service.reSendEmailCode(email);

      // Then
      expect(usersService.findByEmail).toHaveBeenCalledWith(email);
      expect(service.sendEmailCode).toHaveBeenCalledWith(mockUser);
    });

    it('When o usuário já está verificado, then deve lançar uma BadRequestException', async () => {
      // Given
      const email = 'verificado@cinelome.com';
      const mockUser: User = { id: 3, email, isActive: true, name: 'Verificado', password: '123', birthDate: new Date(), createdAt: new Date() };

      mockUsersService.findByEmail.mockResolvedValue(mockUser);

      // When & Then
      await expect(service.reSendEmailCode(email)).rejects.toThrow(
        new BadRequestException('Usuário com email verificado'),
      );
    });
  });
});
