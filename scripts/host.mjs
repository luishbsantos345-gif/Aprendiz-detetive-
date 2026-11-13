// Modo host local: um notebook serve o jogo e o servidor na mesma porta.
// Os celulares na mesma rede Wi-Fi abrem http://IP-DO-NOTEBOOK:2567.
import { spawnSync, spawn } from "node:child_process";

const npm = process.platform === "win32" ? "npm.cmd" : "npm";
const shell = process.platform === "win32";

if (!process.argv.includes("--sem-build")) {
  console.log("[host] compilando cliente e servidor...");
  const build = spawnSync(npm, ["run", "build"], {
    stdio: "inherit",
    shell,
    // Sem VITE_SERVER_URL o cliente conecta na mesma origem da página.
    env: { ...process.env, VITE_SERVER_URL: "" },
  });
  if (build.status !== 0) process.exit(build.status ?? 1);
}

const servidor = spawn(npm, ["run", "start", "-w", "server"], {
  stdio: "inherit",
  shell,
  env: { ...process.env, SERVIR_CLIENTE: "1" },
});
servidor.on("exit", (codigo) => process.exit(codigo ?? 0));
for (const sinal of ["SIGINT", "SIGTERM"]) process.on(sinal, () => servidor.kill(sinal));
