# Comando de desenvolvimento — "Aprendiz Detetive"

> Cole este comando inteiro na sessão do Claude (Fable 5) com o repositório `aprendiz-detetive` conectado.
> Trabalhe **um marco por sessão**. Ao final de cada marco: commit, push, deploy e checklist de testes.

---

## 1. Papel e missão

Você é um engenheiro sênior de jogos web (Three.js + multiplayer autoritativo). Construa **Aprendiz Detetive**: um FPS multiplayer de investigação social com dedução e traição, ambientado numa empresa fictícia e no quarteirão ao redor dela, rodando no navegador em computador e celular.

Prioridades, nesta ordem: **(1) roda liso em celular intermediário, (2) multiplayer estável, (3) imersão visual, (4) quantidade de conteúdo.** Se um recurso ameaçar 1 ou 2, corte ou simplifique e registre a decisão em `docs/DECISOES.md`.

## 2. Premissa e narrativa

Empresa fictícia: **Grupo Meridiano Distribuidora**. Na segunda-feira de manhã, a auditoria descobre um rombo: notas fiscais duplicadas, estoque que some, folha de pagamento com funcionário-fantasma. Os jogadores são aprendizes recém-contratados que o diretor convoca para investigar antes da auditoria externa chegar. Entre eles há **um ou mais impostores** a serviço de quem montou o esquema.

Cada nível é um "dia" da investigação, com um caso administrativo próprio:

| Nível | Caso | Pistas típicas | Setores-chave |
|---|---|---|---|
| 1 — Segunda | Estoque fantasma | fichas de inventário, câmera do almoxarifado, nota de entrada rasurada | Almoxarifado, Área externa (doca) |
| 2 — Terça | Notas duplicadas | boletos, extrato, e-mail impresso, carimbo falso | Financeiro, Sala de informática |
| 3 — Quarta | Funcionário-fantasma | ficha de admissão, crachá, folha de ponto | RH, Copa |
| 4 — Quinta | Licitação combinada | pen drive, log de acesso, cardápio com anotação | Sala de informática, Cozinha |
| 5 — Sexta | O mandante | todas as provas anteriores + depoimento final | Todos + rua |

Narrativa entregue por: rádio/intercomunicador do diretor (texto + áudio TTS opcional), bilhetes no cenário, telas de computador interativas, cutscene curta em câmera fixa no início de cada nível (máx. 15 s, pulável).

## 3. Loop de jogo

1. **Lobby** (4–12 jogadores): código de sala de 5 letras; host define nº de impostores (1–3), duração dos níveis, fogo amigo on/off.
2. **Sorteio secreto de papéis**: Investigador ou Impostor. Impostores se veem entre si.
3. **Fase de investigação** (6–8 min por nível): explorar setores, coletar pistas, interagir com NPCs.
4. **Quadro de provas compartilhado**: pistas coletadas vão para um quadro de cortiça 3D na sala de reunião e para um painel em tela (tecla `Tab` / botão no mobile). Ligar pistas com "fios" para montar a teoria do caso. Cada nível exige um conjunto mínimo de pistas conectadas corretamente para "resolver".
5. **Reunião de emergência**: qualquer jogador pode convocar (1x por nível) ou é automática ao encontrar um corpo. Chat de texto + chat rápido por ícones. Votação para afastar um suspeito (empate = ninguém sai).
6. **Fim do nível**: caso resolvido → próximo nível. Caso não resolvido no tempo → penalidade (menos tempo no próximo nível).

### Condições de vitória
- **Investigadores**: resolver o nível 5 **ou** eliminar/afastar todos os impostores.
- **Impostores**: sobreviver sem ser descobertos até o fim do nível 5 **ou** reduzir investigadores vivos a número igual ao de impostores **ou** destruir provas suficientes para que o caso do nível atual fique impossível.

## 4. Mecânicas do impostor

