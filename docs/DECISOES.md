# Registro de decisões

| Data | Decisão | Motivo |
|---|---|---|
| 2026-11-13 | Violência estilizada, sem gore | Público de jovens aprendizes; desempenho no mobile |
| 2026-11-13 | Empresa fictícia (Grupo Meridiano) | Evitar associação com empresas parceiras reais |
| 2026-11-13 | Servidor separado do GitHub Pages | Pages não hospeda WebSocket |
| 2026-11-13 | Desenvolvimento em 8 marcos | Escopo grande demais para uma sessão |
| 2026-11-13 | M0: npm workspaces (`shared`, `server`, `client`), sem Turborepo/Nx | Três pacotes pequenos; ferramenta extra só adicionaria ponto de falha |
| 2026-11-13 | M0: Colyseus 0.18 via `@colyseus/core` + `@colyseus/ws-transport`, sem o pacote guarda-chuva `colyseus` | O guarda-chuva puxa Redis, monitor e playground, que não usamos; imagem e instalação menores |
| 2026-11-13 | M0: estado da sala com `schema()`/`t.*` do `@colyseus/schema` 5, sem decorators | Evita depender de `experimentalDecorators` no esbuild/tsx |
| 2026-11-13 | M0: código da sala é o próprio `roomId` do Colyseus (5 letras, sem I e O) | Entrar por código vira um `joinById`, sem tabela extra; I/O confundem com 1/0 ao ditar |
| 2026-11-13 | M0: `shared` é consumido como TypeScript-fonte (alias no Vite e no esbuild), sem build próprio | Um passo de build a menos; o servidor sai num único arquivo |
| 2026-11-13 | M0: modo host serve cliente e servidor na **mesma porta** (2567) | Página HTTPS do Pages não pode abrir `ws://` de um IP local (conteúdo misto); servindo tudo do notebook em HTTP o problema some |
| 2026-11-13 | M0: `base: "./"` no Vite | O mesmo build funciona no Pages (subpasta), no host local (raiz) e em qualquer outro host |
| 2026-11-13 | M0: endereço do servidor = `?servidor=` → `VITE_SERVER_URL` → mesma origem | Permite testar outro servidor sem refazer o build do Pages |
| 2026-11-13 | M0: papel do jogador **nunca** entra no schema público da sala | O schema é replicado para todos; papel irá por mensagem privada/StateView no M3 |
| 2026-11-13 | M0: cena 3D de teste gerada em código (caixas em instancing), sem asset externo | Prova que o renderer sobe no aparelho sem abrir pendência de licença; sai no M1 |
| 2026-11-13 | M0: WebGPURenderer adiado | Prioridade 1 é celular intermediário; WebGL é o caminho garantido. Reavaliar no M7 |
| 2026-11-13 | M0: CORS do matchmaking fica no padrão do Colyseus (aceita qualquer origem) | Não há dado sensível no M0. **Pendência:** restringir à origem do Pages antes do M3 (papéis secretos) |
| 2026-11-13 | M0: Rapier ainda não instalado | Não há física no M0; entra no M1/M2 junto com o movimento |
