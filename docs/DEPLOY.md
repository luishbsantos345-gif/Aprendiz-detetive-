# Deploy

São duas peças separadas: o **cliente** (arquivos estáticos, GitHub Pages) e o
**servidor** (Node + WebSocket, Render/Fly/Railway). O Pages não hospeda WebSocket.

## 1. Servidor

### Opção A: Render (mais simples, tem plano gratuito)

1. Crie a conta em <https://render.com> e conecte o GitHub.
2. **New → Blueprint** → escolha este repositório. O `render.yaml` na raiz já define tudo.
3. Espere o deploy e copie a URL, algo como `https://aprendiz-detetive-servidor.onrender.com`.
4. Confira: abrir `<URL>/health` deve responder `{"ok":true,...}`.

Limite conhecido do plano gratuito: o serviço dorme depois de ~15 min sem uso e a
primeira conexão seguinte demora perto de 1 minuto. Para sessão de jogo de verdade,
acorde o servidor abrindo `/health` antes, ou use um plano pago.

### Opção B: Fly.io (região São Paulo, menor latência)

```bash
fly launch --copy-config --no-deploy   # usa o fly.toml e o Dockerfile
fly deploy
```

### Opção C: Railway

New Project → Deploy from GitHub repo. O Railway detecta o `Dockerfile`. Em
Settings → Networking, gere o domínio público.

## 2. Cliente (GitHub Pages)

1. **Settings → Pages → Source: GitHub Actions**.
2. **Settings → Secrets and variables → Actions → Variables → New repository variable**
   - Nome: `VITE_SERVER_URL`
   - Valor: a URL do passo 1, com `https://`.
3. Faça merge na `main` (ou rode o workflow "Deploy do cliente" manualmente em Actions).

O jogo fica em `https://<usuario>.github.io/<repositorio>/`.

Atenção: no plano gratuito do GitHub, o Pages só publica repositório **público**.

## 3. Sem internet externa: modo host

```bash
npm install
npm run host
```

O notebook compila e serve jogo e servidor na porta 2567 e imprime o endereço
(`http://192.168.x.x:2567`). Os celulares na mesma rede Wi-Fi abrem esse endereço.
Se não abrir: firewall do notebook bloqueando a porta 2567, ou rede com isolamento
entre clientes (comum em Wi-Fi de escola/empresa). Nesse caso, use o roteador do celular.
