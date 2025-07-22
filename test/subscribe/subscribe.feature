Feature: Gerenciamento de Inscrições em Canais
  Como um usuário com um perfil,
  Eu quero poder me inscrever e desinscrever de canais
  Para personalizar o conteúdo que eu sigo.

  Background:
    Given que a API está em execução e um usuário está autenticado.
    And existe um perfil com ID 1 e um canal com ID 10.

  Scenario: Inscrever um perfil em um canal com sucesso
    When eu envio uma requisição POST para "/Subscribes" com o corpo:
      """
      {
        "profileId": 1,
        "channelId": 10
      }
      """
    Then o código de status da resposta deve ser 201
    And a resposta deve conter os dados da inscrição criada.

  Scenario: Tentar se inscrever em um canal que o perfil já está inscrito
    Given o perfil com ID 1 já está inscrito no canal com ID 10
    When eu envio uma requisição POST para "/Subscribes" com o corpo:
      """
      {
        "profileId": 1,
        "channelId": 10
      }
      """
    Then o código de status da resposta deve ser 400
    And a resposta deve conter a mensagem de erro "Subscrition already exists"

  Scenario: Listar todas as inscrições de um perfil
    Given o perfil com ID 1 está inscrito no canal com ID 10
    When eu envio uma requisição GET para "/Subscribes/1"
    Then o código de status da resposta deve ser 200
    And a resposta deve conter uma lista com as inscrições do perfil 1

  Scenario: Desinscrever de um canal com sucesso
    Given o perfil com ID 1 está inscrito no canal com ID 10
    When eu envio uma requisição DELETE para "/Subscribes/10?profileId=1"
    Then o código de status da resposta deve ser 200
    And a resposta deve conter os dados da inscrição que foi removida

  Scenario: Tentar se desinscrever de um canal que o perfil não está inscrito
    When eu envio uma requisição DELETE para "/Subscribes/99?profileId=1"
    Then o código de status da resposta deve ser 404
    And a resposta deve conter a mensagem de erro "Subscribe not found"
