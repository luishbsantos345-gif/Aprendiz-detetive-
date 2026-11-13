import { existsSync } from "node:fs";
import { networkInterfaces } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Server } from "@colyseus/core";
import { WebSocketTransport } from "@colyseus/ws-transport";
import express from "express";
import { NOME_SALA, PORTA_PADRAO } from "@aprendiz/shared";
import { GameRoom } from "./rooms/GameRoom.ts";

const porta = Number(process.env.PORT ?? PORTA_PADRAO);
const servirCliente = process.env.SERVIR_CLIENTE === "1";
const pastaCliente = path.resolve(
  process.env.PASTA_CLIENTE ??
    path.join(path.dirname(fileURLToPath(import.meta.url)), "../../client/dist"),
);

const servidor = new Server({
  greet: false,
  transport: new WebSocketTransport({ pingInterval: 5000, pingMaxRetries: 3 }),
  express: (app) => {
    app.get("/health", (_req, res) => {
      res.json({ ok: true, servico: "aprendiz-detetive", uptime: Math.round(process.uptime()) });
    });

    if (servirCliente) {
      if (!existsSync(pastaCliente)) {
        console.warn(`[servidor] SERVIR_CLIENTE=1, mas ${pastaCliente} não existe. Rode "npm run build".`);
      } else {
        app.use(express.static(pastaCliente));
      }
    } else {
      app.get("/", (_req, res) => {
        res.type("text/plain").send("Servidor do Aprendiz Detetive no ar. O jogo fica no GitHub Pages.");
      });
    }
  },
});

servidor.define(NOME_SALA, GameRoom);

await servidor.listen(porta, "0.0.0.0");
console.log(`[servidor] escutando na porta ${porta}`);

if (servirCliente) {
  const ips = Object.values(networkInterfaces())
    .flat()
    .filter((i) => i && i.family === "IPv4" && !i.internal)
    .map((i) => i!.address);
  console.log("\n  Modo host local. Abra no celular (mesma rede Wi-Fi):\n");
  for (const ip of ips) console.log(`    http://${ip}:${porta}`);
  console.log(`\n  Neste computador: http://localhost:${porta}\n`);
}
