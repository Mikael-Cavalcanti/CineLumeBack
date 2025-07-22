import { Test, TestingModule } from '@nestjs/testing';
import { MailController } from '../mail.controller';
import { MailService } from '../mail.service';
import { VerifyEmailDto } from '../../auth/dto/verify-email.dto';

// Mock do serviço para isolar o controller
const mockMailService = {
  verifyEmailCode: jest.fn(),
  reSendEmailCode: jest.fn(),
};

describe('MailController', () => {
  let controller: MailController;
  let service: MailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MailController],
      providers: [
        {
          provide: MailService,
          useValue: mockMailService,
        },
      ],
    }).compile();

    controller = module.get<MailController>(MailController);
    service = module.get<MailService>(MailService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Feature: Verificar e-mail', () => {
    it('When verifyEmail é chamado com dados válidos, then deve chamar o serviço e retornar a mensagem de sucesso', async () => {
      // Given
      const dto: VerifyEmailDto = { email: 'teste@cinelume.com', code: '123456' };
      mockMailService.verifyEmailCode.mockResolvedValue(undefined); // Simula sucesso sem retorno

      // When
      const result = await controller.verifyEmail(dto);

      // Then
      expect(service.verifyEmailCode).toHaveBeenCalledWith(dto);
      expect(result).toEqual({ message: 'E-mail confirmado com sucesso.' });
    });
  });

  describe('Feature: Reenviar e-mail de verificação', () => {
    it('When resendEmail é chamado, then deve chamar o serviço e retornar a mensagem de sucesso', async () => {
      // Given
      const email = 'teste@cinelume.com';
      mockMailService.reSendEmailCode.mockResolvedValue(undefined); // Simula sucesso sem retorno

      // When
      const result = await controller.resendEmail(email);

      // Then
      expect(service.reSendEmailCode).toHaveBeenCalledWith(email);
      expect(result).toEqual({ message: 'Código de verificação reenviado com sucesso.' });
    });
  });
});
