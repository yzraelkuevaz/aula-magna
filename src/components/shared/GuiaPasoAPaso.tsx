import { useState } from "react";
import {
  BookOpen, CalendarDays, ClipboardCheck, GraduationCap, LayoutDashboard,
  NotebookPen, Settings, Sparkles, X,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type Paso = {
  icon: typeof BookOpen;
  titulo: string;
  texto: string;
  color: string;
};

const pasos: Paso[] = [
  {
    icon: LayoutDashboard,
    titulo: "Tu escritorio",
    texto:
      "Al entrar verás tu escritorio: el resumen del día, tu grupo, tus pendientes y la Rutina de hoy con el recordatorio para tomar lista.",
    color: "var(--neon-coral)",
  },
  {
    icon: GraduationCap,
    titulo: "Mi Aula",
    texto:
      "Aquí administras tu grupo durante el ciclo: alumnos, asistencia, reglamento, padres de familia, incidentes y materiales.",
    color: "var(--neon-pink)",
  },
  {
    icon: NotebookPen,
    titulo: "Planeaciones",
    texto:
      "Crea planeaciones paso a paso con apoyo del IAsistente: propósito, inicio, desarrollo, cierre, evaluación e inclusión. Puedes compartirlas con un enlace.",
    color: "var(--neon-violet)",
  },
  {
    icon: ClipboardCheck,
    titulo: "Centro de Evaluación",
    texto:
      "Registra calificaciones, construye rúbricas y listas de cotejo, y revisa quién necesita apoyo con gráficas claras.",
    color: "var(--neon-cyan)",
  },
  {
    icon: BookOpen,
    titulo: "Biblioteca Viva",
    texto:
      "Busca libros, formatos y recursos. Usa el buscador grande o el atajo Ctrl/⌘ + K para encontrar cualquier cosa al instante.",
    color: "var(--neon-coral)",
  },
  {
    icon: CalendarDays,
    titulo: "Agenda y bitácoras",
    texto:
      "Anota eventos del grupo y lleva tu bitácora diaria. Lo que registres queda guardado solo en tu cuenta.",
    color: "var(--neon-pink)",
  },
  {
    icon: Settings,
    titulo: "Configuración y recordatorios",
    texto:
      "En Configuración ajustas tu perfil, tu grupo, las fotos de tus alumnos y tus alarmas de entrada, recreo y salida.",
    color: "var(--neon-violet)",
  },
];

/** Guía de bienvenida que se muestra una sola vez por docente. */
export function GuiaPasoAPaso({ userId, onDone }: { userId: string; onDone: () => void }) {
  const [i, setI] = useState(0);
  const [busy, setBusy] = useState(false);
  const paso = pasos[i]!;
  const Icon = paso.icon;
  const ultimo = i === pasos.length - 1;

  const terminar = async () => {
    setBusy(true);
    await supabase.from("profiles").update({ tutorial_completed: true }).eq("user_id", userId);
    setBusy(false);
    onDone();
  };

  return (
    <div className="fixed inset-0 z-[80] grid place-items-center px-5 py-8 bg-[oklch(0.15_0.02_265_/_0.55)] backdrop-blur-sm">
      <div
        className="w-full max-w-lg rounded-3xl glass-strong p-7 relative"
        role="dialog"
        aria-modal="true"
        aria-label="Guía paso a paso de SIED MX"
        style={{ boxShadow: "var(--glow-rainbow)" }}
      >
        <button
          onClick={terminar}
          aria-label="Cerrar guía y no volver a mostrarla"
          className="absolute right-4 top-4 h-9 w-9 grid place-items-center rounded-xl hover:bg-primary/8 text-ink-soft"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>

        <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-ink-soft">
          <Sparkles className="h-3.5 w-3.5" aria-hidden="true" /> Guía paso a paso · {i + 1} de {pasos.length}
        </div>

        <div
          className="mt-5 h-14 w-14 rounded-2xl grid place-items-center ring-1 ring-border"
          style={{ background: `linear-gradient(135deg, ${paso.color}, var(--neon-violet))` }}
        >
          <Icon className="h-6 w-6 text-white" aria-hidden="true" />
        </div>

        <h2 className="font-serif text-2xl text-ink mt-4">{paso.titulo}</h2>
        <p className="text-sm text-ink-soft mt-2 leading-relaxed">{paso.texto}</p>

        <div className="mt-6 flex items-center gap-1.5" aria-hidden="true">
          {pasos.map((_, idx) => (
            <span
              key={idx}
              className="h-1.5 rounded-full transition-all"
              style={{
                width: idx === i ? 24 : 8,
                background: idx <= i ? "var(--neon-coral)" : "oklch(0.6 0.02 265 / 0.25)",
              }}
            />
          ))}
        </div>

        <div className="mt-6 flex items-center justify-between gap-3">
          <button
            onClick={() => setI((v) => Math.max(0, v - 1))}
            disabled={i === 0}
            aria-label="Paso anterior"
            className="h-11 px-4 rounded-xl glass text-sm text-ink disabled:opacity-40"
          >
            Atrás
          </button>
          <div className="flex items-center gap-3">
            <button
              onClick={terminar}
              aria-label="Omitir la guía"
              className="text-xs text-ink-soft hover:text-ink transition"
            >
              Omitir
            </button>
            <button
              onClick={() => (ultimo ? void terminar() : setI((v) => v + 1))}
              disabled={busy}
              aria-label={ultimo ? "Comenzar a usar SIED MX" : "Siguiente paso"}
              className="h-11 px-5 rounded-xl text-sm font-semibold text-white disabled:opacity-60"
              style={{ background: "var(--gradient-neon)" }}
            >
              {ultimo ? "Comenzar" : "Siguiente"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
