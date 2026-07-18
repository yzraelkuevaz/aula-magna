import { Clock, TrendingUp, Heart } from "lucide-react";

/**
 * Pulso Docente — el widget que cuantifica el regalo:
 * cuánto tiempo, cuántas acciones y cuántas gracias recibió esta semana.
 * Sentimiento por encima del dato.
 */
export function PulsoDocente() {
  const stats = [
    { icon: Clock, label: "Tiempo devuelto", value: "4h 20m", sub: "esta semana", tint: "oklch(0.82 0.13 60)" },
    { icon: TrendingUp, label: "Recursos creados", value: "12", sub: "planeaciones y evidencias", tint: "oklch(0.72 0.09 155)" },
    { icon: Heart, label: "Gracias recibidas", value: "7", sub: "de otros docentes", tint: "oklch(0.72 0.13 20)" },
  ];
  return (
    <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-3xl">
      {stats.map(({ icon: Icon, label, value, sub, tint }) => (
        <div
          key={label}
          className="group rounded-2xl border border-border bg-surface-elevated/70 backdrop-blur px-4 py-3.5 flex items-center gap-3 hover:border-primary/30 transition"
        >
          <div
            className="h-10 w-10 rounded-xl grid place-items-center shrink-0"
            style={{ background: `color-mix(in oklab, ${tint} 20%, transparent)` }}
          >
            <Icon className="h-[18px] w-[18px]" style={{ color: tint }} />
          </div>
          <div className="min-w-0">
            <div className="font-serif text-[20px] leading-none text-ink">{value}</div>
            <div className="text-[11px] text-ink-soft mt-1">
              <span className="text-ink/80">{label}</span> · {sub}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
