Feature: Verificação de E-mail do Usuário
  Como um novo usuário da plataforma,
  Eu quero poder verificar meu e-mail usando um código
  Para ativar minha conta e garantir sua segurança.

  Background:
    Given que a API está em execução
    And existe um usuário não verificado no sistema com o e-mail "teste@cinelume.com"

  Scenario: Verificar e-mail com um código válido
    Given o usuário com e-mail "teste@cinelume.com" possui um código de verificação "123456" válido
    When eu envio uma requisição POST para "/mail/verify-email" com o corpo:
      """
      {
        "email": "teste@cinelume.com",
        "code": "123456"
      }
      """
    Then o código de status da resposta deve ser 201
    And a resposta deve conter a mensagem "E-mail confirmado com sucesso."

  Scenario: Tentar verificar e-mail com um código inválido
    Given o usuário com e-mail "teste@cinelume.com" possui um código de verificação "123456" válido
    When eu envio uma requisição POST para "/mail/verify-email" com o corpo:
      """
      {
        "email": "teste@cinelume.com",
        "code": "999999"
      }
      """
    Then o código de status da resposta deve ser 400
    And a resposta deve conter a mensagem de erro "Código incorreto ou não encontrado"

  Scenario: Reenviar código de verificação para um usuário não verificado
    When eu envio uma requisição POST para "/mail/resend-email/teste@cinelume.com"
    Then o código de status da resposta deve ser 201
    And a resposta deve conter a mensagem "Código de verificação reenviado com sucesso."

  Scenario: Tentar reenviar código para um usuário já verificado
    Given que o usuário com e-mail "verificado@cinelume.com" já está com o e-mail verificado
    When eu envio uma requisição POST para "/mail/resend-email/verificado@cinelume.com"
    Then o código de status da resposta deve ser 400
    And a resposta deve conter a mensagem de erro "Usuário com email verificado"

