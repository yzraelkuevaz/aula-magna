import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, XCircle, Loader2, Activity } from "lucide-react";

export const Route = createFileRoute("/estado")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Estado del sistema — SIED MX" },
      {
        name: "description",
        content:
          "Verificación en vivo de la conexión de SIED MX con su servicio de datos, autenticación y variables de configuración.",
      },
      { property: "og:title", content: "Estado del sistema — SIED MX" },
      {
        property: "og:description",
        content: "Diagnóstico en vivo de la conexión de SIED MX.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: EstadoPage,
});

type Check = {
  nombre: string;
  estado: "pendiente" | "ok" | "fail";
  detalle: string;
};

function EstadoPage() {
  const [checks, setChecks] = useState<Check[]>([
    { nombre: "Configuración de conexión", estado: "pendiente", detalle: "Comprobando…" },
    { nombre: "Cliente de datos", estado: "pendiente", detalle: "Comprobando…" },
    { nombre: "Base de datos", estado: "pendiente", detalle: "Comprobando…" },
    { nombre: "Sesión / autenticación", estado: "pendiente", detalle: "Comprobando…" },
  ]);

  useEffect(() => {
    let activo = true;
    const set = (i: number, estado: Check["estado"], detalle: string) => {
      if (!activo) return;
      setChecks((prev) => prev.map((c, idx) => (idx === i ? { ...c, estado, detalle } : c)));
    };

    void (async () => {
      const url = import.meta.env["VITE_SUPABASE_URL"];
      const key = import.meta.env["VITE_SUPABASE_PUBLISHABLE_KEY"];
      const faltan = [!url && "dirección del servicio", !key && "clave pública"].filter(Boolean);

      if (faltan.length) {
        set(0, "fail", `Falta: ${faltan.join(" y ")}`);
        set(1, "fail", "No se pudo crear el cliente");
        set(2, "fail", "Sin conexión");
        set(3, "fail", "Sin conexión");
        return;
      }
      set(0, "ok", "Dirección y clave pública disponibles");

      try {
        const { supabase } = await import("@/integrations/supabase/client");
        set(1, "ok", "Cliente inicializado correctamente");

        const { error } = await supabase.from("profiles").select("id", { head: true, count: "exact" });
        if (error && error.code !== "PGRST116") {
          set(2, "fail", error.message);
        } else {
          set(2, "ok", "Consulta de prueba respondida");
        }

        const { error: authError } = await supabase.auth.getSession();
        set(
          3,
          authError ? "fail" : "ok",
          authError ? authError.message : "Servicio de acceso disponible",
        );
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        set(1, "fail", msg);
        set(2, "fail", "No verificado");
        set(3, "fail", "No verificado");
      }
    })();

    return () => {
      activo = false;
    };
  }, []);

  const todoOk = checks.every((c) => c.estado === "ok");
  const algunFail = checks.some((c) => c.estado === "fail");

  return (
    <main className="min-h-screen px-5 py-14 bg-background text-foreground">
      <div className="mx-auto w-full max-w-2xl">
        <div className="flex items-center gap-3 mb-8">
          <div className="h-11 w-11 rounded-2xl grid place-items-center icon-3d">
            <Activity className="h-5 w-5 text-white" aria-hidden="true" />
          </div>
          <div className="leading-tight">
            <h1 className="font-serif text-2xl text-ink">Estado del sistema</h1>
            <p className="text-[11px] uppercase tracking-[0.18em] text-ink-soft">SIED MX</p>
          </div>
        </div>

        <div className="rounded-3xl glass-strong p-6">
          <p className="text-sm text-ink-soft">
            {algunFail
              ? "Hay una verificación con problemas. El detalle aparece abajo."
              : todoOk
                ? "Todas las verificaciones respondieron correctamente."
                : "Ejecutando verificaciones…"}
          </p>

          <ul className="mt-5 divide-y divide-border">
            {checks.map((c) => (
              <li key={c.nombre} className="flex items-start gap-3 py-4">
                <span className="mt-0.5">
                  {c.estado === "ok" ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-500" aria-hidden="true" />
                  ) : c.estado === "fail" ? (
                    <XCircle className="h-5 w-5 text-destructive" aria-hidden="true" />
                  ) : (
                    <Loader2 className="h-5 w-5 animate-spin text-ink-soft" aria-hidden="true" />
                  )}
                </span>
                <div className="min-w-0">
                  <div className="text-sm font-medium text-ink">
                    {c.nombre}{" "}
                    <span className="text-xs font-normal text-ink-soft">
                      {c.estado === "ok" ? "· OK" : c.estado === "fail" ? "· FALLA" : ""}
                    </span>
                  </div>
                  <div className="text-xs text-ink-soft break-words">{c.detalle}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6 flex gap-4">
          <Link to="/" className="text-xs text-ink-soft hover:text-ink transition">
            Volver al inicio
          </Link>
          <Link to="/auth" className="text-xs text-ink-soft hover:text-ink transition">
            Ir al acceso
          </Link>
        </div>
      </div>
    </main>
  );
}
