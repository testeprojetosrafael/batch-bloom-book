import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Hub Logístico Super Autor" },
      {
        name: "description",
        content:
          "Hub Logístico Super Autor: acesso ao PDP (Painel de Controle de Prioridades), ao MPC (Mapa de Coleta) e aos próximos módulos.",
      },
      { property: "og:title", content: "Hub Logístico Super Autor" },
      {
        property: "og:description",
        content:
          "Hub Logístico Super Autor: acesso ao PDP (Painel de Controle de Prioridades), ao MPC (Mapa de Coleta) e aos próximos módulos.",
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
  component: HubPage,
});

function HubPage() {
  const [avisoMPC, setAvisoMPC] = useState(false);

  return (
    <div className="app-backdrop flex min-h-screen flex-col px-4 py-8 sm:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col">
        {/* Cabeçalho */}
        <header className="mb-10 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
            Super Autor
          </p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
            Hub <span className="text-primary">Logístico</span> Super Autor
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground sm:text-base">
            Central de módulos da produção e expedição de livros. Escolha para onde ir:
          </p>
        </header>

        {/* Blocos */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {/* PDP */}
          <Link
            to="/pdp"
            className="glass-panel group flex min-h-56 flex-col rounded-2xl p-7 transition-transform duration-200 hover:-translate-y-1"
          >
            <span className="inline-flex w-fit rounded-full border border-primary/40 bg-primary/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">
              PDP
            </span>
            <h2 className="mt-4 text-xl font-bold tracking-tight">
              Painel de Controle de Prioridades
            </h2>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
              Priorize, acompanhe e conclua os lotes de produção e expedição. Defina prazos,
              responsáveis e filtre por status, gráfica e transportadora.
            </p>
            <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-primary">
              Abrir PDP
              <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
            </span>
          </Link>

          {/* MPC */}
          <button
            type="button"
            onClick={() => setAvisoMPC(true)}
            className="glass-panel group flex min-h-56 cursor-pointer flex-col rounded-2xl p-7 text-left transition-transform duration-200 hover:-translate-y-1"
          >
            <span className="inline-flex w-fit rounded-full border border-accent-foreground/20 bg-accent px-3 py-1 text-xs font-bold uppercase tracking-wider text-accent-foreground">
              MPC
            </span>
            <h2 className="mt-4 text-xl font-bold tracking-tight">Mapa de Coleta</h2>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
              Visualização das coletas em rota: acompanhe o caminho de cada pedido até o hub
              de expedição.
            </p>
            <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-primary">
              Abrir MPC
              <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
            </span>
          </button>

          {/* Bloco reservado */}
          <div
            aria-disabled="true"
            className="glass-panel flex min-h-56 flex-col rounded-2xl p-7 opacity-60"
          >
            <span className="inline-flex w-fit rounded-full border border-glass-border bg-muted px-3 py-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Em breve
            </span>
            <h2 className="mt-4 text-xl font-bold tracking-tight text-muted-foreground">
              Próximo módulo
            </h2>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground/80">
              Um novo módulo do Hub Logístico será anunciado aqui. Fique de olho!
            </p>
            <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground">
              🔒 Em breve
            </span>
          </div>
        </div>
      </div>

      {/* Aviso: aplicação em desenvolvimento */}
      {avisoMPC && (
        <div
          className="fade-enter fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          onClick={() => setAvisoMPC(false)}
        >
          <div
            className="modal-enter glass-panel w-full max-w-sm rounded-2xl p-7 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-accent text-2xl">
              🛠️
            </div>
            <h2 className="mt-4 text-lg font-bold">MPC — Mapa de Coleta</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Esta aplicação está em desenvolvimento e estará disponível em breve.
            </p>
            <button
              onClick={() => setAvisoMPC(false)}
              className="mt-6 w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground transition-opacity hover:opacity-90"
            >
              Entendi
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