- **Ocultar provas**: pegar uma pista e escondê-la (gaveta, lixeira, triturador). Pistas trituradas somem; escondidas podem ser reencontradas. Cada ação deixa **vestígio** (papel picado, gaveta aberta, registro no log do computador) que pode virar pista contra ele.
- **Flagrante**: se um investigador tem o impostor no campo de visão (raycast + distância ≤ 12 m) durante uma ação suspeita, recebe um alerta "Você viu algo" e uma **pista de flagrante** com nome do autor. Vale como prova na votação.
- **Eliminar**: ataque corpo a corpo silencioso por trás (animação de 1,5 s; vítima pode reagir se virar a tempo) ou com arma (barulho alerta jogadores num raio). Corpo fica no chão até ser encontrado ou escondido em contêiner.
- **Sequestrar**: render (vítima com vida baixa ou desarmada), carregar até um ponto de cativeiro (depósito, porta-malas na área externa). Vítima sequestrada fica fora de jogo, mas pode ser **resgatada** por investigadores dentro de 90 s. Sequestrado pode usar 1 "grito" que revela sua sala.
- **Sabotagem**: apagar luzes de um setor, travar porta por 20 s, derrubar câmeras de segurança. Cooldown por sabotagem.
- **Disfarce**: entrar em dutos de ventilação entre setores conectados.

## 5. Suborno e economia

- **Moedas** (💰 "Meridianos"): ganhas resolvendo pistas, furtando NPCs, saqueando corpos, cumprindo microtarefas (arquivar pasta, repor estoque).
- **Favores** (cartas): "Álibi" (te coloca em outra sala no log), "Silêncio" (anula 1 voto contra você), "Chave mestra" (abre porta trancada), "Dica" (revela localização de 1 pista).
- **Loja** na máquina de café da copa: colete, munição, lanterna, kit médico, upgrade de lanterna, scanner de digitais.
- **Suborno**: impostor abre proposta privada a um investigador (moedas e/ou favores). O alvo vê só a proposta, não confirma que o remetente é impostor (mas pode denunciar a proposta na reunião como pista — a proposta vira prova com 50% de chance de mostrar o remetente). Se aceitar, vira impostor no início do próximo nível e recebe o pagamento. Limite: 1 conversão por partida por impostor.

## 6. Combate e saque

- Armas: faca, cassetete, pistola, revólver, espingarda (rara, na área externa), extintor (empurra/atordoa), objetos arremessáveis (grampeador, caneca).
- Vida 100, colete 50. Sem regeneração; kit médico cura.
- **Saque**: todo jogador ou NPC derrubado solta suas armas, munição e moedas em um item flutuante saqueável (segure `E` / botão por 1 s).
- Violência estilizada: ragdoll e queda, **sem gore, sem sangue detalhado, sem desmembramento**. Efeito de impacto = faísca/poeira + flash de tela. Isso mantém classificação indicativa mais baixa e o desempenho alto.

## 7. NPCs (quase mundo aberto)

Implementar uma máquina de estados (ou behavior tree leve) por NPC com perfis:

| Tipo | Onde | Comportamento padrão | Ao ser ameaçado/atacado |
|---|---|---|---|
| Colega de trabalho | Todos os setores | rotina (mesa → copa → banheiro), diálogo com pista | 60% foge/se rende, 30% soco, 10% puxa faca |
| Gestor | RH, Financeiro | rotina + reuniões; pode ter cofre/chave | 50% se rende e entrega chave, 50% saca pistola |
| Segurança | Portaria, área externa | patrulha; persegue quem ataca à vista | atira, chama reforço (2º segurança) |
| Cliente | Recepção, loja da frente | espera, reclama, compra | 70% foge gritando, 30% soco |
| Pedestre | Rua | caminha por waypoints, atravessa faixa | foge, se rende (mãos para cima), alguns revidam com soco ou arma |
| Ambulante/motorista | Rua, estacionamento | parado / dirigindo devagar | foge de carro / sai e briga |

