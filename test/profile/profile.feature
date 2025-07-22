Feature: Gerenciamento de Perfis de Usuário
  Como um usuário autenticado,
  Eu quero poder criar, listar, atualizar e deletar perfis associados à minha conta
  Para gerenciar quem pode assistir na minha conta.

  Background:
    Given que a API está em execução e um usuário com ID 1 está autenticado.

  Scenario: Criar um novo perfil com sucesso
    When eu envio uma requisição POST para "/profiles" com o corpo:
      """
      {
        "userId": 1,
        "name": "Adulto 1",
        "avatarUrl": "http://example.com/avatar.png",
        "isKidProfile": false
      }
      """
    Then o código de status da resposta deve ser 201
    And a resposta deve conter os dados do perfil criado com o nome "Adulto 1"

  Scenario: Tentar criar um perfil com um nome que já existe para o mesmo usuário
    Given que já existe um perfil com o nome "Adulto 1" para o usuário com ID 1
    When eu envio uma requisição POST para "/profiles" com o corpo:
      """
      {
        "userId": 1,
        "name": "Adulto 1",
        "avatarUrl": "http://example.com/avatar2.png",
        "isKidProfile": false
      }
      """
    Then o código de status da resposta deve ser 400
    And a resposta deve conter a mensagem de erro "Profile name already exists"

  Scenario: Listar todos os perfis
    Given que existem perfis cadastrados no sistema
    When eu envio uma requisição GET para "/profiles"
    Then o código de status da resposta deve ser 200
    And a resposta deve conter uma lista de perfis

  Scenario: Atualizar um perfil existente
    Given que existe um perfil com ID 10
    When eu envio uma requisição PATCH para "/profiles/Update/10" com o corpo:
      """
      {
        "name": "Perfil Infantil",
        "isKidProfile": true
      }
      """
    Then o código de status da resposta deve ser 200
    And a resposta deve conter os dados do perfil atualizado com o nome "Perfil Infantil"

  Scenario: Deletar um perfil existente
    Given que existe um perfil com ID 10
    When eu envio uma requisição DELETE para "/profiles/10"
    Then o código de status da resposta deve ser 200
    And a resposta deve conter os dados do perfil que foi removido
