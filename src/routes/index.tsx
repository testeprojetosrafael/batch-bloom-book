import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Painel de Controle de Prioridades — DFZ" },
      {
        name: "description",
        content:
          "Painel de prioridades de lotes para produção e expedição: visualize lotes prioritários, responsáveis e prazos em tempo real.",
      },
      { property: "og:title", content: "Painel de Controle de Prioridades — DFZ" },
      {
        property: "og:description",
        content:
          "Painel de prioridades de lotes para produção e expedição: visualize lotes prioritários, responsáveis e prazos em tempo real.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&display=swap",
      },
    ],
  }),
  component: PainelPage,
});

type Lote = {
  lote: string;
  id: string;
  status: string;
  grafica: string;
  tipo: string;
  transportadora: string;
  dataAutografo: string;
  prazo: string | null;
  responsavel: string | null;
  exiting?: boolean;
};

const STATUS = ["Em produção", "Aguardando autógrafo", "Em expedição", "Urgente"];
const GRAFICAS = ["Gráfica Alpha", "Gráfica Beta", "Gráfica Ômega", "Gráfica Delta"];
const TIPOS = ["Capa dura", "Brochura", "Espiral", "Pocket"];
const TRANSPORTADORAS = ["TransLivros", "Rápido Expresso", "LogSul", "CargaFácil"];
const RESPONSAVEIS = ["Ana Souza", "Bruno Lima", "Carla Mendes", "Diego Rocha", "Equipe Expedição"];

const STORAGE_KEY = "dfz-prioridades-lotes";

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function gerarDadosLote(numero: string): Lote {
  const hoje = new Date();
  const autografo = new Date(hoje.getTime() + Math.floor(Math.random() * 10) * 86400000);
  return {
    lote: numero,
    id: `ID-${Math.floor(1000 + Math.random() * 9000)}`,
    status: pick(STATUS),
    grafica: pick(GRAFICAS),
    tipo: pick(TIPOS),
    transportadora: pick(TRANSPORTADORAS),
    dataAutografo: autografo.toISOString().slice(0, 10),
    prazo: null,
    responsavel: null,
  };
}

