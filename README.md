# Aprendiz Detetive

FPS multiplayer de investigação e traição no navegador (computador e celular).
Aprendizes investigam um rombo no **Grupo Meridiano Distribuidora** enquanto um ou mais impostores ocultam provas, sabotam, subornam e eliminam colegas.

## Status

Projeto em fase de especificação. O roteiro completo de desenvolvimento está em [`PROMPT.md`](PROMPT.md), dividido em 8 marcos (M0–M7).

| Marco | Entrega | Status |
|---|---|---|
| M0 | Estrutura, CI e deploy | ⬜ |
| M1 | Movimento FPS desktop + mobile, Almoxarifado | ⬜ |
| M2 | Lobby e multiplayer sincronizado | ⬜ |
| M3 | Pistas, quadro de provas, papéis, votação — nível 1 | ⬜ |
| M4 | Combate, saque, eliminação, sequestro, sabotagem | ⬜ |
| M5 | NPCs, rendição/furto, procurado, área externa | ⬜ |
| M6 | Economia, suborno, níveis 2–5 | ⬜ |
| M7 | Polimento, áudio, presets de qualidade, tutorial | ⬜ |

## Como usar o roteiro

Abra uma sessão do Claude com este repositório conectado, cole o conteúdo de `PROMPT.md` e peça: **"Execute o marco M0"**. Faça um marco por sessão.

## Stack prevista

Three.js + Vite + TypeScript (cliente) · Node + Colyseus (servidor autoritativo) · Rapier (física) · GitHub Pages (cliente) + Render/Railway/Fly.io (servidor).
