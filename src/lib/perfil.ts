import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getBackendErrorMessage } from "@/lib/backend-error";

export interface PerfilDocente {
  id: string;
  user_id: string;
  nombre: string;
  escuela: string | null;
  nivel: string | null;
  grado: string | null;
  grupo: string | null;
  ciclo: string | null;
  onboarding_completed: boolean;
  tutorial_completed: boolean;
  is_demo: boolean;
}

export interface AlumnoBasico {
  id: string;
  nombre: string;
  foto_path?: string | null;
}

export function inicialesDe(nombre: string): string {
  const partes = nombre.trim().split(/\s+/).filter(Boolean);
  if (partes.length === 0) return "SM";
  const letras = partes.slice(0, 2).map((p) => p[0]?.toUpperCase() ?? "");
  return letras.join("") || "SM";
}

export function grupoLabel(p: PerfilDocente | null): string {
  if (!p) return "Sin grupo asignado";
  const g = [p.grado, p.grupo].filter(Boolean).join("");
  return [g || null, p.nivel].filter(Boolean).join(" · ") || "Sin grupo asignado";
}

/** Carga el perfil del usuario autenticado (RLS: solo el suyo) y sus alumnos. */
export function usePerfil() {
  const [loading, setLoading] = useState(true);
  const [perfil, setPerfil] = useState<PerfilDocente | null>(null);
  const [alumnos, setAlumnos] = useState<AlumnoBasico[]>([]);
  const [email, setEmail] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const cargar = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: userData, error: authError } = await supabase.auth.getUser();
      if (authError) throw authError;
      const user = userData.user;
      if (!user) {
        setPerfil(null);
        setAlumnos([]);
        setUserId(null);
        return;
      }
      setEmail(user.email ?? null);
      setUserId(user.id);

      const [perfilRes, alumnosRes] = await Promise.all([
        supabase.from("profiles").select("*").eq("user_id", user.id).limit(1),
        supabase.from("alumnos").select("id, nombre, foto_path").order("nombre"),
      ]);

      if (perfilRes.error) throw perfilRes.error;
      if (alumnosRes.error) throw alumnosRes.error;

      setPerfil((perfilRes.data?.[0] as PerfilDocente | undefined) ?? null);
      setAlumnos((alumnosRes.data as AlumnoBasico[] | null) ?? []);
    } catch (err) {
      console.error("[SIED MX] No se pudo cargar el perfil docente:", err);
      setError(getBackendErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void cargar();
  }, [cargar]);

  return { loading, perfil, alumnos, email, userId, error, recargar: cargar };
}
