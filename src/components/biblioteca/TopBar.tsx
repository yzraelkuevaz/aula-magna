import { Bell, Search, Sparkles, Library } from "lucide-react";

interface TopBarProps {
  query: string;
  onQuery: (q: string) => void;
  onAskAI: () => void;
}

export function TopBar({ query, onQuery, onAskAI }: TopBarProps) {
  return (
    <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-border">
      <div className="flex items-center gap-3 h-16 px-5 lg:px-8">
        <div className="lg:hidden flex items-center gap-2">
          <div className="h-9 w-9 rounded-xl bg-primary/10 grid place-items-center">
            <Library className="h-4 w-4 text-primary" />
          </div>
          <span className="font-serif font-semibold">Biblioteca Viva</span>
        </div>

        <div className="flex-1 max-w-2xl mx-auto relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-soft" />
          <input
            value={query}
            onChange={(e) => onQuery(e.target.value)}
            placeholder="Buscar por título, tema, autor, materia, grado…"
            className="w-full h-11 pl-11 pr-4 rounded-full bg-secondary/70 border border-transparent focus:border-primary/30 focus:bg-surface-elevated focus:outline-none focus:ring-4 focus:ring-ring/20 transition text-sm placeholder:text-ink-soft/70"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onAskAI}
            className="hidden md:inline-flex items-center gap-1.5 h-10 px-3.5 rounded-full bg-ink text-background text-sm font-medium hover:bg-ink/90 transition"
          >
            <Sparkles className="h-4 w-4" />
            IAsistente
          </button>
          <button className="relative h-10 w-10 rounded-full grid place-items-center hover:bg-secondary transition">
            <Bell className="h-[18px] w-[18px] text-ink-soft" />
            <span className="absolute top-2.5 right-2.5 h-1.5 w-1.5 rounded-full bg-primary" />
          </button>
          <button className="h-10 w-10 rounded-full bg-gradient-to-br from-clay to-ochre grid place-items-center text-primary-foreground font-serif font-semibold text-sm">
            AR
          </button>
        </div>
      </div>
    </header>
  );
}
