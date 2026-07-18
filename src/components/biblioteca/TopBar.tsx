import { Bell, Search, Sparkles, Library } from "lucide-react";

interface TopBarProps {
  query: string;
  onQuery: (q: string) => void;
  onAskAI: () => void;
}

export function TopBar({ query, onQuery, onAskAI }: TopBarProps) {
  return (
    <header className="sticky top-0 z-30 glass border-b border-white/10">
      <div className="flex items-center gap-3 h-16 px-5 lg:px-8">
        <div className="lg:hidden flex items-center gap-2">
          <div
            className="h-9 w-9 rounded-xl grid place-items-center ring-1 ring-white/20"
            style={{ background: "var(--gradient-neon)" }}
          >
            <Library className="h-4 w-4 text-white" />
          </div>
          <span className="font-serif font-semibold text-ink">Biblioteca Viva</span>
        </div>

        <div className="flex-1 max-w-2xl mx-auto relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-soft" />
          <input
            value={query}
            onChange={(e) => onQuery(e.target.value)}
            placeholder="Buscar por título, tema, autor, materia, grado…"
            className="w-full h-11 pl-11 pr-4 rounded-full bg-white/[0.06] border border-white/10 focus:border-[var(--neon-coral)]/50 focus:bg-white/[0.10] focus:outline-none focus:ring-4 focus:ring-[var(--neon-coral)]/15 transition text-sm placeholder:text-ink-soft/70 text-ink"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onAskAI}
            className="hidden md:inline-flex items-center gap-1.5 h-10 px-4 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:brightness-110 transition shadow-[0_8px_22px_-8px_var(--neon-coral)]"
          >
            <Sparkles className="h-4 w-4" />
            IAsistente
          </button>
          <button className="relative h-10 w-10 rounded-full grid place-items-center hover:bg-white/[0.06] transition">
            <Bell className="h-[18px] w-[18px] text-ink-soft" />
            <span className="absolute top-2.5 right-2.5 h-1.5 w-1.5 rounded-full bg-[var(--neon-coral)] shadow-[0_0_8px_var(--neon-coral)]" />
          </button>
          <button
            className="h-10 w-10 rounded-full grid place-items-center text-white font-serif font-semibold text-sm ring-1 ring-white/20"
            style={{ background: "linear-gradient(135deg, var(--neon-pink), var(--neon-coral))" }}
          >
            AR
          </button>
        </div>
      </div>
    </header>
  );
}
