import {
  Home, GraduationCap, ClipboardList, CheckSquare, Camera, BookOpen, Scale,
  FileText, Notebook, FolderOpen, Sparkles, Users, MonitorPlay, BarChart3,
  Settings, CalendarDays,
} from "lucide-react";

interface NavItem {
  key: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  soon?: boolean;
}

const items: NavItem[] = [
  { key: "escritorio", label: "Escritorio", icon: Home },
  { key: "aula", label: "Mi Aula", icon: GraduationCap },
  { key: "planeaciones", label: "Planeaciones", icon: ClipboardList },
  { key: "evaluaciones", label: "Evaluaciones", icon: CheckSquare },
  { key: "biblioteca", label: "Biblioteca", icon: BookOpen },
  { key: "recursos", label: "Recursos", icon: FolderOpen },
  { key: "ia", label: "IAsistente", icon: Sparkles },
  { key: "agenda", label: "Agenda escolar", icon: CalendarDays, soon: true },
  { key: "juridico", label: "Centro Jurídico", icon: Scale, soon: true },
  { key: "bitacoras", label: "Bitácoras", icon: Notebook, soon: true },
  { key: "evidencias", label: "Evidencias", icon: Camera, soon: true },
  { key: "documentos", label: "Documentos", icon: FileText, soon: true },
  { key: "comunidad", label: "Comunidad", icon: Users, soon: true },
  { key: "tic", label: "Centro TIC", icon: MonitorPlay, soon: true },
  { key: "reportes", label: "Reportes", icon: BarChart3, soon: true },
  { key: "config", label: "Configuración", icon: Settings, soon: true },
];


interface SidebarProps {
  active: string;
  onSelect: (key: string) => void;
}

export function Sidebar({ active, onSelect }: SidebarProps) {
  return (
    <aside className="hidden lg:flex flex-col shrink-0 h-screen sticky top-0 w-[248px] glass border-r border-white/10">
      {/* Brand */}
      <div className="flex items-center gap-3 px-5 h-[84px] border-b border-white/10">
        <div
          className="h-11 w-11 rounded-2xl grid place-items-center shrink-0 ring-1 ring-white/20"
          style={{ background: "var(--gradient-neon)" }}
        >
          <BookOpen className="h-5 w-5 text-white drop-shadow" />
        </div>
        <div className="min-w-0">
          <div className="font-serif text-[18px] leading-none font-semibold text-ink">SIED MX</div>
          <div className="text-[9px] tracking-[0.16em] uppercase text-ink-soft mt-1.5 leading-tight">
            Oficina Digital<br />del Magisterio
          </div>
        </div>
      </div>

      {/* Nav */}
      <div className="flex-1 overflow-y-auto py-3 px-2.5 scrollbar-hide">
        <nav className="flex flex-col gap-0.5">
          {items.map(({ key, label, icon: Icon, soon }) => {
            const isActive = active === key;
            return (
              <button
                key={key}
                onClick={() => onSelect(key)}
                aria-current={isActive ? "page" : undefined}
                className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13.5px] transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--neon-coral)]/60 ${
                  isActive
                    ? "bg-white/[0.07] text-ink font-medium"
                    : "text-ink-soft hover:bg-white/[0.04] hover:text-ink"
                }`}
              >
                {isActive && (
                  <span
                    className="absolute left-0 top-2 bottom-2 w-[3px] rounded-full"
                    style={{ background: "var(--gradient-neon)", boxShadow: "0 0 12px var(--neon-coral)" }}
                  />
                )}
                <Icon className={`h-[18px] w-[18px] shrink-0 ${isActive ? "text-[var(--neon-coral)]" : ""}`} aria-hidden="true" />
                <span className="truncate flex-1 text-left">{label}</span>
                {soon && (
                  <span className="text-[9px] uppercase tracking-[0.12em] rounded-full px-1.5 py-0.5 border border-white/15 text-ink-soft/80">
                    Pronto
                  </span>
                )}
              </button>
            );
          })}

            );
          })}
        </nav>
      </div>

      {/* Tiempo recuperado ring */}
      <div className="p-4 border-t border-white/10">
        <div className="rounded-2xl glass-strong p-4">
          <div className="text-[11px] text-ink-soft mb-3 leading-tight">Tiempo recuperado este ciclo</div>
          <div className="flex justify-center">
            <TimeRing hours={63} minutes={48} />
          </div>
          <div className="text-center text-[10px] text-ink-soft mt-2">equivale a 8 días de clase</div>
        </div>
      </div>
    </aside>
  );
}

function TimeRing({ hours, minutes }: { hours: number; minutes: number }) {
  const pct = 0.72;
  const r = 46;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative h-[120px] w-[120px]">
      <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
        <defs>
          <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="oklch(0.68 0.24 340)" />
            <stop offset="50%" stopColor="oklch(0.72 0.19 25)" />
            <stop offset="100%" stopColor="oklch(0.62 0.20 295)" />
          </linearGradient>
        </defs>
        <circle cx="60" cy="60" r={r} fill="none" stroke="oklch(1 0 0 / 8%)" strokeWidth="8" />
        <circle
          cx="60"
          cy="60"
          r={r}
          fill="none"
          stroke="url(#ringGrad)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - pct)}
          style={{ filter: "drop-shadow(0 0 6px oklch(0.68 0.24 340 / 60%))" }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">
        <div>
          <div className="font-serif text-[22px] leading-none text-ink">
            {hours}<span className="text-sm"> h </span>{minutes}<span className="text-sm"> m</span>
          </div>
        </div>
      </div>
    </div>
  );
}
