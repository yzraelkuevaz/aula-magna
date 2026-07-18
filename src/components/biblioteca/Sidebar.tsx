import { useState } from "react";
import {
  Home, FolderHeart, Star, Clock, Users, BookOpen, GraduationCap,
  ClipboardList, Scale, FileText, PlayCircle, Video, Music,
  Presentation, FileType, Trash2, Sparkles, Library, ChevronLeft
} from "lucide-react";

interface NavItem {
  key: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const primary: NavItem[] = [
  { key: "inicio", label: "Inicio", icon: Home },
  { key: "mis", label: "Mis recursos", icon: FolderHeart },
  { key: "favoritos", label: "Favoritos", icon: Star },
  { key: "recientes", label: "Recientes", icon: Clock },
  { key: "compartidos", label: "Compartidos", icon: Users },
];

const bibliotecas: NavItem[] = [
  { key: "sep", label: "Biblioteca SEP", icon: BookOpen },
  { key: "maestro", label: "Biblioteca del Maestro", icon: GraduationCap },
  { key: "planeaciones", label: "Planeaciones", icon: ClipboardList },
  { key: "reglamentos", label: "Reglamentos", icon: Scale },
  { key: "normatividad", label: "Normatividad", icon: FileText },
];

const media: NavItem[] = [
  { key: "tutoriales", label: "Tutoriales", icon: PlayCircle },
  { key: "videos", label: "Videos", icon: Video },
  { key: "audios", label: "Audios", icon: Music },
  { key: "presentaciones", label: "Presentaciones", icon: Presentation },
  { key: "formatos", label: "Formatos", icon: FileType },
];

interface SidebarProps {
  active: string;
  onSelect: (key: string) => void;
  onAskAI: () => void;
}

export function Sidebar({ active, onSelect, onAskAI }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  const Group = ({ title, items }: { title?: string; items: NavItem[] }) => (
    <div className="mb-6">
      {title && !collapsed && (
        <div className="px-3 mb-2 text-[10px] font-semibold tracking-[0.14em] uppercase text-ink-soft/70">
          {title}
        </div>
      )}
      <nav className="flex flex-col gap-0.5">
        {items.map(({ key, label, icon: Icon }) => {
          const isActive = active === key;
          return (
            <button
              key={key}
              onClick={() => onSelect(key)}
              className={`group relative flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-all duration-200 ${
                isActive
                  ? "bg-white/[0.06] text-ink font-medium"
                  : "text-ink-soft hover:bg-white/[0.04] hover:text-ink"
              }`}
              title={collapsed ? label : undefined}
            >
              {isActive && (
                <span
                  className="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-full"
                  style={{ background: "var(--gradient-neon)", boxShadow: "0 0 12px var(--neon-coral)" }}
                />
              )}
              <Icon className={`h-[18px] w-[18px] shrink-0 ${isActive ? "text-[var(--neon-coral)]" : ""}`} />
              {!collapsed && <span className="truncate">{label}</span>}
            </button>
          );
        })}
      </nav>
    </div>
  );

  return (
    <aside
      className={`hidden lg:flex flex-col shrink-0 h-screen sticky top-0 glass border-r border-white/10 transition-[width] duration-300 ${
        collapsed ? "w-[76px]" : "w-[264px]"
      }`}
    >
      <div className="flex items-center gap-2.5 px-5 h-16 border-b border-white/10">
        <div
          className="h-9 w-9 rounded-xl grid place-items-center shrink-0 ring-1 ring-white/20"
          style={{ background: "var(--gradient-neon)" }}
        >
          <Library className="h-[18px] w-[18px] text-white drop-shadow" />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <div className="font-serif text-[15px] leading-tight font-semibold text-ink">Biblioteca Viva</div>
            <div className="text-[11px] text-ink-soft leading-tight">SIED MX</div>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto py-5 px-3 scrollbar-hide">
        <Group items={primary} />
        <Group title="Bibliotecas" items={bibliotecas} />
        <Group title="Recursos" items={media} />
        <Group items={[{ key: "papelera", label: "Papelera", icon: Trash2 }]} />
      </div>

      <div className="p-3 border-t border-white/10 space-y-2">
        {!collapsed && (
          <button
            onClick={onAskAI}
            className="w-full flex items-center justify-center gap-2 rounded-full bg-primary text-primary-foreground px-3 py-2.5 text-sm font-semibold hover:brightness-110 transition-all shadow-[0_10px_28px_-8px_var(--neon-coral)]"
          >
            <Sparkles className="h-4 w-4" />
            Preguntar al IAsistente
          </button>
        )}
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="w-full flex items-center justify-center gap-2 rounded-lg px-2 py-1.5 text-xs text-ink-soft hover:bg-white/[0.05]"
        >
          <ChevronLeft className={`h-3.5 w-3.5 transition-transform ${collapsed ? "rotate-180" : ""}`} />
          {!collapsed && "Contraer"}
        </button>
      </div>
    </aside>
  );
}
