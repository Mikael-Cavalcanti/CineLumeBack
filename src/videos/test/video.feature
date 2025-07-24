Feature: Gerenciar vídeos no sistema

  Background:
    Given que os dados padrão do vídeo são título "Os Vingadores: Guerra Infinita", descrição "União de heróis da Marvel", ano de lançamento "2018", duração "9000", tipo "Ação", url "example.com.br/guerraInfinita.mp4", classificação etária "12", e thumbnail "example.com.br/guerraInfinita.png"
    And o ID padrão do vídeo é "1"

  Scenario: Criar um vídeo com sucesso
    When um novo vídeo é criado
    Then o vídeo deve ser salvo no sistema com os dados informados
    And o vídeo deve ser retornado com ID "1"

  Scenario: Atualizar um vídeo existente com sucesso
    When o vídeo é atualizado com novo tipo "Aventura"
    Then o vídeo deve ser atualizado no sistema com tipo "Aventura"
