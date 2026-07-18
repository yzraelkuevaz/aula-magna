import { Search, Wand2, Sparkles } from "lucide-react";
import { PulsoDocente } from "./PulsoDocente";

interface HeroProps {
  query: string;
  onQuery: (q: string) => void;
  onAskAI: () => void;
}

const chips = ["Planeación 3° primaria", "Libro SEP Matemáticas", "Reglamento escolar", "Cuento con valores", "Formato de asistencia"];

export function Hero({ query, onQuery, onAskAI }: HeroProps) {
  return (
    <section className="relative overflow-hidden">
      <div className="px-5 lg:px-10 pt-10 pb-12 max-w-6xl mx-auto">
        <div className="inline-flex items-center gap-2 rounded-full glass px-3 py-1 text-[11px] tracking-[0.18em] uppercase text-ink-soft mb-5">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--neon-coral)] shadow-[0_0_10px_var(--neon-coral)]" />
          Biblioteca Viva · SIED MX
        </div>
        <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl leading-[1.05] tracking-tight text-ink max-w-3xl">
          Tu aula, en un solo lugar.
          <br />
          <span
            className="italic font-normal bg-clip-text text-transparent"
            style={{ backgroundImage: "var(--gradient-neon)" }}
          >
            ¿qué necesitas hoy?
          </span>
        </h1>
        <p className="mt-5 text-ink-soft max-w-xl text-[15px]">
          Explora, guarda y comparte el material de tu clase. Pulsa <kbd className="border border-border rounded px-1.5 py-0.5 text-[11px] mx-1">⌘K</kbd> para pedirle cualquier cosa a SIED en tus propias palabras.
        </p>

        <div className="mt-8 relative max-w-2xl">
          <div className="relative glass-strong rounded-3xl p-1.5 glow-coral">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-ink-soft" />
            <input
              value={query}
              onChange={(e) => onQuery(e.target.value)}
              placeholder="Buscar libro, planeación, reglamento…"
              className="w-full h-14 pl-14 pr-44 rounded-2xl bg-transparent focus:outline-none text-base placeholder:text-ink-soft/70 text-ink"
            />
            <button
              onClick={onAskAI}
              className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex items-center gap-1.5 h-11 px-5 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:brightness-110 transition shadow-[0_8px_24px_-6px_var(--neon-coral)]"
            >
              <Wand2 className="h-4 w-4" />
              Preguntar a la IA
            </button>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {chips.map((c) => (
              <button
                key={c}
                onClick={() => onQuery(c)}
                className="text-xs px-3.5 py-1.5 rounded-full glass text-ink-soft hover:text-ink hover:border-[var(--neon-coral)]/40 transition"
              >
                <Sparkles className="inline h-3 w-3 mr-1.5 text-[var(--neon-pink)]" />
                {c}
              </button>
            ))}
          </div>
        </div>

        <PulsoDocente />
      </div>
    </section>
  );
}
