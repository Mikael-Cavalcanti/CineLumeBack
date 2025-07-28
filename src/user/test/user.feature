Feature: Gerenciar usuários no sistema

  Scenario Outline: Criar um usuário com sucesso
    Given que não existe um usuário cadastrado com nome "<nome>", email "<email>", senha "<senha>" e data de nascimento "<nascimento>" e id "<id>"
    When um novo usuário é criado com nome "<nome>", email "<email>", senha "<senha>" e data de nascimento "<nascimento>"
    Then o usuário é salvo no sistema com nome "<nome>", email "<email>", senha "<senha>" e data de nascimento "<nascimento>" e id "<id>"
    And o usuário deve ser retornado com ID "<id>"
    Examples:
      | nome        | email             | senha     | nascimento | id |
      | João Silva  | joao@example.com  | Senha@123 | 2000-01-01 | 1  |
      | Maria Souza | Maria@example.com | Senha@456 | 1995-05-15 | 2  |

  Scenario: Erro ao buscar um usuário com email inexistente
    Given existe um usuário cadastrado com nome "Maria", email "Maria@example.com"
    When é feita uma busca por usuário com email "josé@example.com"
    Then deve retornar "null" para o usuário com email "josé@example.com"

  Scenario: Atualizar um usuário com sucesso
    Given que existe um usuário cadastrado com id "1", nome "João Silva", email "joao@example.com", senha "123456" e data de nascimento "2000-01-01"
    When o usuário com id "1" é atualizado para "João da Silva" com email "joao@example.com", senha "123456" e data de nascimento "2000-01-01"
    Then o usuário é atualizado no sistema com nome "João da Silva", email "joao@example.com", senha "123456" e data de nascimento "2000-01-01"

  Scenario: Remover um usuário com sucesso
    Given que existe um usuário cadastrado com id "1", nome "João Silva", email "joao@example.com", senha "123456" e data de nascimento "2000-01-01"
    When o usuário com id "1" é removido do sistema
    Then o usuário com id "1" deve retornar "null" ao ser buscado

  Scenario: Buscar usuário existente por ID
    Given que existe um usuário cadastrado com id "1"
    When faço uma requisição GET para "/user/1"
    Then a resposta deve ter status 200
    And a resposta deve conter o usuário com id "1"