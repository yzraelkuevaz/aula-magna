import { useEffect, useMemo, useRef, useState } from "react";
import { Search, Sparkles, FileText, BookOpen, ClipboardList, Wand2, ArrowRight, CornerDownLeft } from "lucide-react";
import { resources, type Resource } from "./data";

/**
 * Command Palette — ⌘K / Ctrl+K
 * "Pregúntale a SIED" en lenguaje natural.
 * Anticipación por encima de resultados: la IA propone acciones, no listas.
 */

interface Props {
  open: boolean;
  onClose: () => void;
  onOpenResource: (r: Resource) => void;
}

const suggestions = [
  { icon: Wand2, label: "Planeación de fracciones para 4°", intent: "ai" },
  { icon: ClipboardList, label: "Acta de entrega-recepción", intent: "template" },
  { icon: FileText, label: "Oficio de comisión", intent: "template" },
  { icon: BookOpen, label: "Cuento con valores para 2°", intent: "search" },
];

export function CommandPalette({ open, onClose, onOpenResource }: Props) {
  const [q, setQ] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) {
      window.addEventListener("keydown", onKey);
      setTimeout(() => inputRef.current?.focus(), 40);
    }
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const matches = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return [];
    return resources
      .filter((r) =>
        [r.title, r.author, r.category, r.subject ?? "", r.grade ?? ""]
          .join(" ")
          .toLowerCase()
          .includes(s),
      )
      .slice(0, 5);
  }, [q]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[12vh] px-4 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-2xl rounded-2xl bg-surface-elevated border border-border shadow-[var(--shadow-lift)] overflow-hidden animate-in zoom-in-95 slide-in-from-top-4 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-5 h-14 border-b border-border">
          <Search className="h-4 w-4 text-ink-soft" />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Pregúntale a SIED — 'planeación de mañana', 'acta bimestre'…"
            className="flex-1 bg-transparent outline-none text-[15px] placeholder:text-ink-soft/70"
          />
          <kbd className="hidden sm:inline-flex items-center gap-1 text-[10px] text-ink-soft border border-border rounded px-1.5 py-0.5">
            ESC
          </kbd>
        </div>

        <div className="max-h-[52vh] overflow-y-auto p-2">
          {q.trim() && (
            <button
              className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-secondary text-left group"
              onClick={onClose}
            >
              <div className="h-9 w-9 rounded-lg bg-ink text-background grid place-items-center">
                <Sparkles className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[13px] text-ink-soft">Preguntar al IAsistente</div>
                <div className="text-[15px] text-ink truncate font-medium">"{q}"</div>
              </div>
              <ArrowRight className="h-4 w-4 text-ink-soft group-hover:text-primary transition" />
            </button>
          )}

          {matches.length > 0 && (
            <>
              <div className="px-3 pt-3 pb-1.5 text-[10px] uppercase tracking-[0.15em] text-ink-soft/70">
                En tu biblioteca
              </div>
              {matches.map((r) => (
                <button
                  key={r.id}
                  onClick={() => {
                    onOpenResource(r);
                    onClose();
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-secondary text-left group"
                >
                  <div className="h-9 w-9 rounded-lg bg-primary/10 text-primary grid place-items-center">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[14px] text-ink truncate">{r.title}</div>
                    <div className="text-[11px] text-ink-soft truncate">
                      {r.category} · {r.author}
                      {r.grade ? ` · ${r.grade}` : ""}
                    </div>
                  </div>
                  <CornerDownLeft className="h-4 w-4 text-ink-soft/60 opacity-0 group-hover:opacity-100 transition" />
                </button>
              ))}
            </>
          )}

          {!q.trim() && (
            <>
              <div className="px-3 pt-3 pb-1.5 text-[10px] uppercase tracking-[0.15em] text-ink-soft/70">
                Sugerencias para ti
              </div>
              {suggestions.map(({ icon: Icon, label }) => (
                <button
                  key={label}
                  onClick={() => setQ(label)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-secondary text-left"
                >
                  <div className="h-9 w-9 rounded-lg bg-secondary text-ink grid place-items-center">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="text-[14px] text-ink">{label}</div>
                </button>
              ))}
            </>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-border px-4 py-2.5 text-[11px] text-ink-soft">
          <span className="inline-flex items-center gap-1.5">
            <Sparkles className="h-3 w-3" />
            Anticipación por encima de resultados
          </span>
          <span>
            <kbd className="border border-border rounded px-1.5 py-0.5">⌘</kbd>
            <kbd className="border border-border rounded px-1.5 py-0.5 ml-1">K</kbd>
          </span>
        </div>
      </div>
    </div>
  );
}
