import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { BellRing } from "lucide-react";
import { horaActual, type Recordatorio } from "@/lib/rutina";

function beep() {
  try {
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new Ctx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 880;
    gain.gain.value = 0.06;
    osc.start();
    setTimeout(() => {
      osc.stop();
      void ctx.close();
    }, 320);
  } catch {
    /* el navegador puede bloquear audio sin interacción previa */
  }
}

/**
 * Motor de alarmas docentes: revisa cada 20 s los recordatorios activos del
 * usuario y dispara un aviso con opción de posponer 5, 10 o 15 minutos.
 * Un recordatorio solo suena una vez por día (o cuando vence la posposición).
 */
export function AlarmEngine({
  recordatorios,
  sonido,
  onAction,
}: {
  recordatorios: Recordatorio[];
  sonido: boolean;
  onAction?: (tipo: string) => void;
}) {
  const disparados = useRef<Set<string>>(new Set());
  const pospuestos = useRef<Map<string, number>>(new Map());

  useEffect(() => {
    const revisar = () => {
      const ahora = new Date();
      const hhmm = horaActual();
      const dia = ahora.getDay();

      // Posposiciones vencidas
      pospuestos.current.forEach((ts, id) => {
        if (ts <= Date.now()) {
          pospuestos.current.delete(id);
          const r = recordatorios.find((x) => x.id === id);
          if (r) mostrar(r);
        }
      });

      for (const r of recordatorios) {
        if (!r.activo || !r.dias?.includes(dia)) continue;
        const clave = `${r.id}:${ahora.toDateString()}`;
        if (disparados.current.has(clave)) continue;
        if (r.hora?.slice(0, 5) === hhmm) {
          disparados.current.add(clave);
          mostrar(r);
        }
      }
    };

    const mostrar = (r: Recordatorio) => {
      if (sonido) beep();
      toast.custom(
        (t) => (
          <div className="w-[340px] rounded-2xl glass-strong p-4" style={{ boxShadow: "var(--glow-rainbow)" }}>
            <div className="flex items-start gap-3">
              <div className="h-9 w-9 rounded-xl grid place-items-center shrink-0" style={{ background: "var(--gradient-neon)" }}>
                <BellRing className="h-4 w-4 text-white" aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <div className="text-sm font-semibold text-ink">{r.nombre}</div>
                <p className="text-xs text-ink-soft mt-0.5">{r.mensaje || `${r.hora} · recordatorio de tu rutina`}</p>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {[5, 10, 15].map((min) => (
                <button
                  key={min}
                  onClick={() => {
                    pospuestos.current.set(r.id, Date.now() + min * 60_000);
                    toast.dismiss(t);
                  }}
                  aria-label={`Posponer ${min} minutos`}
                  className="text-[11px] px-2.5 h-8 rounded-lg glass hover:border-white/25 text-ink"
                >
                  +{min} min
                </button>
              ))}
              {r.tipo === "Tomar asistencia" && onAction && (
                <button
                  onClick={() => {
                    onAction("asistencia");
                    toast.dismiss(t);
                  }}
                  className="text-[11px] px-3 h-8 rounded-lg text-white font-semibold"
                  style={{ background: "var(--gradient-neon)" }}
                >
                  Tomar lista
                </button>
              )}
              <button
                onClick={() => toast.dismiss(t)}
                aria-label="Callar recordatorio"
                className="text-[11px] px-2.5 h-8 rounded-lg glass hover:border-white/25 text-ink ml-auto"
              >
                Callar
              </button>
            </div>
          </div>
        ),
        { duration: 60_000 },
      );
    };

    revisar();
    const id = window.setInterval(revisar, 20_000);
    return () => window.clearInterval(id);
  }, [recordatorios, sonido, onAction]);

  return null;
}
