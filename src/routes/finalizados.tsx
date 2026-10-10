import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  STORAGE_KEY_FINALIZADOS,
  carregarJSON,
  formatarData,
  statusCor,
  type LoteFinalizado,
} from "@/lib/lotes";

export const Route = createFileRoute("/finalizados")({
  head: () => ({
    meta: [
      { title: "Lotes Finalizados — Painel DFZ" },
      {
        name: "description",
        content:
          "Histórico de lotes concluídos na produção e expedição: veja data de conclusão, prazo cumprido e responsável de cada lote.",
      },
      { property: "og:title", content: "Lotes Finalizados — Painel DFZ" },
      {
        property: "og:description",
        content:
          "Histórico de lotes concluídos na produção e expedição: veja data de conclusão, prazo cumprido e responsável de cada lote.",
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
  component: FinalizadosPage,
});

function FinalizadosPage() {
  const [finalizados, setFinalizados] = useState<LoteFinalizado[]>(() =>
    carregarJSON<LoteFinalizado[]>(STORAGE_KEY_FINALIZADOS, [])
  );

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_FINALIZADOS, JSON.stringify(finalizados));
  }, [finalizados]);

  return (
    <div className="app-backdrop min-h-screen px-4 py-6 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">
              Produção &amp; Expedição
            </p>
            <h1 className="mt-1 text-2xl font-extrabold tracking-tight sm:text-3xl">
              Lotes <span className="text-primary">Finalizados</span>
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {finalizados.length === 0
                ? "Nenhum lote concluído ainda."
                : `${finalizados.length} ${finalizados.length === 1 ? "lote concluído" : "lotes concluídos"}`}
            </p>
          </div>
          <Link
            to="/pdp"
            className="rounded-xl border border-glass-border bg-glass px-5 py-2.5 text-sm font-bold transition-colors hover:bg-accent"
          >
            ← Voltar ao painel
          </Link>
        </header>

        {finalizados.length === 0 ? (
          <div className="glass-panel rounded-2xl p-12 text-center">
            <p className="text-lg font-semibold text-muted-foreground">
              Nenhum lote finalizado no momento
            </p>
            <p className="mt-1 text-sm text-muted-foreground/70">
              Ao clicar em "Concluir" no painel, o lote aparece aqui.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <div className="hidden grid-cols-[1.2fr_0.7fr_1fr_1fr_1fr_1fr_auto] gap-3 px-4 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground lg:grid lg:items-center">
              <span>Lote</span>
              <span>ID</span>
              <span>Status</span>
              <span>Gráfica</span>
              <span>Prazo de conclusão</span>
              <span>Responsável</span>
              <span>Finalizado em</span>
            </div>
            {finalizados.map((l) => (
              <div
                key={l.lote}
                className="glass-row row-enter rounded-xl px-4 py-3"
              >
                <div className="grid grid-cols-2 gap-x-3 gap-y-2 lg:grid-cols-[1.2fr_0.7fr_1fr_1fr_1fr_1fr_auto] lg:items-center lg:gap-3">
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
                    <span className="text-[10px] font-semibold uppercase text-muted-foreground lg:hidden">Prazo de conclusão</span>
                    <p className="truncate text-sm font-semibold text-primary">
                      {l.prazo ? formatarData(l.prazo) : "Sem prazo"}
                    </p>
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] font-semibold uppercase text-muted-foreground lg:hidden">Responsável</span>
                    <p className="truncate text-sm">{l.responsavel ?? "—"}</p>
                  </div>
                  <div className="min-w-0 lg:text-right">
                    <span className="text-[10px] font-semibold uppercase text-muted-foreground lg:hidden">Finalizado em</span>
                    <p className="truncate text-sm text-emerald-300">
                      {formatarData(l.dataConclusao)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
