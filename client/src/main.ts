import { limparNome, normalizarCodigoSala } from "@aprendiz/shared";
import { entrarTelaCheiaPaisagem, gravarLocal, lerLocal } from "./core/dispositivo.ts";
import {
  criarSala,
  entrarNaSala,
  explicarErro,
  listarJogadores,
  urlDoServidor,
  type SalaConectada,
} from "./net/conexao.ts";
import { iniciarCenaTeste } from "./world/cenaTeste.ts";

const $ = <T extends HTMLElement>(id: string): T => {
  const el = document.getElementById(id);
  if (!el) throw new Error(`Elemento #${id} não existe`);
  return el as T;
};

const telaEntrada = $("tela-entrada");
const telaSala = $("tela-sala");
const campoNome = $<HTMLInputElement>("campo-nome");
const campoCodigo = $<HTMLInputElement>("campo-codigo");
const botaoCriar = $<HTMLButtonElement>("botao-criar");
const botaoEntrar = $<HTMLButtonElement>("botao-entrar");
const botaoSair = $<HTMLButtonElement>("botao-sair");
const mensagem = $("mensagem");
const codigoSala = $("codigo-sala");
const estadoConexao = $("estado-conexao");
const listaJogadores = $("lista-jogadores");
const contagem = $("contagem");

const CHAVE_NOME = "aprendiz.nome";
campoNome.value = lerLocal(CHAVE_NOME) ?? "";

const temWebGL = iniciarCenaTeste($<HTMLCanvasElement>("cena"));
$("rodape").textContent = `M0 · servidor: ${urlDoServidor()}${temWebGL ? "" : " · sem WebGL"}`;

let sala: SalaConectada | null = null;

function ocupado(sim: boolean): void {
  botaoCriar.disabled = sim;
  botaoEntrar.disabled = sim;
}

function definirEstado(estado: "conectando" | "conectado" | "desconectado", texto: string): void {
  estadoConexao.dataset.estado = estado;
  estadoConexao.textContent = texto;
}

function desenharJogadores(): void {
  if (!sala) return;
  const jogadores = listarJogadores(sala);
  contagem.textContent = `(${jogadores.length})`;
  listaJogadores.replaceChildren(
    ...jogadores.map((j) => {
      const li = document.createElement("li");
      li.textContent = j.anfitriao ? `${j.nome} (anfitrião)` : j.nome;
      li.dataset.eu = String(j.id === sala?.sessionId);
      return li;
    }),
  );
}

function mostrarSala(nova: SalaConectada): void {
  sala = nova;
  telaEntrada.hidden = true;
  telaSala.hidden = false;
  codigoSala.textContent = nova.roomId;
  definirEstado("conectado", "Conectado");
  desenharJogadores();

  nova.onStateChange(() => desenharJogadores());
  nova.onLeave(() => {
    if (sala !== nova) return;
    sala = null;
    telaSala.hidden = true;
    telaEntrada.hidden = false;
    mensagem.textContent = "Você saiu da sala ou a conexão caiu.";
  });
  nova.onError((_codigo, texto) => definirEstado("desconectado", texto ?? "Erro de conexão"));
}

async function conectar(acao: () => Promise<SalaConectada>): Promise<void> {
  mensagem.textContent = "";
  ocupado(true);
  gravarLocal(CHAVE_NOME, campoNome.value.trim());
  void entrarTelaCheiaPaisagem();
  try {
    mostrarSala(await acao());
  } catch (erro) {
    mensagem.textContent = explicarErro(erro);
  } finally {
    ocupado(false);
  }
}

botaoCriar.addEventListener("click", () => {
  void conectar(() => criarSala({ nome: limparNome(campoNome.value) }));
});

function entrar(): void {
  const codigo = normalizarCodigoSala(campoCodigo.value);
  if (!codigo) {
    mensagem.textContent = "O código tem 5 letras.";
    return;
  }
  void conectar(() => entrarNaSala(codigo, { nome: limparNome(campoNome.value) }));
}
botaoEntrar.addEventListener("click", entrar);
campoCodigo.addEventListener("keydown", (e) => {
  if (e.key === "Enter") entrar();
});

botaoSair.addEventListener("click", () => {
  void sala?.leave();
});
