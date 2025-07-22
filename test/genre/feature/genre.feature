Feature: Gerenciamento de Gêneros

  In order to organizar os vídeos por categoria
  As um administrador
  I want to criar, listar, e associar gêneros aos vídeos

  Background:
    Given o banco de dados está limpo
    And existem os seguintes vídeos:
      | id  | title        |
      | 101 | Interestelar |
      | 102 | Matrix       |
    And existem os seguintes gêneros:
      | id | name      |
      | 1  | Ficção    |
      | 2  | Aventura  |

  Scenario: Criar um novo gênero com sucesso
    When uma requisição "POST" for enviada para "/genres" com o corpo:
      """
      {
        "name": "Ação"
      }
      """
    Then o status da resposta deve ser "201"
    And o JSON da resposta deve conter:
      | name | "Ação" |

  Scenario: Tentar criar um gênero que já existe
    When uma requisição "POST" for enviada para "/genres" com o corpo:
      """
      {
        "name": "Ficção"
      }
      """
    Then o status da resposta deve ser "409"
    And a mensagem de erro "O gênero 'Ficção' já existe." é retornada

  Scenario: Listar todos os gêneros
    When uma requisição "GET" for enviada para "/genres"
    Then o status da resposta deve ser "200"
    And o JSON da resposta deve conter uma lista com 2 itens
    And o item com name "Ficção" está presente
    And o item com name "Aventura" está presente

  Scenario: Associar um gênero a um vídeo com sucesso
    When uma requisição "POST" for enviada para "/genres/assign" com o corpo:
      """
      {
        "videoId": 101,
        "genreId": 1
      }
      """
    Then o status da resposta deve ser "201"
    And o JSON da resposta deve conter:
      | videoId | 101 |
      | genreId | 1   |

  Scenario: Listar vídeos de um gênero específico
    Given o gênero "Ficção" (id 1) foi associado ao vídeo "Interestelar" (id 101)
    When uma requisição "GET" for enviada para "/genres/1/videos"
    Then o status da resposta deve ser "200"
    And o JSON da resposta no caminho "data.videos" deve conter uma lista com 1 item
    And o item com title "Interestelar" está presente na lista "data.videos"

  Scenario: Remover uma associação de gênero de um vídeo
    Given o gênero "Ficção" (id 1) foi associado ao vídeo "Interestelar" (id 101)
    When uma requisição "DELETE" for enviada para "/genres/remove" com o corpo:
      """
      {
        "videoId": 101,
        "genreId": 1
      }
      """
    Then o status da resposta deve ser "204"

  Scenario: Tentar listar vídeos de um gênero inexistente
    When uma requisição "GET" for enviada para "/genres/999/videos"
    Then o status da resposta deve ser "404"
    And a mensagem de erro "Gênero com id 999 não encontrado." é retornada

  Scenario: Tentar associar um vídeo inexistente a um gênero
    When uma requisição "POST" for enviada para "/genres/assign" com o corpo:
      """
      {
        "videoId": 999,
        "genreId": 1
      }
      """
    Then o status da resposta deve ser "404"
    And a mensagem de erro "Vídeo com id 999 ou Gênero com id 1 não encontrado." é retornada
