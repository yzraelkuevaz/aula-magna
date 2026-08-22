import { useCallback, useEffect, useState } from "react";
import { Check, Clock, FileCheck2, Loader2, QrCode, Save, X } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { hoyISO } from "@/lib/rutina";

type Estado = "presente" | "falta" | "retardo" | "justificado";

const estados: { key: Estado; label: string; icon: React.ComponentType<{ className?: string }>; color: string }[] = [
  { key: "presente", label: "Presente", icon: Check, color: "var(--neon-cyan)" },
  { key: "falta", label: "Falta", icon: X, color: "var(--neon-coral)" },
  { key: "retardo", label: "Retardo", icon: Clock, color: "var(--neon-amber, oklch(0.8 0.16 80))" },
  { key: "justificado", label: "Justificado", icon: FileCheck2, color: "var(--neon-violet)" },
];

export function Asistencia({
  userId,
  alumnos,
  grupo,
  onRegistrada,
}: {
  userId: string;
  alumnos: { id: string; nombre: string }[];
  grupo: string;
  onRegistrada?: () => void;
}) {
  const [fecha, setFecha] = useState(hoyISO());
  const [marcas, setMarcas] = useState<Record<string, Estado>>({});
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  const cargar = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from("asistencia").select("alumno_id, estado").eq("fecha", fecha);
    const next: Record<string, Estado> = {};
    (data ?? []).forEach((r) => {
      next[r.alumno_id] = r.estado as Estado;
    });
    setMarcas(next);
    setLoading(false);
  }, [fecha]);

  useEffect(() => {
    void cargar();
  }, [cargar]);

  const marcarTodos = (estado: Estado) => {
    const next: Record<string, Estado> = {};
    alumnos.forEach((a) => (next[a.id] = estado));
    setMarcas(next);
  };

  const guardar = async () => {
    const filas = alumnos
      .filter((a) => marcas[a.id])
      .map((a) => ({ user_id: userId, alumno_id: a.id, fecha, estado: marcas[a.id]! }));
    if (filas.length === 0) return toast.error("Marca al menos un alumno");
    setBusy(true);
    const { error } = await supabase.from("asistencia").upsert(filas, { onConflict: "alumno_id,fecha" });
    setBusy(false);
    if (error) return toast.error("No se pudo guardar la asistencia");
    toast.success("✓ Asistencia registrada");
    onRegistrada?.();
  };

  const conteo = (e: Estado) => Object.values(marcas).filter((v) => v === e).length;

  return (
    <div className="px-5 lg:px-8 py-6 space-y-6">
      <header className="rounded-3xl glass-strong p-6 relative overflow-hidden">
        <div className="absolute -top-16 -right-10 h-44 w-44 rounded-full opacity-25 blur-3xl" style={{ background: "var(--gradient-neon)" }} />
        <div className="relative flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-ink-soft">Asistencia diaria</div>
            <h1 className="font-serif text-3xl text-ink mt-1">Tomar lista · {grupo}</h1>
            <p className="text-sm text-ink-soft mt-1">
              {alumnos.length} alumnos · {Object.keys(marcas).length} marcados
            </p>
          </div>
          <label className="block">
            <span className="text-[10px] uppercase tracking-[0.15em] text-ink-soft">Fecha</span>
            <input
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              aria-label="Fecha de la asistencia"
              className="mt-1.5 h-11 px-4 rounded-xl bg-white/[0.06] border border-white/10 text-sm text-ink"
            />
          </label>
        </div>
        <div className="relative mt-5 flex flex-wrap gap-2">
          {estados.map((e) => (
            <span key={e.key} className="text-xs px-3 h-8 inline-flex items-center gap-1.5 rounded-full glass text-ink">
              <i className="h-2 w-2 rounded-full" style={{ background: e.color }} /> {e.label} · {conteo(e.key)}
            </span>
          ))}
        </div>
      </header>

      <div className="flex flex-wrap gap-2">
        <button onClick={() => marcarTodos("presente")} aria-label="Marcar a todos como presentes" className="btn-3d h-10 px-4 rounded-xl glass text-sm text-ink">
          Todos presentes
        </button>
        <button onClick={() => setMarcas({})} aria-label="Limpiar marcas" className="btn-3d h-10 px-4 rounded-xl glass text-sm text-ink">
          Limpiar
        </button>
        <button
          onClick={() => toast.info("Identificación por código QR personal: próximamente")}
          aria-label="Identificación por código QR (próximamente)"
          className="btn-3d h-10 px-4 rounded-xl glass text-sm text-ink-soft inline-flex items-center gap-2"
        >
          <QrCode className="h-4 w-4" aria-hidden="true" /> Códigos QR · Próximamente
        </button>
        <button
          onClick={guardar}
          disabled={busy}
          aria-label="Guardar asistencia"
          className="btn-3d h-10 px-5 rounded-xl text-sm font-semibold text-white inline-flex items-center gap-2 disabled:opacity-60 ml-auto"
          style={{ background: "var(--gradient-neon)" }}
        >
          {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Save className="h-4 w-4" aria-hidden="true" />}
          Guardar asistencia
        </button>
      </div>

      {loading ? (
        <div className="py-16 grid place-items-center text-ink-soft">
          <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
        </div>
      ) : alumnos.length === 0 ? (
        <div className="rounded-3xl glass p-10 text-center">
          <div className="font-serif text-xl text-ink">Aún no tienes alumnos registrados</div>
          <p className="text-sm text-ink-soft mt-2">Agrégalos en Configuración → Mi grupo para poder tomar lista.</p>
        </div>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {alumnos.map((a) => (
            <li key={a.id} className="rounded-2xl glass p-3 flex items-center gap-3">
              <div className="h-9 w-9 rounded-full grid place-items-center text-[11px] font-semibold text-white shrink-0" style={{ background: "var(--gradient-neon)" }}>
                {a.nombre.slice(0, 2).toUpperCase()}
              </div>
              <span className="text-sm text-ink flex-1 min-w-0 truncate">{a.nombre}</span>
              <div className="flex gap-1">
                {estados.map((e) => {
                  const on = marcas[a.id] === e.key;
                  const Icon = e.icon;
                  return (
                    <button
                      key={e.key}
                      onClick={() => setMarcas((m) => ({ ...m, [a.id]: e.key }))}
                      aria-label={`${e.label}: ${a.nombre}`}
                      aria-pressed={on}
                      className={`h-9 w-9 grid place-items-center rounded-xl border transition ${
                        on ? "border-white/40" : "border-white/10 hover:border-white/25"
                      }`}
                      style={on ? { background: `color-mix(in oklch, ${e.color} 26%, transparent)` } : undefined}
                    >
                      <Icon className="h-4 w-4" style={{ color: on ? e.color : undefined }} aria-hidden="true" />
                    </button>
                  );
                })}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
