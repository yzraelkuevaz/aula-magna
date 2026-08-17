import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

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
  is_demo: boolean;
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
  const [alumnos, setAlumnos] = useState<{ id: string; nombre: string }[]>([]);
  const [email, setEmail] = useState<string | null>(null);

  const cargar = useCallback(async () => {
    setLoading(true);
    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;
    if (!user) {
      setPerfil(null);
      setAlumnos([]);
      setLoading(false);
      return;
    }
    setEmail(user.email ?? null);

    const [{ data: perfiles }, { data: als }] = await Promise.all([
      supabase.from("profiles").select("*").eq("user_id", user.id).limit(1),
      supabase.from("alumnos").select("id, nombre").order("nombre"),
    ]);

    setPerfil((perfiles?.[0] as PerfilDocente | undefined) ?? null);
    setAlumnos(als ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    void cargar();
  }, [cargar]);

  return { loading, perfil, alumnos, email, recargar: cargar };
}
