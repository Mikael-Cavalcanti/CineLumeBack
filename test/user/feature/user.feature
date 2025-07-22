Feature: Gerenciamento de Usuários

  Scenario: Criar um novo usuário com sucesso
    Given que eu possuo os seguintes dados válidos de um usuário:
      | nome       | email          | senha    | dataNascimento |
      | João Silva | joao@email.com | 12345678 | 1990-01-01     |
    When eu chamar o método de criação do usuário com esses dados
    Then o usuário deve ser criado com sucesso
    And deve ser retornado um objeto contendo id, nome, email e data de nascimento

  Scenario: Buscar um usuário existente pelo ID
    Given que exista no banco um usuário com id 1, nome "João Silva" e e-mail "joao@email.com"
    When eu chamar o método de busca passando o id 1
    Then o usuário deve ser retornado com id 1, nome "João Silva" e e-mail "joao@email.com"

  Scenario: Buscar um usuário existente pelo e-mail
    Given que exista no banco um usuário com e-mail "joao@email.com"
    When eu chamar o método de busca passando o e-mail "joao@email.com"
    Then o usuário deve ser retornado com id, nome, e-mail e data de nascimento preenchidos corretamente

  Scenario: Atualizar um usuário existente com sucesso
    Given que exista no banco um usuário com id 1
    And que eu possua os seguintes novos dados para atualização:
      | nome            | email                | senha    | dataNascimento |
      | João Atualizado | atualizado@email.com | nova1234 | 1991-05-20     |
    When eu chamar o método de atualização passando o id 1 e os novos dados
    Then o usuário deve ser atualizado com sucesso
    And deve ser retornado o usuário com os novos dados informados

  Scenario: Remover um usuário existente com sucesso
    Given que exista no banco um usuário com id 1
    When eu chamar o método de remoção passando o id 1
    Then o usuário deve ser removido com sucesso
    And não deve ser possível encontrá-lo mais no banco pelo id 1
