import { useEffect, useState } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { BookOpen, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";

export const Route = createFileRoute("/auth")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Acceso docente — SIED MX" },
      { name: "description", content: "Inicia sesión o crea tu cuenta docente para acceder a tu propio espacio en SIED MX: tu grupo, tus planeaciones y tus evaluaciones." },
      { property: "og:title", content: "Acceso docente — SIED MX" },
      { property: "og:description", content: "Inicia sesión o crea tu cuenta docente en SIED MX." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [modo, setModo] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nombre, setNombre] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    void supabase.auth.getUser().then(({ data }) => {
      if (data.user) navigate({ to: "/app", replace: true });
    });
  }, [navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (modo === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/app`,
            data: { nombre },
          },
        });
        if (error) throw error;
        toast.success("Cuenta creada. Continúa con tu configuración inicial.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
      const { data } = await supabase.auth.getUser();
      if (data.user) navigate({ to: "/app", replace: true });
      else toast.info("Revisa tu correo para confirmar la cuenta y luego inicia sesión.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "No fue posible completar el acceso");
    } finally {
      setBusy(false);
    }
  };

  const google = async () => {
    setBusy(true);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      setBusy(false);
      toast.error("No fue posible iniciar sesión con Google");
      return;
    }
    if (result.redirected) return;
    navigate({ to: "/app", replace: true });
  };

  return (
    <main className="min-h-screen grid place-items-center px-5 py-12 bg-background text-foreground">
      <div className="w-full max-w-md">
        <div className="flex items-center gap-3 justify-center mb-8">
          <div
            className="h-11 w-11 rounded-2xl grid place-items-center ring-1 ring-white/20"
            style={{ background: "var(--gradient-neon)" }}
          >
            <BookOpen className="h-5 w-5 text-white" aria-hidden="true" />
          </div>
          <div className="leading-tight">
            <div className="font-serif text-xl text-ink">SIED MX</div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-ink-soft">Acceso docente</div>
          </div>
        </div>

        <div className="rounded-3xl glass-strong p-7" style={{ boxShadow: "var(--glow-rainbow)" }}>
          <h1 className="font-serif text-2xl text-ink">
            {modo === "login" ? "Inicia sesión" : "Crea tu cuenta"}
          </h1>
          <p className="text-sm text-ink-soft mt-1.5">
            Cada docente tiene su propio espacio: su grupo, sus planeaciones y sus evaluaciones.
          </p>

          <button
            type="button"
            onClick={google}
            disabled={busy}
            className="mt-6 w-full h-12 rounded-xl glass hover:border-white/25 text-sm font-medium text-ink transition disabled:opacity-60"
          >
            Continuar con Google
          </button>

          <div className="my-5 flex items-center gap-3 text-[10px] uppercase tracking-[0.15em] text-ink-soft">
            <span className="h-px flex-1 bg-white/10" /> o con tu correo <span className="h-px flex-1 bg-white/10" />
          </div>

          <form onSubmit={submit} className="space-y-3">
            {modo === "signup" && (
              <Field label="Nombre del docente" value={nombre} onChange={setNombre} placeholder="Ej. Ana López" required />
            )}
            <Field label="Correo" type="email" value={email} onChange={setEmail} placeholder="docente@correo.com" required />
            <Field label="Contraseña" type="password" value={password} onChange={setPassword} placeholder="••••••••" required />

            <button
              type="submit"
              disabled={busy}
              className="w-full h-12 rounded-xl text-sm font-semibold text-white grid place-items-center transition disabled:opacity-60"
              style={{ background: "var(--gradient-neon)" }}
            >
              {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : modo === "login" ? "Entrar" : "Crear cuenta"}
            </button>
          </form>

          <button
            type="button"
            onClick={() => setModo(modo === "login" ? "signup" : "login")}
            className="mt-5 w-full text-xs text-ink-soft hover:text-ink transition"
          >
            {modo === "login" ? "No tengo cuenta — registrarme" : "Ya tengo cuenta — iniciar sesión"}
          </button>
        </div>

        <div className="mt-6 text-center">
          <Link to="/" className="text-xs text-ink-soft hover:text-ink transition">
            Volver al inicio
          </Link>
        </div>
      </div>
    </main>
  );
}

function Field({
  label, value, onChange, type = "text", placeholder, required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-[0.15em] text-ink-soft">{label}</span>
      <input
        type={type}
        value={value}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-1.5 w-full h-12 px-4 rounded-xl bg-white/[0.06] border border-white/10 focus:border-[var(--neon-coral)]/40 focus:outline-none focus:ring-4 focus:ring-[var(--neon-coral)]/15 text-sm text-ink placeholder:text-ink-soft/60 transition"
      />
    </label>
  );
}
