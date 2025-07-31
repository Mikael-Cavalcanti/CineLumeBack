Feature: Cadastro e Login de usuários

Feature: Cadastro e Login de usuários

  Scenario Outline: Cadastro de usuário com sucesso
    Given que não existe um usuário cadastrado
    When um novo usuário é criado com id "<id>", nome "<nome>", email "<email>", senha "<senha>" e data de nascimento "<nascimento>"
    And é criado um perfil do usuário "<id>" com nome "<nome>", isKid "false" e avatar "<avatar>"
    And é criado um token "<token>" para o usuário com id "<id>"
    Then o usuário é salvo no sistema com nome "<nome>", email "<email>"
    And o id do perfil tem que ser "<id>" do usuário
    And o usuário com id "<id>" recebe o token de autenticação "<token>"
    Examples:
      | id | nome        | email             | senha     | nascimento | token       | avatar                     |
      | 1  | João Silva  | joao@example.com  | Senha@123 | 2000-01-01 | token123456 | example.com.br/avatar1.png |
      | 2  | Maria Souza | maria@example.com | Senha@456 | 1995-05-15 | token654321 | example.com.br/avatar2.png |

  Scenario Outline: Login de usuário com sucesso
    Given que existe um usuário cadastrado com email "<email>" e senha "<senha>", id "<id>", nome "<nome>" e nascimento "<nascimento>"
    And o token "<token>" para o usuário com id "<id>" ainda não está expirado
    When o usuário tenta fazer login com email "<email>" e senha "<senha>"
    Then o login é bem-sucedido e o retorna o token de autenticação "<token>" para o usuário com id "<id>"
    Examples:
      | id | nome        | email             | senha     | nascimento | token       |
      | 1  | João Silva  | joao@example.com  | Senha@123 | 2000-01-01 | token123456 |
      | 2  | Maria Souza | maria@example.com | Senha@456 | 1995-05-15 | token654321 |