Regras gerais de NPC:
- **Mira para ameaçar** (sem atirar) → NPC entra em estado "rendido" e pode ser **furtado** (moedas, chaves, armas, às vezes pista).
- **Alerta em cadeia**: tiro ou grito alerta NPCs num raio; alguns fogem, alguns ligam para a segurança.
- **Sistema de procurado** (0–3 estrelas, por jogador): crimes à vista de NPCs sobem o nível; nível 3 traz equipe de segurança armada. Diminui ficando fora de vista 30 s. Crimes vistos por NPC também geram **pista de testemunha** ("vi alguém de crachá azul no financeiro").
- NPCs mortos ou rendidos podem ser saqueados como jogadores.
- População: 15–25 NPCs ativos, com LOD de IA (NPC longe do jogador = atualização a 2 Hz e sem animação).

## 8. Mapa e cenários

Um único mapa contínuo, sem loading entre áreas:

- **Prédio de 2 andares**: Recepção, Almoxarifado (prateleiras altas, empilhadeira, doca), Copa (máquina de café = loja), Cozinha (câmara fria = esconderijo), Sala de informática (servidores, computadores com telas interativas), RH (arquivos de aço, sala de entrevista), Financeiro (cofre, vidros), Sala de reunião (quadro de provas), dutos de ventilação.
- **Área externa**: estacionamento, doca de carga, guarita, lixeiras, rua com calçada, faixa de pedestre, 2–3 fachadas de comércio (padaria, loja de conveniência), ponto de ônibus.
- Cada setor tem **identidade de cor e luz** distinta para orientação rápida (ex.: almoxarifado âmbar industrial, informática azul frio, RH bege quente, financeiro verde-vidro).
- Pistas spawnam em pontos sorteados entre 3–5 candidatos por pista, para cada partida ser diferente.

## 9. Gráficos e imersão (navegador)

- **Three.js r16x+** com `WebGLRenderer` (fallback) e `WebGPURenderer` quando disponível.
- Estilo **low-poly realista estilizado** (pense em jogos indie de investigação), não fotorrealismo — é o que roda em celular.
- Iluminação: lightmaps baked no Blender para o interior + 1 luz direcional dinâmica com sombras em cascata (desktop) / sem sombras dinâmicas (mobile baixo). Light probes para personagens.
- Pós-processamento (desktop alto): SSAO/GTAO, bloom suave, color grading por setor (LUT), vinheta, film grain leve. Mobile: só color grading + FXAA.
- **3 presets de qualidade** (Baixo/Médio/Alto) + detecção automática por FPS nos primeiros 10 s.
- Assets: **somente CC0 ou criados**. Fontes: Kenney, Quaternius, Poly Haven (texturas/HDRI), Mixamo para animações (verificar licença). Modelos em **glTF/GLB com compressão Draco/Meshopt + texturas KTX2**.
- Desempenho: instancing para móveis repetidos, occlusion por salas (portais), LOD, orçamento de **≤ 150 draw calls e ≤ 300k triângulos visíveis no mobile**.
- Áudio espacial (Web Audio / `PositionalAudio`): passos com material do piso, ambiência por setor (ar-condicionado, chuva lá fora, trânsito), trilha dinâmica que sobe quando há perigo, áudio abafado atrás de portas.
- Imersão: lanterna com sombra própria, apagão por sabotagem, chuva na área externa, ciclo de hora do dia avançando a cada nível (manhã → noite na sexta).

## 10. Controles

**Computador**: WASD mover, mouse mirar (Pointer Lock), `Shift` correr, `Ctrl` agachar, `E` interagir/saquear, `F` ameaçar/render, `Q` habilidade de impostor, `R` recarregar, `1–5` armas, `Tab` quadro de provas, `T` chat, `M` mapa, `V` chamar reunião.

**Mobile** (detecção por `pointer: coarse` + toque):
- Joystick virtual à esquerda (mover), arrastar na metade direita (mirar), sensibilidade ajustável.
- Botões à direita: Atirar, Interagir (contextual: muda ícone conforme o alvo), Pular/Agachar, Recarregar, Trocar arma.
- Botões superiores: Quadro de provas, Mapa, Reunião, Habilidade de impostor (só aparece para impostor).
- Auto-mira leve opcional no mobile. Layout reposicionável e salvo em `localStorage` (com try/catch).
- Forçar orientação paisagem com aviso; tela cheia ao entrar no jogo.

