import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { KeyRound, Loader2, LogOut, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { redimirLicencia, useLicencia } from "@/lib/licencia";

export const Route = createFileRoute("/_authenticated/licencia")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Activa tu licencia — SIED MX" },
      { name: "description", content: "Introduce el código de licencia que recibiste para activar tu espacio docente en SIED MX." },
      { property: "og:title", content: "Activa tu licencia — SIED MX" },
      { property: "og:description", content: "Activa tu licencia docente para entrar a SIED MX." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LicenciaPage,
});

function LicenciaPage() {
  const navigate = useNavigate();
  const { loading, licencia } = useLicencia();
  const [codigo, setCodigo] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && licencia) navigate({ to: "/app", replace: true });
  }, [loading, licencia, navigate]);

  const activar = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const error = await redimirLicencia(codigo);
    setBusy(false);
    if (error) return toast.error(error);
    toast.success("Licencia activada. ¡Bienvenido a SIED MX!");
    navigate({ to: "/app", replace: true });
  };

  const salir = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  };

  return (
    <main className="min-h-screen grid place-items-center bg-background text-foreground px-5 py-12">
      <div className="w-full max-w-md">
        <div className="rounded-3xl glass-strong p-7" style={{ boxShadow: "var(--glow-rainbow)" }}>
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-ink-soft">
            <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" /> Acceso con licencia
          </div>
          <h1 className="font-serif text-2xl text-ink mt-3">Activa tu licencia</h1>
          <p className="text-sm text-ink-soft mt-2">
            Tu cuenta ya existe. Para abrir tu espacio con datos propios, escribe el código de licencia
            que recibiste del equipo de SIED MX.
          </p>

          <form onSubmit={activar} className="mt-6 space-y-3">
            <label className="block">
              <span className="text-[10px] uppercase tracking-[0.15em] text-ink-soft">Código de licencia</span>
              <div className="mt-1.5 relative">
                <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-soft" aria-hidden="true" />
                <input
                  value={codigo}
                  required
                  onChange={(e) => setCodigo(e.target.value.toUpperCase())}
                  placeholder="SIEDMX-DEMO-01"
                  aria-label="Código de licencia"
                  className="w-full h-12 pl-10 pr-4 rounded-xl bg-primary/5 border border-border focus:outline-none focus:border-[var(--neon-coral)]/40 text-sm tracking-widest text-ink placeholder:text-ink-soft/60"
                />
              </div>
            </label>
            <button
              type="submit"
              disabled={busy || loading}
              aria-label="Activar licencia"
              className="w-full h-12 rounded-xl text-sm font-semibold text-white grid place-items-center disabled:opacity-60"
              style={{ background: "var(--gradient-neon)" }}
            >
              {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : "Activar y entrar"}
            </button>
          </form>

          <button
            type="button"
            onClick={salir}
            aria-label="Cerrar sesión"
            className="mt-5 w-full inline-flex items-center justify-center gap-2 text-xs text-ink-soft hover:text-ink transition"
          >
            <LogOut className="h-3.5 w-3.5" aria-hidden="true" /> Cerrar sesión
          </button>
        </div>
      </div>
    </main>
  );
}
