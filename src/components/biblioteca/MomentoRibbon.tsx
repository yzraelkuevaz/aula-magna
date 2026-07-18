import { useEffect, useState } from "react";
import { Sparkles, Sun, Moon, Coffee, Sunset } from "lucide-react";

type Momento = {
  key: string;
  hi: string;
  line: string;
  Icon: React.ComponentType<{ className?: string }>;
};

function pickMomento(now: Date, name: string): Momento {
  const h = now.getHours();
  const d = now.getDay();
  const month = now.getMonth();

  if (d === 0 && h >= 17) return { key: "domingo", hi: `Domingo tranquilo, ${name}`, line: "Tengo lista una propuesta de planeación para tu semana. ¿La revisamos juntas?", Icon: Sunset };
  if (d === 1 && h < 8) return { key: "lunes-amanecer", hi: `Buenos días, ${name}`, line: "Hoy son honores. Ya preparé la efeméride del día por si quieres imprimirla.", Icon: Sun };
  if (d === 5 && h >= 13) return { key: "viernes", hi: `Buen viernes, ${name}`, line: "Ya guardé todas las evidencias de esta semana en el portafolio de tu grupo.", Icon: Sunset };
  if (month === 6) return { key: "verano", hi: `Descansa, ${name}`, line: "Aquí seguimos, listos para agosto. Tu biblioteca te espera intacta.", Icon: Moon };
  if (h < 12) return { key: "mañana", hi: `Buenos días, ${name}`, line: "Tienes 3 planeaciones activas y 2 recursos nuevos que te podrían servir hoy.", Icon: Coffee };
  if (h < 19) return { key: "tarde", hi: `Buenas tardes, ${name}`, line: "¿Cerramos evidencias del día? Puedo hacerlo por ti en menos de un minuto.", Icon: Sun };
  return { key: "noche", hi: `Buenas noches, ${name}`, line: "Deja lo pendiente para mañana. Guardé todo en su lugar.", Icon: Moon };
}

export function MomentoRibbon({ name = "Maestra Alicia" }: { name?: string }) {
  const [m, setM] = useState<Momento | null>(null);
  useEffect(() => {
    setM(pickMomento(new Date(), name));
    const t = setInterval(() => setM(pickMomento(new Date(), name)), 60_000);
    return () => clearInterval(t);
  }, [name]);

  if (!m) return null;
  const { Icon } = m;

  return (
    <div className="px-5 lg:px-10 pt-6">
      <div className="max-w-6xl mx-auto">
        <div
          key={m.key}
          className="relative overflow-hidden rounded-3xl glass-strong glow-rainbow led-strip px-5 py-4 animate-in fade-in slide-in-from-top-2 duration-500"
        >
          <div className="flex items-center gap-4">
            <div
              className="h-11 w-11 rounded-2xl grid place-items-center shrink-0 ring-1 ring-white/20"
              style={{ background: "var(--gradient-neon)" }}
            >
              <Icon className="h-[18px] w-[18px] text-white drop-shadow" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-serif text-[17px] text-ink leading-tight">{m.hi}</div>
              <div className="text-[13px] text-ink-soft mt-0.5 truncate">{m.line}</div>
            </div>
            <button className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white/[0.06] border border-white/10 text-xs font-medium text-ink hover:border-[var(--neon-coral)]/40 transition">
              <Sparkles className="h-3.5 w-3.5 text-[var(--neon-pink)]" />
              Ver sugerencia
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
