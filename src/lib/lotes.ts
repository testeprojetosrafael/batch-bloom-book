export type Lote = {
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

export type LoteFinalizado = Lote & { dataConclusao: string };

export const STORAGE_KEY = "dfz-prioridades-lotes";
export const STORAGE_KEY_FINALIZADOS = "dfz-prioridades-finalizados";

export function carregarJSON<T>(key: string, fallback: T): T {
  try {
    const salvo = localStorage.getItem(key);
    return salvo ? (JSON.parse(salvo) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function formatarData(iso: string | null): string {
  if (!iso) return "—";
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

export function statusCor(status: string): string {
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

/** Template de colunas compartilhado entre cabeçalho e linhas (desktop). */
export const GRID_COLS =
  "lg:grid-cols-[1.2fr_0.7fr_1fr_1fr_0.8fr_1fr_1fr_1.1fr_7rem]";
