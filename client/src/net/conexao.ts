import { Client, type Room } from "@colyseus/sdk";
import { NOME_SALA, PORTA_PADRAO, type OpcoesEntrada } from "@aprendiz/shared";

/**
 * Ordem de decisão do endereço do servidor:
 * 1. ?servidor=... na URL (para testar um servidor sem refazer o build);
 * 2. VITE_SERVER_URL definido no build (deploy do GitHub Pages);
 * 3. em desenvolvimento (vite), mesma máquina na porta padrão;
 * 4. caso contrário, a mesma origem da página (modo host local).
 */
export function urlDoServidor(): string {
  const daUrl = new URLSearchParams(location.search).get("servidor");
  const bruto = daUrl || import.meta.env.VITE_SERVER_URL || "";
  if (bruto) return bruto.replace(/^ws/, "http").replace(/\/+$/, "");
  if (import.meta.env.DEV) return `${location.protocol}//${location.hostname}:${PORTA_PADRAO}`;
  return location.origin;
}

export interface JogadorVisivel {
  id: string;
  nome: string;
  anfitriao: boolean;
}

export type SalaConectada = Room;

const cliente = new Client(urlDoServidor());

export function criarSala(opcoes: OpcoesEntrada): Promise<SalaConectada> {
  return cliente.create(NOME_SALA, opcoes);
}

export function entrarNaSala(codigo: string, opcoes: OpcoesEntrada): Promise<SalaConectada> {
  return cliente.joinById(codigo, opcoes);
}

export function listarJogadores(sala: SalaConectada): JogadorVisivel[] {
  const jogadores: JogadorVisivel[] = [];
  const mapa = (sala.state as { jogadores?: Map<string, { nome: string; anfitriao: boolean }> })
    ?.jogadores;
  mapa?.forEach((j, id) => jogadores.push({ id, nome: j.nome, anfitriao: j.anfitriao }));
  return jogadores;
}

/** Traduz erros de rede e de matchmaking para algo que o jogador entende. */
export function explicarErro(erro: unknown): string {
  const texto = erro instanceof Error ? erro.message : String(erro);
  const codigo = (erro as { code?: number })?.code;
  if (/not found|no rooms found/i.test(texto)) return "Sala não encontrada. Confira o código.";
  if (/locked|full/i.test(texto)) return "Sala cheia.";
  if (codigo === undefined || /fetch|network|offline|failed/i.test(texto)) {
    return `Sem resposta do servidor (${urlDoServidor()}).`;
  }
  return `Não deu para entrar: ${texto}`;
}
