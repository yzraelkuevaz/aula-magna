import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface Recordatorio {
  id: string;
  user_id: string;
  nombre: string;
  tipo: string;
  hora: string;
  dias: number[];
  mensaje: string | null;
  activo: boolean;
  repetir: boolean;
}

export const tiposRecordatorio = [
  "Entrada",
  "Tomar asistencia",
  "Recreo",
  "Regreso del recreo",
  "Salida",
  "Llamar a familia",
  "Entregar evaluación",
  "Revisar tareas",
  "Aplicar evaluación",
  "Capturar calificaciones",
  "Reunión",
  "Consejo Técnico",
  "Personalizado",
];

export const diasSemana = [
  { n: 1, corto: "L", largo: "Lunes" },
  { n: 2, corto: "M", largo: "Martes" },
  { n: 3, corto: "M", largo: "Miércoles" },
  { n: 4, corto: "J", largo: "Jueves" },
  { n: 5, corto: "V", largo: "Viernes" },
  { n: 6, corto: "S", largo: "Sábado" },
  { n: 0, corto: "D", largo: "Domingo" },
];

export function hoyISO(): string {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

export function horaActual(): string {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, "0");
  return `${p(d.getHours())}:${p(d.getMinutes())}`;
}

export function etiquetaDias(dias: number[]): string {
  const orden = [1, 2, 3, 4, 5];
  const esLaV = orden.every((d) => dias.includes(d)) && !dias.includes(0) && !dias.includes(6);
  if (esLaV) return "Lunes a viernes";
  if (dias.length === 0) return "Sin días";
  return diasSemana
    .filter((d) => dias.includes(d.n))
    .map((d) => d.largo.slice(0, 3))
    .join(" · ");
}

/** Recordatorios del docente + estado de la rutina de hoy (asistencia registrada o no). */
export function useRutina(userId: string | null) {
  const [loading, setLoading] = useState(true);
  const [recordatorios, setRecordatorios] = useState<Recordatorio[]>([]);
  const [asistenciaHoy, setAsistenciaHoy] = useState(0);

  const cargar = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    const [{ data: recs }, { count }] = await Promise.all([
      supabase.from("recordatorios").select("*").order("hora"),
      supabase
        .from("asistencia")
        .select("id", { count: "exact", head: true })
        .eq("fecha", hoyISO()),
    ]);
    setRecordatorios((recs ?? []) as Recordatorio[]);
    setAsistenciaHoy(count ?? 0);
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    void cargar();
  }, [cargar]);

  return { loading, recordatorios, asistenciaHoy, recargar: cargar };
}

/** Recordatorios base que se crean la primera vez que el docente abre su rutina. */
export function recordatoriosBase(userId: string, horas: { entrada?: string | null; recreo?: string | null; salida?: string | null }) {
  return [
    { user_id: userId, nombre: "Entrada", tipo: "Entrada", hora: horas.entrada || "08:00", dias: [1, 2, 3, 4, 5], mensaje: "Inicio de jornada." },
    { user_id: userId, nombre: "Tomar asistencia", tipo: "Tomar asistencia", hora: "08:15", dias: [1, 2, 3, 4, 5], mensaje: "Es momento de tomar lista de tu grupo." },
    { user_id: userId, nombre: "Recreo", tipo: "Recreo", hora: horas.recreo || "10:30", dias: [1, 2, 3, 4, 5], mensaje: "Hora del recreo." },
    { user_id: userId, nombre: "Regreso del recreo", tipo: "Regreso del recreo", hora: "11:00", dias: [1, 2, 3, 4, 5], mensaje: "Regreso a clases." },
    { user_id: userId, nombre: "Salida", tipo: "Salida", hora: horas.salida || "13:00", dias: [1, 2, 3, 4, 5], mensaje: "Fin de la jornada." },
  ];
}
