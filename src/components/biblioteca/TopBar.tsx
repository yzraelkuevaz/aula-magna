import { Bell, Search, Mail, Calendar, Sun, ChevronDown, BookOpen } from "lucide-react";

interface TopBarProps {
  query: string;
  onQuery: (q: string) => void;
  onCommand?: () => void;
}

export function TopBar({ query, onQuery, onCommand }: TopBarProps) {
  return (
    <header className="sticky top-0 z-30 glass border-b border-white/10">
      <div className="flex items-center gap-4 h-[84px] px-5 lg:px-8">
        <div className="lg:hidden flex items-center gap-2">
          <div
            className="h-9 w-9 rounded-xl grid place-items-center ring-1 ring-white/20"
            style={{ background: "var(--gradient-neon)" }}
          >
            <BookOpen className="h-4 w-4 text-white" />
          </div>
        </div>

        {/* Search pill */}
        <div className="flex-1 max-w-xl relative">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-soft" />
          <input
            value={query}
            onChange={(e) => onQuery(e.target.value)}
            onFocus={onCommand}
            placeholder="¿Qué necesitas hoy, Profesor?"
            className="w-full h-12 pl-12 pr-16 rounded-full bg-white/[0.06] border border-white/10 focus:border-[var(--neon-coral)]/40 focus:bg-white/[0.10] focus:outline-none focus:ring-4 focus:ring-[var(--neon-coral)]/15 transition text-sm placeholder:text-ink-soft/70 text-ink"
          />
          <kbd className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] text-ink-soft border border-white/15 rounded-md px-1.5 py-0.5 bg-white/5">
            ⌘ K
          </kbd>
        </div>

        <div className="flex-1" />

        {/* Right icons */}
        <div className="flex items-center gap-1.5">
          <IconBtn icon={Bell} badge={3} />
          <IconBtn icon={Mail} />
          <IconBtn icon={Calendar} />
          <IconBtn icon={Sun} />

          {/* User pill */}
          <button className="ml-2 flex items-center gap-2.5 h-12 pl-1.5 pr-3 rounded-full glass-strong hover:border-white/20 transition">
            <div
              className="h-9 w-9 rounded-full grid place-items-center text-white font-semibold text-xs ring-1 ring-white/20"
              style={{ background: "linear-gradient(135deg, var(--neon-violet), var(--neon-pink))" }}
            >
              PI
            </div>
            <div className="hidden md:block text-left leading-tight">
              <div className="text-[13px] font-medium text-ink">Profesor Israel</div>
              <div className="text-[10px] text-ink-soft">2°C · Primaria</div>
            </div>
            <ChevronDown className="hidden md:block h-3.5 w-3.5 text-ink-soft" />
          </button>
        </div>
      </div>
    </header>
  );
}

function IconBtn({ icon: Icon, badge }: { icon: React.ComponentType<{ className?: string }>; badge?: number }) {
  return (
    <button className="relative h-11 w-11 rounded-full grid place-items-center glass hover:border-white/20 transition">
      <Icon className="h-[18px] w-[18px] text-ink-soft" />
      {badge != null && (
        <span
          className="absolute top-1.5 right-1.5 h-4 min-w-4 px-1 rounded-full grid place-items-center text-[9px] font-semibold text-white"
          style={{ background: "var(--neon-violet)", boxShadow: "0 0 8px var(--neon-violet)" }}
        >
          {badge}
        </span>
      )}
    </button>
  );
}
