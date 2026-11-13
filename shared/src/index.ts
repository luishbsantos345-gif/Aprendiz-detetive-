/**
 * Constantes e tipos compartilhados entre cliente e servidor.
 * Nada aqui pode depender de Node ou do DOM.
 */

/** Nome do tipo de sala registrado no Colyseus. */
export const NOME_SALA = "jogo";

/** Porta padrão do servidor de jogo. */
export const PORTA_PADRAO = 2567;

/** Tick da simulação autoritativa (usado a partir do M2). */
export const TICK_HZ = 20;

export const MIN_JOGADORES = 4;
export const MAX_JOGADORES = 12;

export const TAMANHO_CODIGO = 5;
/** Sem I e O para não confundir com 1 e 0 ao ditar o código em voz alta. */
export const ALFABETO_CODIGO = "ABCDEFGHJKLMNPQRSTUVWXYZ";

export const TAMANHO_MAX_NOME = 16;

/** Opções enviadas pelo cliente ao criar ou entrar numa sala. */
export interface OpcoesEntrada {
  nome?: string;
}

/** Mensagens cliente → servidor. */
export const MSG = {
  PING: "ping",
  PONG: "pong",
} as const;

export function gerarCodigoSala(aleatorio: () => number = Math.random): string {
  let codigo = "";
  for (let i = 0; i < TAMANHO_CODIGO; i++) {
    codigo += ALFABETO_CODIGO[Math.floor(aleatorio() * ALFABETO_CODIGO.length)];
  }
  return codigo;
}

/** Normaliza o que o jogador digitou; devolve null se não for um código válido. */
export function normalizarCodigoSala(entrada: string): string | null {
  const codigo = entrada.trim().toUpperCase();
  if (codigo.length !== TAMANHO_CODIGO) return null;
  for (const letra of codigo) {
    if (!ALFABETO_CODIGO.includes(letra)) return null;
  }
  return codigo;
}

export function limparNome(entrada: unknown): string {
  const texto = typeof entrada === "string" ? entrada : "";
  const limpo = texto.replace(/[\u0000-\u001f<>]/g, "").trim().slice(0, TAMANHO_MAX_NOME);
  return limpo || "Aprendiz";
}
