Feature: Gerenciamento de Canais
  Como um usuário da API,
  Eu quero poder criar, ler, atualizar e deletar (CRUD) canais
  Para que eu possa gerenciar os canais disponíveis na plataforma.

  Background:
    Given que a API está em execução e pronta para receber requisições.

  Scenario: Criar um novo canal com sucesso
    When eu envio uma requisição POST para "/channels" com o corpo:
      """
      {
        "name": "Meu Canal de Culinária",
        "logoUrl": "https://example.com/culinaria.png"
      }
      """
    Then o código de status da resposta deve ser 201
    And a resposta deve conter um objeto de canal com o "name" igual a "Meu Canal de Culinária"

  Scenario: Tentar criar um canal com um nome que já existe
    Given que já existe um canal com o nome "Canal Repetido" no sistema
    When eu envio uma requisição POST para "/channels" com o corpo:
      """
      {
        "name": "Canal Repetido"
      }
      """
    Then o código de status da resposta deve ser 404
    And a resposta deve conter a mensagem de erro "Um canal com este nome já existe."

  Scenario: Listar todos os canais cadastrados
    Given que existem os seguintes canais no sistema:
      | name              | logoUrl                          |
      | Canal de Notícias  | https://example.com/noticias.png |
      | Canal de Esportes | https://example.com/esportes.png |
    When eu envio uma requisição GET para "/channels"
    Then o código de status da resposta deve ser 200
    And a resposta deve ser uma lista contendo 2 canais

  Scenario: Obter um canal específico pelo seu ID
    Given que existe um canal com id 1 e nome "Canal de Filmes"
    When eu envio uma requisição GET para "/channels/1"
    Then o código de status da resposta deve ser 200
    And a resposta deve conter um objeto de canal com "id" igual a 1 e "name" igual a "Canal de Filmes"

  Scenario: Tentar obter um canal com um ID que não existe
    When eu envio uma requisição GET para "/channels/999"
    Then o código de status da resposta deve ser 404
    And a resposta deve conter a mensagem de erro "Canal com o ID 999 não encontrado."

  Scenario: Atualizar o nome de um canal existente
    Given que existe um canal com id 5
    When eu envio uma requisição PATCH para "/channels/5" com o corpo:
      """
      {
        "name": "Novo Nome do Canal 5"
      }
      """
    Then o código de status da resposta deve ser 200
    And a resposta deve conter um objeto de canal com "id" igual a 5 e "name" igual a "Novo Nome do Canal 5"

  Scenario: Deletar um canal existente com sucesso
    Given que existe um canal com id 10
    When eu envio uma requisição DELETE para "/channels/10"
    Then o código de status da resposta deve ser 204
    And a resposta não deve ter corpo

