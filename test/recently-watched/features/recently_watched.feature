Feature: Assistidos Recentemente

  In order to manter um histórico de vídeos assistidos
  As um usuário autenticado
  I want to adicionar, listar e remover vídeos da minha lista de assistidos recentes

  Background:
    Given o banco de dados está limpo
    And existe um perfil com id 1
    And existem os seguintes vídeos:
      | id  | title              |
      | 101 | Interestelar       |
      | 102 | O Poderoso Chefão |

  # Cenário principal: adicionar vídeo à lista de assistidos recentemente
  Scenario: Adicionar vídeo à lista de assistidos recentemente
    When uma requisição "POST" for enviada para "/recently-watched" com o corpo:
      """
      {
        "profileId": 1,
        "videoId": 101
      }
      """
    Then o status da resposta deve ser "201"
    And o JSON da resposta deve conter:
      | profileId | 1   |
      | videoId   | 101 |

  # Listar os vídeos assistidos
  Scenario: Listar vídeos assistidos recentemente
    Given o vídeo com id 101 já foi adicionado à lista do perfil 1
    When uma requisição "GET" for enviada para "/recently-watched?profileId=1"
    Then o status da resposta deve ser "200"
    And o JSON da resposta deve conter uma lista com 1 item
    And o item com videoId "101" está presente

  # Remover vídeo da lista
  Scenario: Remover vídeo assistido recentemente
    Given o vídeo com id 101 já foi adicionado à lista do perfil 1
    When uma requisição "DELETE" for enviada para "/recently-watched/101?profileId=1"
    Then o status da resposta deve ser "200"
    And a mensagem de sucesso "Vídeo removido com sucesso" é retornada

  # Weakening the precondition - videoId inexistente
  Scenario: Adicionar vídeo inexistente à lista
    When uma requisição "POST" for enviada para "/recently-watched" com o corpo:
      """
      {
        "profileId": 1,
        "videoId": 999
      }
      """
    Then o status da resposta deve ser "404"
    And a mensagem de erro "Vídeo não encontrado" é retornada

  # Weakening the precondition - profileId inexistente
  Scenario: Adicionar vídeo com perfil inexistente
    When uma requisição "POST" for enviada para "/recently-watched" com o corpo:
      """
      {
        "profileId": 999,
        "videoId": 101
      }
      """
    Then o status da resposta deve ser "404"
    And a mensagem de erro "Perfil não encontrado" é retornada

  # Weakening the precondition - dados malformados
  Scenario: Enviar dados inválidos
    When uma requisição "POST" for enviada para "/recently-watched" com o corpo:
      """
      {
        "profileId": "abc",
        "videoId": true
      }
      """
    Then o status da resposta deve ser "400"
    And a mensagem de erro "Dados inválidos" é retornada
