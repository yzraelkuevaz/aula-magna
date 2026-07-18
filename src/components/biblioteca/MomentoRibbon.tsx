import { useEffect, useState } from "react";
import { Sparkles, Sun, Moon, Coffee, Sunset } from "lucide-react";

/**
 * MomentoRibbon — la app "sabe" en qué momento del día y del año está.
 * Cambia saludo, ícono y gradiente sutilmente. Es el latido ambiental de SIED MX.
 */

type Momento = {
  key: string;
  hi: string;
  line: string;
  Icon: React.ComponentType<{ className?: string }>;
  gradient: string;
};

function pickMomento(now: Date, name: string): Momento {
  const h = now.getHours();
  const d = now.getDay(); // 0 dom
  const month = now.getMonth(); // 0..11

  // Domingo tarde — planeación de la semana
  if (d === 0 && h >= 17) {
    return {
      key: "domingo",
      hi: `Domingo tranquilo, ${name}`,
      line: "Tengo lista una propuesta de planeación para tu semana. ¿La revisamos juntas?",
      Icon: Sunset,
      gradient:
        "radial-gradient(60% 60% at 15% 0%, oklch(0.78 0.11 30 / 55%) 0%, transparent 60%), radial-gradient(50% 50% at 90% 20%, oklch(0.72 0.10 300 / 40%) 0%, transparent 60%)",
    };
  }
  // Lunes muy temprano
  if (d === 1 && h < 8) {
    return {
      key: "lunes-amanecer",
      hi: `Buenos días, ${name}`,
      line: "Hoy son honores. Ya preparé la efeméride del día por si quieres imprimirla.",
      Icon: Sun,
      gradient:
        "radial-gradient(60% 60% at 15% 0%, oklch(0.86 0.12 70 / 60%) 0%, transparent 60%), radial-gradient(50% 50% at 90% 20%, oklch(0.82 0.09 40 / 45%) 0%, transparent 60%)",
    };
  }
  // Viernes tarde
  if (d === 5 && h >= 13) {
    return {
      key: "viernes",
      hi: `Buen viernes, ${name}`,
      line: "Ya guardé todas las evidencias de esta semana en el portafolio de tu grupo.",
      Icon: Sunset,
      gradient:
        "radial-gradient(60% 60% at 15% 0%, oklch(0.82 0.13 45 / 55%) 0%, transparent 60%), radial-gradient(50% 50% at 90% 20%, oklch(0.75 0.10 20 / 40%) 0%, transparent 60%)",
    };
  }
  // Julio — descanso
  if (month === 6) {
    return {
      key: "verano",
      hi: `Descansa, ${name}`,
      line: "Aquí seguimos, listos para agosto. Tu biblioteca te espera intacta.",
      Icon: Moon,
      gradient:
        "radial-gradient(60% 60% at 15% 0%, oklch(0.72 0.09 250 / 50%) 0%, transparent 60%), radial-gradient(50% 50% at 90% 20%, oklch(0.78 0.09 300 / 35%) 0%, transparent 60%)",
    };
  }
  // Mañana normal
  if (h < 12) {
    return {
      key: "mañana",
      hi: `Buenos días, ${name}`,
      line: "Tienes 3 planeaciones activas y 2 recursos nuevos que te podrían servir hoy.",
      Icon: Coffee,
      gradient:
        "radial-gradient(60% 60% at 15% 0%, oklch(0.85 0.08 60 / 60%) 0%, transparent 60%), radial-gradient(50% 50% at 90% 20%, oklch(0.82 0.09 20 / 45%) 0%, transparent 60%)",
    };
  }
  // Tarde
  if (h < 19) {
    return {
      key: "tarde",
      hi: `Buenas tardes, ${name}`,
      line: "¿Cerramos evidencias del día? Puedo hacerlo por ti en menos de un minuto.",
      Icon: Sun,
      gradient:
        "radial-gradient(60% 60% at 15% 0%, oklch(0.83 0.11 55 / 55%) 0%, transparent 60%), radial-gradient(50% 50% at 90% 20%, oklch(0.80 0.10 25 / 40%) 0%, transparent 60%)",
    };
  }
  // Noche
  return {
    key: "noche",
    hi: `Buenas noches, ${name}`,
    line: "Deja lo pendiente para mañana. Guardé todo en su lugar.",
    Icon: Moon,
    gradient:
      "radial-gradient(60% 60% at 15% 0%, oklch(0.55 0.09 270 / 55%) 0%, transparent 60%), radial-gradient(50% 50% at 90% 20%, oklch(0.60 0.10 300 / 40%) 0%, transparent 60%)",
  };
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
          className="relative overflow-hidden rounded-2xl border border-border bg-surface-elevated/60 backdrop-blur px-5 py-4 animate-in fade-in slide-in-from-top-2 duration-500"
        >
          <div
            className="absolute inset-0 -z-10 opacity-90"
            style={{ background: m.gradient }}
          />
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-ink/90 text-background grid place-items-center shrink-0">
              <Icon className="h-[18px] w-[18px]" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-serif text-[17px] text-ink leading-tight">{m.hi}</div>
              <div className="text-[13px] text-ink-soft mt-0.5 truncate">{m.line}</div>
            </div>
            <button className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium text-ink hover:text-primary transition">
              <Sparkles className="h-3.5 w-3.5" />
              Ver sugerencia
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
