# Registro de assets e licenças

Regra do projeto: só entra asset **CC0** ou **criado para o jogo**. Todo arquivo em
`client/public/assets/` precisa de uma linha aqui **antes** do commit.

## Assets

| Arquivo | Origem | Autor | Licença | Link | Marco |
|---|---|---|---|---|---|
| _(nenhum ainda)_ | | | | | |

No M0 não há nenhum asset externo: a cena de teste é geometria gerada em código
(`client/src/world/cenaTeste.ts`) e a interface usa a fonte do sistema.

## Fontes aprovadas

| Fonte | Licença | Observação |
|---|---|---|
| [Kenney](https://kenney.nl/assets) | CC0 | Modelos low-poly, UI, áudio |
| [Quaternius](https://quaternius.com) | CC0 | Personagens e móveis low-poly |
| [Poly Haven](https://polyhaven.com) | CC0 | Texturas e HDRIs |
| Mixamo (animações) | Licença Adobe, **não é CC0** | Uso em jogo é permitido, redistribuir os arquivos soltos não. **Verificar os termos atuais antes de usar** e registrar aqui a data da verificação |

## Bibliotecas de código (não são assets, mas ficam registradas)

| Pacote | Licença |
|---|---|
| three | MIT |
| @colyseus/core, @colyseus/sdk, @colyseus/schema, @colyseus/ws-transport | MIT |
| express | MIT |
| vite, esbuild, tsx, typescript, @playwright/test | MIT / Apache-2.0 |

## O que não pode entrar

Assets, nomes, marcas, personagens ou músicas de jogos existentes. A inspiração é só de mecânica.
