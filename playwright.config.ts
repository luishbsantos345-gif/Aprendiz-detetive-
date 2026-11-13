import { defineConfig } from "@playwright/test";

const PORTA = 2599;

export default defineConfig({
  testDir: "tests",
  timeout: 30_000,
  fullyParallel: false,
  workers: 1,
  reporter: process.env.CI ? [["github"], ["list"]] : "list",
  use: { baseURL: `http://localhost:${PORTA}`, trace: "off" },
  // Sobe o mesmo binário do modo host: servidor de jogo servindo o cliente compilado.
  webServer: {
    command: "node scripts/host.mjs",
    url: `http://localhost:${PORTA}/health`,
    env: { PORT: String(PORTA) },
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
