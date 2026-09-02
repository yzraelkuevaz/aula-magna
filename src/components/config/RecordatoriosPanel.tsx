import { useState } from "react";
import { BellRing, Loader2, Pencil, Plus, Trash2, Wand2, X } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  diasSemana,
  etiquetaDias,
  recordatoriosBase,
  tiposRecordatorio,
  type Recordatorio,
} from "@/lib/rutina";

interface Borrador {
  id?: string;
  nombre: string;
  tipo: string;
  hora: string;
  dias: number[];
  mensaje: string;
  activo: boolean;
  repetir: boolean;
}

const vacio: Borrador = {
  nombre: "",
  tipo: "Personalizado",
  hora: "08:00",
  dias: [1, 2, 3, 4, 5],
  mensaje: "",
  activo: true,
  repetir: true,
};

/** "Mi rutina docente": recordatorios reales del docente (crear, editar, activar, eliminar). */
export function RecordatoriosPanel({
  userId,
  recordatorios,
  horas,
  asistenciaRegistrada,
  onChange,
  onTomarLista,
}: {
  userId: string;
  recordatorios: Recordatorio[];
  horas: { entrada?: string | null; recreo?: string | null; salida?: string | null };
  asistenciaRegistrada: boolean;
  onChange: () => void;
  onTomarLista: () => void;
}) {
  const [draft, setDraft] = useState<Borrador | null>(null);
  const [busy, setBusy] = useState(false);

  const guardar = async () => {
    if (!draft) return;
    const nombre = draft.nombre.trim() || draft.tipo;
    setBusy(true);
    const payload = {
      user_id: userId,
      nombre,
      tipo: draft.tipo,
      hora: draft.hora,
      dias: draft.dias,
      mensaje: draft.mensaje.trim() || null,
      activo: draft.activo,
      repetir: draft.repetir,
    };
    const { error } = draft.id
      ? await supabase.from("recordatorios").update(payload).eq("id", draft.id)
      : await supabase.from("recordatorios").insert(payload);
    setBusy(false);
    if (error) return toast.error("No se pudo guardar el recordatorio");
    toast.success(draft.id ? "✓ Recordatorio actualizado" : "✓ Recordatorio creado");
    setDraft(null);
    onChange();
  };

  const alternar = async (r: Recordatorio) => {
    const { error } = await supabase.from("recordatorios").update({ activo: !r.activo }).eq("id", r.id);
    if (error) return toast.error("No se pudo actualizar");
    onChange();
  };

  const eliminar = async (r: Recordatorio) => {
    const { error } = await supabase.from("recordatorios").delete().eq("id", r.id);
    if (error) return toast.error("No se pudo eliminar");
    toast.success("Recordatorio eliminado");
    onChange();
  };

  const crearRutinaBase = async () => {
    setBusy(true);
    const { error } = await supabase.from("recordatorios").insert(recordatoriosBase(userId, horas));
    setBusy(false);
    if (error) return toast.error("No se pudo crear tu rutina");
    toast.success("✓ Rutina base creada");
    onChange();
  };

  const asistencia = recordatorios.find((r) => r.tipo === "Tomar asistencia");

  return (
    <section className="space-y-5">
      <div className="rounded-3xl glass-strong p-6 space-y-4">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h2 className="font-serif text-xl text-ink">Mi rutina docente</h2>
            <p className="text-sm text-ink-soft mt-1">
              SIED MX te avisa a la hora que tú decidas. Puedes posponer cualquier aviso 5, 10 o 15 minutos.
            </p>
          </div>
          <button
            onClick={() => setDraft({ ...vacio })}
            aria-label="Crear recordatorio"
            className="btn-3d inline-flex items-center gap-2 h-11 px-4 rounded-xl text-sm font-semibold text-white"
            style={{ background: "var(--gradient-neon)" }}
          >
            <Plus className="h-4 w-4" aria-hidden="true" /> Nuevo recordatorio
          </button>
        </div>

        {/* Estado de la asistencia de hoy */}
        <div className="rounded-2xl glass p-4 flex flex-wrap items-center gap-3">
          <span
            className="h-9 w-9 rounded-xl grid place-items-center shrink-0"
            style={{ background: "var(--gradient-neon)" }}
          >
            <BellRing className="h-4 w-4 text-white" aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="text-sm text-ink">
              {asistenciaRegistrada
                ? "La asistencia de hoy ya está registrada ✓"
                : "La asistencia de hoy todavía no ha sido registrada"}
            </div>
            <p className="text-xs text-ink-soft mt-0.5">
              {asistencia
                ? `Aviso diario a las ${asistencia.hora.slice(0, 5)} · ${etiquetaDias(asistencia.dias)}`
                : "Aún no tienes un recordatorio de asistencia configurado."}
            </p>
          </div>
          {!asistenciaRegistrada && (
            <button
              onClick={onTomarLista}
              aria-label="Tomar asistencia ahora"
              className="btn-3d h-10 px-4 rounded-xl glass text-sm text-ink"
            >
              Tomar lista
            </button>
          )}
        </div>

        {recordatorios.length === 0 ? (
          <div className="rounded-2xl glass p-8 text-center">
            <div className="font-serif text-lg text-ink">Todavía no tienes recordatorios</div>
            <p className="text-sm text-ink-soft mt-1.5">
              Crea tu rutina base (entrada, asistencia, recreo, regreso y salida) en un clic.
            </p>
            <button
              onClick={crearRutinaBase}
              disabled={busy}
              aria-label="Crear mi rutina base"
              className="btn-3d mt-4 inline-flex items-center gap-2 h-11 px-5 rounded-xl text-sm font-semibold text-white disabled:opacity-60"
              style={{ background: "var(--gradient-neon)" }}
            >
              {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Wand2 className="h-4 w-4" aria-hidden="true" />}
              Crear mi rutina base
            </button>
          </div>
        ) : (
          <ul className="space-y-2.5">
            {recordatorios.map((r) => (
              <li key={r.id} className="rounded-2xl glass p-4 flex flex-wrap items-center gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-ink uppercase tracking-wide">{r.nombre}</span>
                    {!r.activo && (
                      <span className="text-[10px] uppercase tracking-[0.12em] rounded-full px-2 py-0.5 border border-border text-ink-soft">
                        Apagado
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-ink-soft mt-0.5">
                    {r.hora.slice(0, 5)} · {etiquetaDias(r.dias)}
                    {r.repetir ? " · se repite" : " · una vez"}
                  </div>
                  {r.mensaje && <p className="text-xs text-ink-soft/85 mt-1 italic">"{r.mensaje}"</p>}
                </div>
                <button
                  onClick={() => alternar(r)}
                  role="switch"
                  aria-checked={r.activo}
                  aria-label={`${r.activo ? "Desactivar" : "Activar"} recordatorio ${r.nombre}`}
                  className={`h-7 w-12 rounded-full transition-all relative ${r.activo ? "" : "bg-primary/8"}`}
                  style={r.activo ? { background: "var(--gradient-neon)" } : undefined}
                >
                  <span
                    className={`absolute top-1 h-5 w-5 rounded-full bg-white transition-all ${r.activo ? "left-6" : "left-1"}`}
                  />
                </button>
                <button
                  onClick={() =>
                    setDraft({
                      id: r.id,
                      nombre: r.nombre,
                      tipo: r.tipo,
                      hora: r.hora.slice(0, 5),
                      dias: r.dias ?? [],
                      mensaje: r.mensaje ?? "",
                      activo: r.activo,
                      repetir: r.repetir,
                    })
                  }
                  aria-label={`Editar ${r.nombre}`}
                  className="h-9 w-9 grid place-items-center rounded-xl glass text-ink-soft hover:text-ink"
                >
                  <Pencil className="h-4 w-4" aria-hidden="true" />
                </button>
                <button
                  onClick={() => eliminar(r)}
                  aria-label={`Eliminar ${r.nombre}`}
                  className="h-9 w-9 grid place-items-center rounded-xl glass text-ink-soft hover:text-ink"
                >
                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {draft && (
        <div className="rounded-3xl glass-strong p-6 space-y-4" style={{ boxShadow: "var(--glow-rainbow)" }}>
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-lg text-ink">
              {draft.id ? "Editar recordatorio" : "Nuevo recordatorio"}
            </h3>
            <button
              onClick={() => setDraft(null)}
              aria-label="Cerrar formulario"
              className="h-9 w-9 grid place-items-center rounded-xl glass text-ink-soft hover:text-ink"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <label className="block sm:col-span-2">
              <span className="text-[10px] uppercase tracking-[0.15em] text-ink-soft">Nombre</span>
              <input
                value={draft.nombre}
                onChange={(e) => setDraft({ ...draft, nombre: e.target.value })}
                placeholder={draft.tipo}
                className="mt-1.5 w-full h-11 px-4 rounded-xl bg-primary/5 border border-border text-sm text-ink focus:outline-none focus:border-[var(--neon-coral)]/40"
              />
            </label>
            <label className="block">
              <span className="text-[10px] uppercase tracking-[0.15em] text-ink-soft">Hora</span>
              <input
                type="time"
                value={draft.hora}
                onChange={(e) => setDraft({ ...draft, hora: e.target.value })}
                className="mt-1.5 w-full h-11 px-4 rounded-xl bg-primary/5 border border-border text-sm text-ink"
              />
            </label>
            <label className="block sm:col-span-3">
              <span className="text-[10px] uppercase tracking-[0.15em] text-ink-soft">Tipo</span>
              <select
                value={draft.tipo}
                onChange={(e) => setDraft({ ...draft, tipo: e.target.value })}
                className="mt-1.5 w-full h-11 px-3 rounded-xl bg-primary/5 border border-border text-sm text-ink"
              >
                {tiposRecordatorio.map((t) => (
                  <option key={t} value={t} className="bg-[oklch(0.16_0.015_265)]">
                    {t}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div>
            <span className="text-[10px] uppercase tracking-[0.15em] text-ink-soft">Días</span>
            <div className="mt-2 flex gap-1.5">
              {diasSemana.map((d) => {
                const on = draft.dias.includes(d.n);
                return (
                  <button
                    key={d.n}
                    onClick={() =>
                      setDraft({
                        ...draft,
                        dias: on ? draft.dias.filter((x) => x !== d.n) : [...draft.dias, d.n],
                      })
                    }
                    aria-pressed={on}
                    aria-label={d.largo}
                    className={`h-10 w-10 rounded-xl text-sm font-medium transition ${on ? "text-white" : "glass text-ink-soft"}`}
                    style={on ? { background: "var(--gradient-neon)" } : undefined}
                  >
                    {d.corto}
                  </button>
                );
              })}
            </div>
          </div>

          <label className="block">
            <span className="text-[10px] uppercase tracking-[0.15em] text-ink-soft">Mensaje personalizado</span>
            <textarea
              value={draft.mensaje}
              onChange={(e) => setDraft({ ...draft, mensaje: e.target.value })}
              rows={2}
              placeholder="Ej. Profesor, es momento de tomar lista de 2°C."
              className="mt-1.5 w-full px-4 py-3 rounded-xl bg-primary/5 border border-border text-sm text-ink focus:outline-none focus:border-[var(--neon-coral)]/40"
            />
          </label>

          <div className="flex flex-wrap items-center gap-4">
            <label className="inline-flex items-center gap-2 text-sm text-ink">
              <input
                type="checkbox"
                checked={draft.repetir}
                onChange={(e) => setDraft({ ...draft, repetir: e.target.checked })}
              />
              Repetir cada semana
            </label>
            <label className="inline-flex items-center gap-2 text-sm text-ink">
              <input
                type="checkbox"
                checked={draft.activo}
                onChange={(e) => setDraft({ ...draft, activo: e.target.checked })}
              />
              Activo
            </label>
            <button
              onClick={guardar}
              disabled={busy}
              aria-label="Guardar recordatorio"
              className="btn-3d ml-auto inline-flex items-center gap-2 h-11 px-5 rounded-xl text-sm font-semibold text-white disabled:opacity-60"
              style={{ background: "var(--gradient-neon)" }}
            >
              {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
              Guardar recordatorio
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
