import { Check, Circle, Clock3 } from "lucide-react";
import { horaActual, type Recordatorio } from "@/lib/rutina";

/**
 * Tarjeta "Rutina de hoy": estado real de la jornada.
 * Los pasos de hora se marcan al pasar la hora; la asistencia solo se marca
 * cuando el docente realmente la registró en la base.
 */
export function RutinaHoy({
  recordatorios,
  asistenciaRegistrada,
  onTomarLista,
  onConfigurar,
}: {
  recordatorios: Recordatorio[];
  asistenciaRegistrada: boolean;
  onTomarLista: () => void;
  onConfigurar: () => void;
}) {
  const dia = new Date().getDay();
  const ahora = horaActual();
  const pasos = recordatorios
    .filter((r) => r.activo && (r.dias ?? []).includes(dia))
    .sort((a, b) => a.hora.localeCompare(b.hora));

  const proximo = pasos.find((r) => r.hora.slice(0, 5) > ahora);

  return (
    <section className="rounded-3xl glass-strong p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-[10px] uppercase tracking-[0.18em] text-ink-soft">Hoy</div>
          <h3 className="font-serif text-lg text-ink mt-0.5">Rutina de hoy</h3>
        </div>
        <button
          onClick={onConfigurar}
          aria-label="Configurar mis recordatorios"
          className="text-[11px] px-2.5 h-8 rounded-lg glass text-ink-soft hover:text-ink"
        >
          Configurar
        </button>
      </div>

      {pasos.length === 0 ? (
        <p className="text-sm text-ink-soft mt-4">
          No tienes recordatorios para hoy. Crea tu rutina en Configuración → Recordatorios.
        </p>
      ) : (
        <ul className="mt-4 space-y-2">
          {pasos.map((r) => {
            const esAsistencia = r.tipo === "Tomar asistencia";
            const hecho = esAsistencia ? asistenciaRegistrada : r.hora.slice(0, 5) <= ahora;
            return (
              <li key={r.id} className="flex items-center gap-2.5 text-sm">
                {hecho ? (
                  <Check className="h-4 w-4 shrink-0" style={{ color: "var(--neon-cyan)" }} aria-hidden="true" />
                ) : (
                  <Circle className="h-4 w-4 shrink-0 text-ink-soft/60" aria-hidden="true" />
                )}
                <span className={hecho ? "text-ink" : "text-ink-soft"}>{r.nombre}</span>
                <span className="ml-auto text-[11px] text-ink-soft/80">{r.hora.slice(0, 5)}</span>
              </li>
            );
          })}
        </ul>
      )}

      {proximo && (
        <div className="mt-4 rounded-2xl glass p-3 flex items-center gap-2 text-xs text-ink-soft">
          <Clock3 className="h-3.5 w-3.5" aria-hidden="true" />
          Próximo: <span className="text-ink">{proximo.nombre}</span> a las {proximo.hora.slice(0, 5)}
        </div>
      )}

      {!asistenciaRegistrada && (
        <button
          onClick={onTomarLista}
          aria-label="Tomar asistencia"
          className="btn-3d mt-3 w-full h-11 rounded-xl text-sm font-semibold text-white"
          style={{ background: "var(--gradient-neon)" }}
        >
          Tomar asistencia
        </button>
      )}
    </section>
  );
}
