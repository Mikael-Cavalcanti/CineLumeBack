Feature: Gerenciamento de Vídeos
  Como um administrador do sistema,
  Eu quero poder criar, buscar, atualizar e deletar vídeos
  Para gerenciar o catálogo de conteúdo da plataforma.

  Background:
    Given que a API está em execução e um usuário administrador está autenticado.

  Scenario: Criar um novo vídeo com sucesso
    When eu envio uma requisição POST para "/videos/new" com dados válidos de um vídeo
    Then o código de status da resposta deve ser 201
    And a resposta deve conter os dados do vídeo criado.

  Scenario: Buscar um vídeo existente pelo ID
    Given que existe um vídeo no sistema com ID 1 e título "Matrix"
    When eu envio uma requisição GET para "/videos/find/1"
    Then o código de status da resposta deve ser 200
    And a resposta deve conter os dados do vídeo com título "Matrix".

  Scenario: Buscar um vídeo existente pelo título
    Given que existe um vídeo no sistema com o título "Matrix"
    When eu envio uma requisição GET para "/videos/find/Matrix"
    Then o código de status da resposta deve ser 200
    And a resposta deve conter os dados do vídeo com título "Matrix".

  Scenario: Tentar buscar um vídeo com um ID que não existe
    When eu envio uma requisição GET para "/videos/find/999"
    Then o código de status da resposta deve ser 404
    And a resposta deve conter a mensagem de erro "Video not found".

  Scenario: Atualizar um vídeo existente pelo ID
    Given que existe um vídeo com ID 1
    When eu envio uma requisição PATCH para "/videos/update/1" com o novo título "Matrix Reloaded"
    Then o código de status da resposta deve ser 200
    And a resposta deve conter os dados do vídeo atualizado com o título "Matrix Reloaded".

  Scenario: Deletar um vídeo existente
    Given que existe um vídeo com ID 1
    When eu envio uma requisição DELETE para "/videos/remove/1"
    Then o código de status da resposta deve ser 200
    And a resposta deve conter os dados do vídeo que foi removido.
