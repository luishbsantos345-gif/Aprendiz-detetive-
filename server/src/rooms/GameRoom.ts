import { Room, matchMaker, type Client } from "@colyseus/core";
import {
  MAX_JOGADORES,
  MSG,
  gerarCodigoSala,
  limparNome,
  type OpcoesEntrada,
} from "@aprendiz/shared";
import { EstadoSala, Jogador } from "./estado.ts";

/**
 * Sala de jogo. No M0 ela só faz o lobby mínimo: entrar, listar, sair.
 * Simulação, papéis e pistas entram nos marcos seguintes.
 */
export class GameRoom extends Room<{ state: EstadoSala }> {
  override maxClients = MAX_JOGADORES;

  override async onCreate(): Promise<void> {
    const estado = new EstadoSala();
    estado.codigo = await this.reservarCodigo();
    estado.fase = "lobby";
    this.roomId = estado.codigo;
    this.setState(estado);

    this.onMessage(MSG.PING, (client, enviadoEm: number) => {
      client.send(MSG.PONG, enviadoEm);
    });
  }

  override onJoin(client: Client, opcoes?: OpcoesEntrada): void {
    const jogador = new Jogador();
    jogador.nome = limparNome(opcoes?.nome);
    jogador.conectado = true;
    jogador.anfitriao = this.state.jogadores.size === 0;
    this.state.jogadores.set(client.sessionId, jogador);
  }

  override onLeave(client: Client): void {
    const saiu = this.state.jogadores.get(client.sessionId);
    this.state.jogadores.delete(client.sessionId);
    if (saiu?.anfitriao) {
      const proximo = this.state.jogadores.values().next().value;
      if (proximo) proximo.anfitriao = true;
    }
  }

  private async reservarCodigo(): Promise<string> {
    for (let tentativa = 0; tentativa < 20; tentativa++) {
      const codigo = gerarCodigoSala();
      const existentes = await matchMaker.query({ roomId: codigo });
      if (existentes.length === 0) return codigo;
    }
    throw new Error("Não foi possível gerar um código de sala livre.");
  }
}