function formatarData(iso: string | null): string {
  if (!iso) return "—";
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

function statusCor(status: string): string {
  switch (status) {
    case "Urgente":
      return "bg-red-500/15 text-red-300 border-red-400/30";
    case "Em produção":
      return "bg-blue-500/15 text-blue-300 border-blue-400/30";
    case "Em expedição":
      return "bg-emerald-500/15 text-emerald-300 border-emerald-400/30";
    default:
      return "bg-amber-500/15 text-amber-300 border-amber-400/30";
  }
}

function PainelPage() {
  const [lotes, setLotes] = useState<Lote[]>(() => {
    try {
      const salvo = localStorage.getItem(STORAGE_KEY);
      return salvo ? (JSON.parse(salvo) as Lote[]) : [];
    } catch {
      return [];
    }
  });
  const [busca, setBusca] = useState("");
  const [buscando, setBuscando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [selecionado, setSelecionado] = useState<Lote | null>(null);
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [filtroGrafica, setFiltroGrafica] = useState("todas");
  const [filtroTransp, setFiltroTransp] = useState("todas");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lotes));
  }, [lotes]);

  const lotesFiltrados = useMemo(
    () =>
      lotes.filter(
        (l) =>
          (filtroStatus === "todos" || l.status === filtroStatus) &&
          (filtroGrafica === "todas" || l.grafica === filtroGrafica) &&
          (filtroTransp === "todas" || l.transportadora === filtroTransp)
      ),
    [lotes, filtroStatus, filtroGrafica, filtroTransp]
  );

  function adicionarLote() {
    const numero = busca.trim();
    if (!numero || buscando) return;
    if (lotes.some((l) => l.lote.toLowerCase() === numero.toLowerCase())) {
      setErro(`O lote "${numero}" já está no painel.`);
      return;
    }
    setErro(null);
    setBuscando(true);
    // Simulador de busca no "banco de dados"
    setTimeout(() => {
      const novo = gerarDadosLote(numero);
      setLotes((prev) => [novo, ...prev]);
      setBusca("");
      setBuscando(false);
      inputRef.current?.focus();
    }, 700);
  }

  function concluirLote(lote: string) {
    setLotes((prev) => prev.map((l) => (l.lote === lote ? { ...l, exiting: true } : l)));
    setTimeout(() => {
      setLotes((prev) => prev.filter((l) => l.lote !== lote));
    }, 400);
  }

  function salvarConfig(lote: string, prazo: string, responsavel: string) {
    setLotes((prev) =>
      prev.map((l) => (l.lote === lote ? { ...l, prazo: prazo || null, responsavel: responsavel || null } : l))
    );
    setSelecionado(null);
  }

  return (
    <div className="app-backdrop min-h-screen px-4 py-6 sm:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Cabeçalho */}
        <header className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">
            Produção & Expedição
          </p>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight sm:text-3xl">
            Painel de Controle de Prioridades <span className="text-primary">DFZ</span>
          </h1>
        </header>

        {/* Barra de inserção */}
        <div className="glass-panel mb-4 rounded-2xl p-4">
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              ref={inputRef}
              value={busca}
              onChange={(e) => {
                setBusca(e.target.value);
                setErro(null);
              }}
              onKeyDown={(e) => e.key === "Enter" && adicionarLote()}
              placeholder="Digite ou bipie o número do lote…"
              className="min-w-0 flex-1 rounded-xl border border-input bg-background/40 px-4 py-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-ring"
            />
            <button
              onClick={adicionarLote}
              disabled={buscando || !busca.trim()}
              className="shrink-0 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {buscando ? "⟳ Buscando..." : "+ Priorizar Lote"}
            </button>
          </div>
          {erro && <p className="mt-2 text-sm text-red-300">{erro}</p>}
        </div>

        {/* Filtros */}
        <div className="glass-panel mb-4 grid grid-cols-1 gap-3 rounded-2xl p-4 sm:grid-cols-3">
          <FiltroSelect label="Status" value={filtroStatus} onChange={setFiltroStatus} todos="Todos os status" opcoes={STATUS} />
          <FiltroSelect label="Gráfica" value={filtroGrafica} onChange={setFiltroGrafica} todos="Todas as gráficas" opcoes={GRAFICAS} />
          <FiltroSelect label="Transportadora" value={filtroTransp} onChange={setFiltroTransp} todos="Todas as transportadoras" opcoes={TRANSPORTADORAS} />
        </div>

        {/* Lista de lotes */}
        {lotesFiltrados.length === 0 ? (
          <div className="glass-panel rounded-2xl p-12 text-center">
            <p className="text-lg font-semibold text-muted-foreground">
              {lotes.length === 0
                ? "Nenhum lote priorizado no momento"
                : "Nenhum lote encontrado com esses filtros"}
            </p>
            <p className="mt-1 text-sm text-muted-foreground/70">
              {lotes.length === 0 && "Use a barra acima para adicionar o primeiro lote."}
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {/* Cabeçalho da tabela (desktop) */}
            <div className="hidden grid-cols-[1.2fr_0.7fr_1fr_1fr_0.8fr_1fr_1fr_1fr_auto] gap-3 px-4 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground lg:grid">
              <span>Lote</span>
              <span>ID</span>
              <span>Status</span>
              <span>Gráfica</span>
              <span>Tipo</span>
              <span>Transportadora</span>
              <span>Autógrafo</span>
              <span>Prazo / Resp.</span>
              <span />
            </div>
            {lotesFiltrados.map((l) => (
              <div
                key={l.lote}
                onClick={() => !l.exiting && setSelecionado(l)}
                className={`glass-row cursor-pointer rounded-xl px-4 py-3 ${l.exiting ? "row-exit" : "row-enter"}`}
              >
                <div className="grid grid-cols-2 gap-x-3 gap-y-2 lg:grid-cols-[1.2fr_0.7fr_1fr_1fr_0.8fr_1fr_1fr_1fr_auto] lg:items-center lg:gap-3">
                  <div className="min-w-0">
                    <span className="text-[10px] font-semibold uppercase text-muted-foreground lg:hidden">Lote</span>
                    <p className="truncate text-base font-bold">{l.lote}</p>
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] font-semibold uppercase text-muted-foreground lg:hidden">ID</span>
                    <p className="truncate text-sm text-muted-foreground">{l.id}</p>
                  </div>
                  <div>
                    <span className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-semibold ${statusCor(l.status)}`}>
                      {l.status}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] font-semibold uppercase text-muted-foreground lg:hidden">Gráfica</span>
                    <p className="truncate text-sm">{l.grafica}</p>
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] font-semibold uppercase text-muted-foreground lg:hidden">Tipo</span>
                    <p className="truncate text-sm">{l.tipo}</p>
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] font-semibold uppercase text-muted-foreground lg:hidden">Transportadora</span>
                    <p className="truncate text-sm">{l.transportadora}</p>
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] font-semibold uppercase text-muted-foreground lg:hidden">Autógrafo</span>
                    <p className="truncate text-sm">{formatarData(l.dataAutografo)}</p>
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] font-semibold uppercase text-muted-foreground lg:hidden">Prazo / Responsável</span>
                    <p className="truncate text-sm font-semibold text-primary">
                      {l.prazo ? formatarData(l.prazo) : "Sem prazo"}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">{l.responsavel ?? "Sem responsável"}</p>
                  </div>
                  <div className="col-span-2 flex justify-end lg:col-span-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        concluirLote(l.lote);
                      }}
                      className="shrink-0 rounded-lg bg-destructive px-4 py-1.5 text-xs font-bold text-destructive-foreground transition-opacity hover:opacity-85"
                    >
                      Concluir
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de configuração */}
      {selecionado && (
        <ModalConfig
          lote={selecionado}
          onClose={() => setSelecionado(null)}
          onSalvar={salvarConfig}
        />
      )}
    </div>
  );
}

function FiltroSelect({
  label,
  value,
  onChange,
  todos,
  opcoes,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  todos: string;
  opcoes: string[];
}) {
  return (
    <label className="flex min-w-0 flex-col gap-1">
      <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-lg border border-input bg-background/40 px-3 py-2 text-sm outline-none focus:border-ring"
      >
        <option value={label === "Status" ? "todos" : "todas"}>{todos}</option>
        {opcoes.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}

function ModalConfig({
  lote,
  onClose,
  onSalvar,
}: {
  lote: Lote;
  onClose: () => void;
  onSalvar: (lote: string, prazo: string, responsavel: string) => void;
}) {
  const [prazo, setPrazo] = useState(lote.prazo ?? "");
  const [responsavel, setResponsavel] = useState(lote.responsavel ?? "");

  return (
    <div
      className="fade-enter fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="modal-enter glass-panel w-full max-w-md rounded-2xl p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-bold">Configurar prioridade</h2>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Lote <span className="font-semibold text-foreground">{lote.lote}</span> · {lote.grafica}
        </p>

        <div className="mt-5 flex flex-col gap-4">
          <label className="flex flex-col gap-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Prazo de entrega
            </span>
            <input
              type="date"
              value={prazo}
              onChange={(e) => setPrazo(e.target.value)}
              className="rounded-lg border border-input bg-background/40 px-3 py-2 text-sm outline-none [color-scheme:dark] focus:border-ring"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Responsável
            </span>
            <select
              value={responsavel}
              onChange={(e) => setResponsavel(e.target.value)}
              className="rounded-lg border border-input bg-background/40 px-3 py-2 text-sm outline-none focus:border-ring"
            >
              <option value="">Selecionar…</option>
              {RESPONSAVEIS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded-lg border border-input px-4 py-2 text-sm font-semibold transition-colors hover:bg-accent"
          >
            Cancelar
          </button>
          <button
            onClick={() => onSalvar(lote.lote, prazo, responsavel)}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-bold text-primary-foreground transition-opacity hover:opacity-90"
          >
            Salvar Alterações
          </button>
        </div>
      </div>
    </div>
  );
}
