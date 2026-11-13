import { schema, t, type SchemaType } from "@colyseus/schema";

/**
 * Estado público da sala. Tudo o que está aqui é enviado a TODOS os clientes.
 * Papel (investigador/impostor) nunca entra neste schema: vai por mensagem
 * privada ou por StateView a partir do M3.
 */
export const Jogador = schema({
  nome: t.string(),
  conectado: t.boolean(),
  anfitriao: t.boolean(),
});
export type Jogador = SchemaType<typeof Jogador>;

export const EstadoSala = schema({
  codigo: t.string(),
  fase: t.string(),
  jogadores: t.map(Jogador),
});
export type EstadoSala = SchemaType<typeof EstadoSala>;
