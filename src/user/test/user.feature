Feature: Gerenciar usuários no sistema

  Scenario: Criar um usuário com sucesso
    Given que não existe um usuário cadastrado com nome "João Silva", email "joao@example.com", senha "123456" e data de nascimento "2000-01-01"
    When um novo usuário é criado com nome "João Silva", email "joao@example.com", senha "123456" e data de nascimento "2000-01-01"
    Then o usuário é salvo no sistema com nome "João Silva", email "joao@example.com", senha "123456" e data de nascimento "2000-01-01"
    And o usuário deve ser retornado com ID "1"

  Scenario: Erro ao buscar um usuário com email inexistente
    Given existe um usuário cadastrado com nome "Maria", email "Maria@example.com"
    When é feita uma busca por usuário com email "josé@example.com"
    Then deve retornar "null" para o usuário com email "josé@example.com"