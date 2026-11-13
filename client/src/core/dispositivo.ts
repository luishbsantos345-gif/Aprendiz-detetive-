/** Detecção de aparelho de toque, conforme a especificação: pointer coarse + toque. */
export function ehToque(): boolean {
  const grosso = window.matchMedia?.("(pointer: coarse)").matches ?? false;
  return grosso && (navigator.maxTouchPoints > 0 || "ontouchstart" in window);
}

/** Tela cheia e trava de paisagem. Ambos podem ser negados pelo navegador (iOS). */
export async function entrarTelaCheiaPaisagem(): Promise<void> {
  if (!ehToque()) return;
  try {
    if (!document.fullscreenElement) await document.documentElement.requestFullscreen?.();
  } catch {
    /* iPhone não suporta tela cheia em páginas comuns */
  }
  try {
    const orientacao = screen.orientation as ScreenOrientation & {
      lock?: (o: string) => Promise<void>;
    };
    await orientacao.lock?.("landscape");
  } catch {
    /* sem trava: o aviso "gire o celular" cobre esse caso */
  }
}

export function lerLocal(chave: string): string | null {
  try {
    return localStorage.getItem(chave);
  } catch {
    return null;
  }
}

export function gravarLocal(chave: string, valor: string): void {
  try {
    localStorage.setItem(chave, valor);
  } catch {
    /* modo privado ou armazenamento bloqueado */
  }
}
