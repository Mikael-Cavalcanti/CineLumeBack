Feature: Cadastro e Login de usuários

  Scenario: Cadastro de usuário com sucesso
    Given que não existe um usuário cadastrado com email "joao@example.com" e senha "Senha@123"
    When um novo usuário é criado com nome "João Silva", email "joao@example.com", senha "Senha@123" e data de nascimento "2000-01-01"
    Then o usuário é salvo no sistema com nome "João Silva", email "joao@example.com"
    And o usuário deve ser retornado com nome "João Silva"

    Scenario: Cadastro de usuário com email já existente
    Given que existe um usuário cadastrado com email "joao@example.com"