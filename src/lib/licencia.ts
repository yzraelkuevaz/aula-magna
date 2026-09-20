import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getBackendErrorMessage } from "@/lib/backend-error";

/** Cliente sin tipar para la tabla/función de licencias (tipos generados aún sin ella). */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = supabase as any;

export interface Licencia {
  codigo: string;
  tipo: string;
  activa: boolean;
  expira_at: string | null;
}

export const MOTIVOS: Record<string, string> = {
  sin_sesion: "Tu sesión expiró. Vuelve a iniciar sesión e inténtalo de nuevo.",
  no_existe: "Ese código de licencia no existe. Revisa que esté escrito tal cual lo recibiste.",
  inactiva: "Esa licencia está desactivada. Solicita una nueva al equipo de SIED MX.",
  expirada: "Esa licencia ya venció. Solicita una nueva al equipo de SIED MX.",
  ya_usada: "Esa licencia ya la está usando otro docente. Solicita una propia.",
};

/** Canjea un código y lo asigna al docente autenticado. Devuelve un mensaje de error o null. */
export async function redimirLicencia(codigo: string): Promise<string | null> {
  try {
    const { data, error } = await db.rpc("redimir_licencia", { p_codigo: codigo });
    if (error) throw error;
    const res = data as { ok: boolean; motivo?: string } | null;
    if (res?.ok) return null;
    return MOTIVOS[res?.motivo ?? ""] ?? "No fue posible validar tu licencia.";
  } catch (err) {
    return getBackendErrorMessage(err);
  }
}

/** true si el docente autenticado tiene una licencia activa asignada. */
export async function tieneLicencia(): Promise<boolean> {
  const { data } = await db.from("licencias").select("codigo").eq("activa", true).limit(1);
  return (data?.length ?? 0) > 0;
}

/** Lee la licencia activa del docente autenticado (RLS: solo la suya). */
export function useLicencia() {
  const [loading, setLoading] = useState(true);
  const [licencia, setLicencia] = useState<Licencia | null>(null);
  const [error, setError] = useState<string | null>(null);

  const cargar = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: e } = await db
        .from("licencias")
        .select("codigo, tipo, activa, expira_at")
        .eq("activa", true)
        .limit(1);
      if (e) throw e;
      setLicencia((data?.[0] as Licencia | undefined) ?? null);
    } catch (err) {
      setError(getBackendErrorMessage(err));
      setLicencia(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void cargar();
  }, [cargar]);

  return { loading, licencia, error, recargar: cargar };
}
