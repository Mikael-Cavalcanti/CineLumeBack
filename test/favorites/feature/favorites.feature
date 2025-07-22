Feature: Gerenciamento de Filmes Favoritos
  Como um usuário autenticado da API,
  Eu quero poder adicionar, remover e listar meus filmes favoritos
  Para que eu possa manter uma lista pessoal dos filmes que mais gosto.

  Background:
    Given que a API está em execução e pronta para receber requisições
    And que existe um usuário no sistema com id "user123" e um token de autenticação válido
    And que existe um filme no sistema com id "filme456" e nome "A Origem"

  Scenario: Adicionar um filme à lista de favoritos com sucesso
    When eu, como usuário "user123", envio uma requisição POST para "/usuarios/user123/favoritos" com o corpo:
      """
      {
        "filmeId": "filme456"
      }
      """
    Then o código de status da resposta deve ser 200
    And a resposta deve conter a lista de favoritos do usuário, incluindo o filme "A Origem"

  Scenario: Listar os filmes favoritos de um usuário
    Given que o usuário "user123" já favoritou o filme com id "filme456"
    When eu, como usuário "user123", envio uma requisição GET para "/usuarios/user123/favoritos"
    Then o código de status da resposta deve ser 200
    And a resposta deve ser uma lista contendo 1 filme
    And o primeiro item da lista deve ser o filme com nome "A Origem"

  Scenario: Remover um filme da lista de favoritos
    Given que o usuário "user123" já favoritou o filme com id "filme456"
    When eu, como usuário "user123", envio uma requisição DELETE para "/usuarios/user123/favoritos/filme456"
    Then o código de status da resposta deve ser 204
    And a resposta não deve ter corpo

  Scenario: Tentar adicionar um filme que já está na lista de favoritos
    Given que o usuário "user123" já favoritou o filme com id "filme456"
    When eu, como usuário "user123", envio uma requisição POST para "/usuarios/user123/favoritos" com o corpo:
      """
      {
        "filmeId": "filme456"
      }
      """
    Then o código de status da resposta deve ser 409
    And a resposta deve conter a mensagem de erro "Este filme já está na sua lista de favoritos."

  Scenario: Tentar adicionar um filme que não existe à lista de favoritos
    When eu, como usuário "user123", envio uma requisição POST para "/usuarios/user123/favoritos" com o corpo:
      """
      {
        "filmeId": "filmeInexistente999"
      }
      """
    Then o código de status da resposta deve ser 404
    And a resposta deve conter a mensagem de erro "Filme com o ID filmeInexistente999 não encontrado."

  Scenario: Tentar remover um filme que não está na lista de favoritos
    When eu, como usuário "user123", envio uma requisição DELETE para "/usuarios/user123/favoritos/filmeQueNaoEhFavorito"
    Then o código de status da resposta deve ser 404
    And a resposta deve conter a mensagem de erro "Este filme não está na sua lista de favoritos."

