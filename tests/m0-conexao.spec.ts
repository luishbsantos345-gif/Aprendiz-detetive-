import { expect, test, type Page } from "@playwright/test";

const DESKTOP = { width: 1280, height: 720 };
// 390×844 deitado, como pede a regra de trabalho.
const CELULAR_PAISAGEM = { width: 844, height: 390 };

async function semErrosDeConsole(page: Page): Promise<string[]> {
  const erros: string[] = [];
  page.on("pageerror", (e) => erros.push(e.message));
  return erros;
}

test("dois clientes (desktop e celular) entram na mesma sala", async ({ browser }, info) => {
  const desktop = await browser.newContext({ viewport: DESKTOP });
  const celular = await browser.newContext({
    viewport: CELULAR_PAISAGEM,
    isMobile: true,
    hasTouch: true,
    deviceScaleFactor: 2,
  });
  const a = await desktop.newPage();
  const b = await celular.newPage();
  const errosA = await semErrosDeConsole(a);
  const errosB = await semErrosDeConsole(b);

  // Cliente A cria a sala.
  await a.goto("/");
  await a.locator("#campo-nome").fill("Ana");
  await a.locator("#botao-criar").click();
  await expect(a.locator("#estado-conexao")).toHaveText("Conectado");
  const codigo = (await a.locator("#codigo-sala").textContent())?.trim() ?? "";
  expect(codigo).toMatch(/^[A-HJ-NP-Z]{5}$/);

  // Cliente B (celular) entra pelo código, digitado em minúsculas de propósito.
  await b.goto("/");
  await expect(b.locator("#aviso-paisagem")).toBeHidden();
  await b.locator("#campo-nome").fill("Bruno");
  await b.locator("#campo-codigo").fill(codigo.toLowerCase());
  await b.locator("#botao-entrar").tap();
  await expect(b.locator("#estado-conexao")).toHaveText("Conectado");
  await expect(b.locator("#codigo-sala")).toHaveText(codigo);

  // Os dois enxergam os dois jogadores, e só a Ana é anfitriã.
  for (const pagina of [a, b]) {
    await expect(pagina.locator("#lista-jogadores li")).toHaveCount(2);
    await expect(pagina.locator("#lista-jogadores")).toContainText("Ana (anfitrião)");
    await expect(pagina.locator("#lista-jogadores")).toContainText("Bruno");
  }

  // Nada pode estourar a tela do celular em paisagem.
  const transborda = await b.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth,
  );
  expect(transborda).toBe(false);
  await expect(b.locator("#botao-sair")).toBeInViewport();

  await a.screenshot({ path: info.outputPath("desktop-1280x720.png") });
  await b.screenshot({ path: info.outputPath("celular-844x390.png") });

  // Saída do anfitrião: a sala continua e o Bruno herda o posto.
  await a.locator("#botao-sair").click();
  await expect(b.locator("#lista-jogadores li")).toHaveCount(1);
  await expect(b.locator("#lista-jogadores")).toContainText("Bruno (anfitrião)");

  expect(errosA).toEqual([]);
  expect(errosB).toEqual([]);
  await desktop.close();
  await celular.close();
});

test("código inexistente mostra erro legível", async ({ page }) => {
  await page.setViewportSize(CELULAR_PAISAGEM);
  await page.goto("/");
  await page.locator("#campo-codigo").fill("ZZZZZ");
  await page.locator("#botao-entrar").click();
  await expect(page.locator("#mensagem")).toHaveText("Sala não encontrada. Confira o código.");
});

test("celular em retrato recebe o aviso de girar", async ({ browser }) => {
  const contexto = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  });
  const page = await contexto.newPage();
  await page.goto("/");
  await expect(page.locator("#aviso-paisagem")).toBeVisible();
  await contexto.close();
});
