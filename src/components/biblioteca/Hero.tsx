import { Search, Wand2 } from "lucide-react";

interface HeroProps {
  query: string;
  onQuery: (q: string) => void;
  onAskAI: () => void;
}

const chips = ["Planeación 3° primaria", "Libro SEP Matemáticas", "Reglamento escolar", "Cuento con valores", "Formato de asistencia"];

export function Hero({ query, onQuery, onAskAI }: HeroProps) {
  return (
    <section className="relative overflow-hidden">
      <div
        className="absolute inset-0 -z-10 opacity-70"
        style={{
          background:
            "radial-gradient(60% 60% at 15% 0%, oklch(0.85 0.08 60 / 60%) 0%, transparent 60%), radial-gradient(50% 50% at 90% 20%, oklch(0.82 0.09 20 / 45%) 0%, transparent 60%)",
        }}
      />
      <div className="px-5 lg:px-10 pt-14 pb-12 max-w-6xl mx-auto">
        <div className="text-xs tracking-[0.18em] uppercase text-ink-soft mb-4">Biblioteca Viva · SIED MX</div>
        <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl leading-[1.05] tracking-tight text-ink max-w-3xl">
          Bienvenido nuevamente.
          <br />
          <span className="text-ink-soft italic font-normal">¿qué deseas encontrar hoy?</span>
        </h1>
        <p className="mt-5 text-ink-soft max-w-xl text-[15px]">
          Tu espacio para explorar, guardar y compartir todo el material que necesitas para tu aula.
        </p>

        <div className="mt-8 relative max-w-2xl">
          <div className="relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-ink-soft" />
            <input
              value={query}
              onChange={(e) => onQuery(e.target.value)}
              placeholder="Buscar libro, planeación, reglamento…"
              className="w-full h-16 pl-14 pr-40 rounded-2xl bg-surface-elevated border border-border shadow-[var(--shadow-soft)] focus:border-primary/40 focus:outline-none focus:ring-4 focus:ring-ring/20 transition text-base placeholder:text-ink-soft/70"
            />
            <button
              onClick={onAskAI}
              className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex items-center gap-1.5 h-12 px-4 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:brightness-105 transition"
            >
              <Wand2 className="h-4 w-4" />
              Preguntar a la IA
            </button>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {chips.map((c) => (
              <button
                key={c}
                onClick={() => onQuery(c)}
                className="text-xs px-3 py-1.5 rounded-full bg-surface-elevated/80 border border-border text-ink-soft hover:text-ink hover:border-primary/30 transition"
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
