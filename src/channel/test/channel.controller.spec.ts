import { Test, TestingModule } from '@nestjs/testing';
import { ChannelController } from '../channel.controller';
import { ChannelService } from '../channel.service';
import { CreateChannelDto } from '../dto/create-channel.dto';
import { UpdateChannelDto } from '../dto/update-channel.dto';

// Mock do ChannelService
const mockChannelService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

const mockChannel = {
  id: 1,
  name: 'Canal de Teste',
  logoUrl: 'http://example.com/logo.png',
};

describe('ChannelController', () => {
  let controller: ChannelController;
  let service: ChannelService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChannelController],
      providers: [
        {
          provide: ChannelService,
          useValue: mockChannelService,
        },
      ],
    }).compile();

    controller = module.get<ChannelController>(ChannelController);
    service = module.get<ChannelService>(ChannelService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve estar definido', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('deve chamar o service.create com os dados corretos', async () => {
      const createDto: CreateChannelDto = { name: 'Novo Canal', logoUrl: 'http://logo.url' };
      mockChannelService.create.mockResolvedValue(mockChannel);

      const result = await controller.create(createDto);

      expect(service.create).toHaveBeenCalledWith(createDto);
      expect(result).toEqual(mockChannel);
    });
  });

  describe('findAll', () => {
    it('deve chamar o service.findAll e retornar uma lista de canais', async () => {
      mockChannelService.findAll.mockResolvedValue([mockChannel]);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual([mockChannel]);
    });
  });

  describe('findOne', () => {
    it('deve chamar o service.findOne com o ID correto e retornar um canal', async () => {
      mockChannelService.findOne.mockResolvedValue(mockChannel);

      const result = await controller.findOne(1);

      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockChannel);
    });
  });

  describe('update', () => {
    it('deve chamar o service.update com o ID e os dados corretos', async () => {
      const updateDto: UpdateChannelDto = { name: 'Nome Atualizado' };
      const updatedChannel = { ...mockChannel, ...updateDto };
      mockChannelService.update.mockResolvedValue(updatedChannel);

      const result = await controller.update(1, updateDto);

      expect(service.update).toHaveBeenCalledWith(1, updateDto);
      expect(result).toEqual(updatedChannel);
    });
  });

  describe('remove', () => {
    it('deve chamar o service.remove com o ID correto', async () => {
      mockChannelService.remove.mockResolvedValue(undefined); // O método remove não retorna nada

      await controller.remove(1);

      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });
});
