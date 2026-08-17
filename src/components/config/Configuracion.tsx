import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { LogOut, Save, UserPlus, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { PerfilDocente } from "@/lib/perfil";

const niveles = ["Preescolar", "Primaria", "Secundaria"];
const grados = ["1°", "2°", "3°", "4°", "5°", "6°"];
const grupos = ["A", "B", "C", "D", "E"];

export function Configuracion({
  perfil, email, alumnos, onSaved,
}: {
  perfil: PerfilDocente;
  email: string | null;
  alumnos: { id: string; nombre: string }[];
  onSaved: () => void;
}) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    nombre: perfil.nombre,
    escuela: perfil.escuela ?? "",
    nivel: perfil.nivel ?? "Primaria",
    grado: perfil.grado ?? "",
    grupo: perfil.grupo ?? "",
    ciclo: perfil.ciclo ?? "2025 – 2026",
  });
  const [nuevoAlumno, setNuevoAlumno] = useState("");
  const [busy, setBusy] = useState(false);

  const guardar = async () => {
    setBusy(true);
    const { error } = await supabase
      .from("profiles")
      .update({ ...form })
      .eq("user_id", perfil.user_id);
    setBusy(false);
    if (error) return toast.error("No se pudo guardar tu perfil");
    toast.success("Perfil actualizado");
    onSaved();
  };

  const agregarAlumno = async () => {
    const nombre = nuevoAlumno.trim();
    if (!nombre) return;
    const { error } = await supabase.from("alumnos").insert({ nombre, user_id: perfil.user_id });
    if (error) return toast.error("No se pudo agregar el alumno");
    setNuevoAlumno("");
    toast.success("Alumno agregado");
    onSaved();
  };

  const borrarAlumno = async (id: string) => {
    const { error } = await supabase.from("alumnos").delete().eq("id", id);
    if (error) return toast.error("No se pudo eliminar");
    onSaved();
  };

  const salir = async () => {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  };

  return (
    <div className="px-5 lg:px-8 py-6 max-w-3xl space-y-6">
      <header>
        <h1 className="font-serif text-3xl text-ink">Configuración</h1>
        <p className="text-sm text-ink-soft mt-1">
          Datos de tu perfil docente{email ? ` · ${email}` : ""}
        </p>
      </header>

      <section className="rounded-3xl glass-strong p-6 space-y-4">
        <h2 className="font-serif text-xl text-ink">Perfil docente</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Text label="Nombre" value={form.nombre} onChange={(v) => setForm({ ...form, nombre: v })} />
          <Text label="Escuela" value={form.escuela} onChange={(v) => setForm({ ...form, escuela: v })} />
          <Select label="Nivel" value={form.nivel} options={niveles} onChange={(v) => setForm({ ...form, nivel: v })} />
          <Text label="Ciclo escolar" value={form.ciclo} onChange={(v) => setForm({ ...form, ciclo: v })} />
          <Select label="Grado" value={form.grado} options={grados} onChange={(v) => setForm({ ...form, grado: v })} />
          <Select label="Grupo" value={form.grupo} options={grupos} onChange={(v) => setForm({ ...form, grupo: v })} />
        </div>
        <button
          onClick={guardar}
          disabled={busy}
          aria-label="Guardar cambios del perfil"
          className="inline-flex items-center gap-2 h-11 px-5 rounded-xl text-sm font-semibold text-white disabled:opacity-60"
          style={{ background: "var(--gradient-neon)" }}
        >
          {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Save className="h-4 w-4" aria-hidden="true" />}
          Guardar
        </button>
      </section>

      <section className="rounded-3xl glass-strong p-6 space-y-4">
        <h2 className="font-serif text-xl text-ink">Mi grupo · {alumnos.length} alumnos</h2>
        <div className="flex gap-2">
          <input
            value={nuevoAlumno}
            onChange={(e) => setNuevoAlumno(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && agregarAlumno()}
            aria-label="Nombre del nuevo alumno"
            placeholder="Nombre del alumno"
            className="flex-1 h-11 px-4 rounded-xl bg-white/[0.06] border border-white/10 focus:outline-none focus:border-[var(--neon-coral)]/40 text-sm text-ink placeholder:text-ink-soft/60"
          />
          <button
            onClick={agregarAlumno}
            aria-label="Agregar alumno"
            className="inline-flex items-center gap-2 h-11 px-4 rounded-xl glass hover:border-white/25 text-sm text-ink"
          >
            <UserPlus className="h-4 w-4" aria-hidden="true" /> Agregar
          </button>
        </div>
        <ul className="divide-y divide-white/5">
          {alumnos.length === 0 && (
            <li className="py-4 text-sm text-ink-soft">Aún no has registrado alumnos en tu grupo.</li>
          )}
          {alumnos.map((a) => (
            <li key={a.id} className="py-2.5 flex items-center justify-between">
              <span className="text-sm text-ink">{a.nombre}</span>
              <button
                onClick={() => borrarAlumno(a.id)}
                aria-label={`Eliminar a ${a.nombre}`}
                className="h-8 w-8 grid place-items-center rounded-lg hover:bg-white/10 text-ink-soft"
              >
                <Trash2 className="h-4 w-4" aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-3xl glass p-6 flex items-center justify-between">
        <div>
          <div className="text-sm text-ink">Cerrar sesión</div>
          <p className="text-xs text-ink-soft mt-1">Saldrás de tu espacio y volverás a la pantalla de acceso.</p>
        </div>
        <button
          onClick={salir}
          aria-label="Cerrar sesión"
          className="inline-flex items-center gap-2 h-11 px-4 rounded-xl glass hover:border-white/25 text-sm text-ink"
        >
          <LogOut className="h-4 w-4" aria-hidden="true" /> Salir
        </button>
      </section>
    </div>
  );
}

function Text({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-[0.15em] text-ink-soft">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 w-full h-11 px-4 rounded-xl bg-white/[0.06] border border-white/10 focus:outline-none focus:border-[var(--neon-coral)]/40 text-sm text-ink"
      />
    </label>
  );
}

function Select({
  label, value, options, onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-[0.15em] text-ink-soft">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 w-full h-11 px-3 rounded-xl bg-white/[0.06] border border-white/10 focus:outline-none focus:border-[var(--neon-coral)]/40 text-sm text-ink"
      >
        <option value="">—</option>
        {options.map((o) => (
          <option key={o} value={o} className="bg-[oklch(0.16_0.015_265)]">
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}
