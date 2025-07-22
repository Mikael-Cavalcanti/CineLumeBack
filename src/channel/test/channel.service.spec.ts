import { Test, TestingModule } from '@nestjs/testing';
import { ChannelService } from '../channel.service';
import { PrismaService } from '../../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';

// Mock do PrismaService para isolar os testes do banco de dados real
const mockPrismaService = {
  channel: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

const mockChannel = {
  id: 1,
  name: 'Canal Teste',
  logoUrl: 'http://example.com/logo.png',
  videos: [],
  subscribers: [],
};

describe('ChannelService', () => {
  let service: ChannelService;
  let prisma: typeof mockPrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChannelService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<ChannelService>(ChannelService);
    prisma = module.get(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('deve criar e retornar um canal', async () => {
      const createDto = { name: 'Canal Teste', logoUrl: 'http://example.com/logo.png' };
      prisma.channel.create.mockResolvedValue(mockChannel);

      const result = await service.create(createDto);

      expect(prisma.channel.create).toHaveBeenCalledWith({ data: createDto });
      expect(result).toEqual(mockChannel);
    });

    it('deve lançar uma exceção se o nome do canal já existir', async () => {
      const createDto = { name: 'Canal Existente' };
      prisma.channel.create.mockRejectedValue(
        new Prisma.PrismaClientKnownRequestError('Erro', { code: 'P2002', clientVersion: '' }),
      );

      await expect(service.create(createDto)).rejects.toThrow(
        new NotFoundException('Um canal com este nome já existe.'),
      );
    });
  });

  describe('findAll', () => {
    it('deve retornar uma lista de canais', async () => {
      prisma.channel.findMany.mockResolvedValue([mockChannel]);
      const result = await service.findAll();
      expect(result).toEqual([mockChannel]);
      expect(prisma.channel.findMany).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('deve retornar um canal pelo ID', async () => {
      prisma.channel.findUnique.mockResolvedValue(mockChannel);
      const result = await service.findOne(1);
      expect(result).toEqual(mockChannel);
      expect(prisma.channel.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('deve lançar NotFoundException se o canal não for encontrado', async () => {
      prisma.channel.findUnique.mockResolvedValue(null);
      await expect(service.findOne(99)).rejects.toThrow(
        new NotFoundException('Canal com o ID 99 não encontrado.'),
      );
    });
  });

  describe('update', () => {
    it('deve atualizar e retornar o canal', async () => {
      const updateDto = { name: 'Nome Atualizado' };
      const updatedChannel = { ...mockChannel, ...updateDto };
      
      prisma.channel.findUnique.mockResolvedValue(mockChannel); // Simula que o canal existe
      prisma.channel.update.mockResolvedValue(updatedChannel);

      const result = await service.update(1, updateDto);

      expect(prisma.channel.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: updateDto,
      });
      expect(result).toEqual(updatedChannel);
    });

    it('deve lançar NotFoundException se o canal a ser atualizado não for encontrado', async () => {
      const updateDto = { name: 'Nome Atualizado' };
      prisma.channel.findUnique.mockResolvedValue(null);
      
      await expect(service.update(99, updateDto)).rejects.toThrow(
        new NotFoundException('Canal com o ID 99 não encontrado.'),
      );
    });
  });

  describe('remove', () => {
    it('deve remover um canal', async () => {
      prisma.channel.findUnique.mockResolvedValue(mockChannel); // Simula que o canal existe
      prisma.channel.delete.mockResolvedValue(mockChannel);

      await service.remove(1);

      expect(prisma.channel.delete).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('deve lançar NotFoundException se o canal a ser removido não for encontrado', async () => {
      prisma.channel.findUnique.mockResolvedValue(null);
      
      await expect(service.remove(99)).rejects.toThrow(
        new NotFoundException('Canal com o ID 99 não encontrado.'),
      );
    });
  });
});
