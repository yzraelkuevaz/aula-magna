import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/onboarding")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Configuración inicial — SIED MX" },
      { name: "description", content: "Configura tu perfil docente y crea tu grupo para comenzar a usar SIED MX con tus propios datos." },
      { property: "og:title", content: "Configuración inicial — SIED MX" },
      { property: "og:description", content: "Crea tu perfil docente y tu grupo en SIED MX." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Onboarding,
});

const niveles = ["Preescolar", "Primaria", "Secundaria"];
const grados = ["1°", "2°", "3°", "4°", "5°", "6°"];
const grupos = ["A", "B", "C", "D", "E"];

function Onboarding() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({
    nombre: "",
    escuela: "",
    nivel: "Primaria",
    grado: "",
    grupo: "",
    ciclo: "2025 – 2026",
  });
  const [listaAlumnos, setListaAlumnos] = useState("");

  useEffect(() => {
    void (async () => {
      const { data } = await supabase.auth.getUser();
      const user = data.user;
      if (!user) return;
      setUserId(user.id);
      const { data: perfiles } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .limit(1);
      const p = perfiles?.[0];
      if (p?.onboarding_completed) {
        navigate({ to: "/app", replace: true });
        return;
      }
      const meta = (user.user_metadata ?? {}) as { nombre?: string; full_name?: string; name?: string };
      setForm((f) => ({
        ...f,
        nombre: p?.nombre || meta.nombre || meta.full_name || meta.name || "",
        escuela: p?.escuela ?? "",
        nivel: p?.nivel ?? "Primaria",
        grado: p?.grado ?? "",
        grupo: p?.grupo ?? "",
      }));
      setLoading(false);
    })();
  }, [navigate]);

  const guardar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;
    setBusy(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .upsert(
          { user_id: userId, ...form, onboarding_completed: true, is_demo: false },
          { onConflict: "user_id" },
        );
      if (error) throw error;

      const nombres = listaAlumnos
        .split("\n")
        .map((n) => n.trim())
        .filter(Boolean);
      if (nombres.length > 0) {
        const { error: e2 } = await supabase
          .from("alumnos")
          .insert(nombres.map((nombre) => ({ nombre, user_id: userId })));
        if (e2) throw e2;
      }
      toast.success("¡Tu espacio está listo!");
      navigate({ to: "/app", replace: true });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "No se pudo guardar tu configuración");
    } finally {
      setBusy(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center bg-background text-ink-soft">
        <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background text-foreground px-5 py-12">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-ink-soft">
          <Sparkles className="h-3.5 w-3.5" aria-hidden="true" /> Configuración inicial
        </div>
        <h1 className="font-serif text-3xl lg:text-4xl text-ink mt-3">Bienvenido a SIED MX</h1>
        <p className="text-sm text-ink-soft mt-2">
          Cuéntanos quién eres y crea tu grupo. Todo lo que registres pertenece solo a tu cuenta.
        </p>

        <form onSubmit={guardar} className="mt-8 rounded-3xl glass-strong p-6 space-y-5" style={{ boxShadow: "var(--glow-rainbow)" }}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Text label="Tu nombre" value={form.nombre} onChange={(v) => setForm({ ...form, nombre: v })} required />
            <Text label="Escuela" value={form.escuela} onChange={(v) => setForm({ ...form, escuela: v })} />
            <Select label="Nivel" value={form.nivel} options={niveles} onChange={(v) => setForm({ ...form, nivel: v })} />
            <Text label="Ciclo escolar" value={form.ciclo} onChange={(v) => setForm({ ...form, ciclo: v })} />
            <Select label="Grado" value={form.grado} options={grados} onChange={(v) => setForm({ ...form, grado: v })} required />
            <Select label="Grupo" value={form.grupo} options={grupos} onChange={(v) => setForm({ ...form, grupo: v })} required />
          </div>

          <label className="block">
            <span className="text-[10px] uppercase tracking-[0.15em] text-ink-soft">
              Alumnos (opcional · un nombre por línea)
            </span>
            <textarea
              value={listaAlumnos}
              onChange={(e) => setListaAlumnos(e.target.value)}
              rows={6}
              placeholder={"Ana Beltrán\nLuis Ramírez\n..."}
              className="mt-1.5 w-full px-4 py-3 rounded-xl bg-white/[0.06] border border-white/10 focus:outline-none focus:border-[var(--neon-coral)]/40 text-sm text-ink placeholder:text-ink-soft/60"
            />
          </label>

          <button
            type="submit"
            disabled={busy}
            className="w-full h-12 rounded-xl text-sm font-semibold text-white grid place-items-center disabled:opacity-60"
            style={{ background: "var(--gradient-neon)" }}
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : "Crear mi espacio"}
          </button>
        </form>
      </div>
    </main>
  );
}

function Text({
  label, value, onChange, required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-[0.15em] text-ink-soft">{label}</span>
      <input
        value={value}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 w-full h-11 px-4 rounded-xl bg-white/[0.06] border border-white/10 focus:outline-none focus:border-[var(--neon-coral)]/40 text-sm text-ink"
      />
    </label>
  );
}

function Select({
  label, value, options, onChange, required,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-[0.15em] text-ink-soft">{label}</span>
      <select
        value={value}
        required={required}
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