## 11. Arquitetura técnica

```
aprendiz-detetive/
├── client/          # Vite + TypeScript + Three.js
│   ├── src/
│   │   ├── core/        # loop, input (desktop/mobile), assets, qualidade
│   │   ├── world/       # mapa, setores, portais, iluminação
│   │   ├── player/      # câmera FPS, movimento, armas
│   │   ├── npc/         # IA, rotinas, reações, procurado
│   │   ├── evidence/    # pistas, quadro de provas, flagrante
│   │   ├── net/         # cliente Colyseus, interpolação, predição
│   │   └── ui/          # HUD, menus, controles touch, chat
│   └── public/assets/
├── server/          # Node + Colyseus (autoritativo)
│   └── src/rooms/       # GameRoom: papéis, níveis, combate, NPCs, economia
├── shared/          # tipos, constantes, schemas
└── docs/            # DECISOES.md, ASSETS.md (licenças), COMO-JOGAR.md
```

- **Servidor autoritativo** (Colyseus): papéis, vida, dano, saque, economia, pistas, votos e IA de NPC rodam no servidor. Cliente só envia input. Isso impede trapaça (ex.: cliente descobrir quem é impostor pelo tráfego). **Nunca envie o papel de outro jogador para clientes que não devem saber.**
- Tick do servidor 20 Hz; cliente com predição de movimento e interpolação de entidades remotas; hit detection por *lag compensation* simples (rewind de 200 ms).
- Física: Rapier (WASM) no servidor para colisão de personagens e projéteis por raycast.
- **Deploy**: cliente no **GitHub Pages** via GitHub Actions; servidor em Render / Railway / Fly.io (GitHub Pages não hospeda WebSocket). URL do servidor por variável de ambiente `VITE_SERVER_URL`.
- Modo **"host local"**: rodar o servidor num notebook na mesma rede Wi-Fi (`npm run host`) e os celulares se conectam pelo IP — útil se a rede bloquear serviços externos.

## 12. Marcos de entrega (um por sessão)

| Marco | Entrega | Critério de pronto |
|---|---|---|
| **M0** | Monorepo, Vite, Colyseus, CI, deploy Pages + servidor | Página abre no celular e conecta na sala |
| **M1** | Movimento FPS desktop + mobile, 1 setor (Almoxarifado) com iluminação final | 60 fps desktop, ≥ 30 fps celular médio |
| **M2** | Multiplayer: lobby, código de sala, 8 jogadores andando sincronizados | Sem teleporte visível com 150 ms de latência |
| **M3** | Pistas, quadro de provas, papéis, reunião e votação, nível 1 jogável | Partida completa de 1 nível com 4 pessoas |
| **M4** | Combate, armas, saque, eliminação, sequestro, sabotagem, flagrante | Impostor consegue vencer e perder de formas diferentes |
| **M5** | NPCs (todos os perfis), rendição/furto, procurado, área externa e rua | 20 NPCs ativos sem queda abaixo de 30 fps no celular |
| **M6** | Economia, loja, suborno, favores; níveis 2–5 com narrativa | Campanha completa jogável do início ao fim |
| **M7** | Polimento: áudio, pós-processamento, presets, tutorial, acessibilidade | Teste com 10 jogadores reais sem bug bloqueante |

## 13. Regras de trabalho

- Antes de codar cada marco, liste em 5–10 linhas o plano e os arquivos afetados.
- Teste no navegador headless (Playwright) com screenshot desktop e viewport de celular (390×844, paisagem).
- Rode com 2+ clientes simultâneos para validar sincronização.
- Registre toda licença de asset em `docs/ASSETS.md`.
- Não use assets, nomes, marcas, personagens ou músicas de jogos existentes (GTA, Among Us etc.); a inspiração é só de mecânica.
- Commits pequenos e descritivos em português.
- Ao terminar o marco: atualize `README.md` com como rodar, link do deploy e o que falta.
