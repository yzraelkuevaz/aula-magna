/**
 * Datos base del módulo Planeaciones.
 * Fuente única de verdad para el panorama, la gráfica de campos formativos,
 * el repositorio y el contexto que usa el IAsistente.
 */

export interface PlanContext {
  ciclo: string;
  grado: string;
  grupo: string;
  docente: string;
  campoFormativo: string;
  contenido: string;
  pda: string;
  proposito: string;
  intencion: string;
  metodologia: string;
  proyecto: string;
  actividades: { fase: "Inicio" | "Desarrollo" | "Cierre"; descripcion: string }[];
  evaluacion: string[];
  recursos: string[];
  inclusion: string[];
}

export const planActual: PlanContext = {
  ciclo: "2025 – 2026",
  grado: "4°",
  grupo: "B",
  docente: "Docente (demo)",
  campoFormativo: "Saberes y Pensamiento Científico",
  contenido: "Fracciones equivalentes y comparación",
  pda: "Compara fracciones usando representaciones concretas y gráficas.",
  proposito:
    "Que los estudiantes comparen y ordenen fracciones a partir de situaciones reales.",
  intencion: "Movilizar el sentido numérico mediante representaciones múltiples.",
  metodologia: "Aprendizaje Basado en Problemas (ABP)",
  proyecto: "La tienda de la comunidad",
  actividades: [
    {
      fase: "Inicio",
      descripcion:
        "Presentación del problema: repartir pizzas en la tienda de la comunidad. Pregunta detonadora: ¿cuándo dos fracciones representan lo mismo?",
    },
    {
      fase: "Desarrollo",
      descripcion:
        "Trabajo en equipos con tiras de fracciones. Comparación gráfica y numérica. Registro en cuaderno con evidencias.",
    },
    {
      fase: "Cierre",
      descripcion:
        "Puesta en común y elaboración de un cartel colectivo. Autoevaluación con lista de cotejo.",
    },
  ],
  evaluacion: ["Lista de cotejo", "Rúbrica de 4 niveles", "Autoevaluación"],
  recursos: ["Tiras de fracciones", "Tijeras", "Cartulinas", "Marcadores"],
  inclusion: [
    "Material concreto para estudiantes con BAP",
    "Tiempo extendido",
    "Apoyo visual y consignas cortas",
  ],
};

export interface PlaneacionRegistro {
  id: string;
  titulo: string;
  campo: string;
  proyecto: string;
  grado: string;
  semana: string;
  cumplimiento: number;
  estado: "Lista" | "En curso" | "Borrador";
  fecha: string;
  color: string;
}

/** Planeaciones registradas del ciclo (base del repositorio y de la gráfica). */
export const planeaciones: PlaneacionRegistro[] = [
  {
    id: "p-s24-fracciones",
    titulo: "Fracciones equivalentes con material concreto",
    campo: "Saberes y Pensamiento Científico",
    proyecto: "La tienda de la comunidad",
    grado: "4°",
    semana: "S24",
    cumplimiento: 92,
    estado: "Lista",
    fecha: "Hoy",
    color: "var(--neon-cyan)",
  },
  {
    id: "p-s23-diario",
    titulo: "El diario del explorador — narrativa personal",
    campo: "Lenguajes",
    proyecto: "Narrativa personal",
    grado: "4°",
    semana: "S23",
    cumplimiento: 100,
    estado: "En curso",
    fecha: "Ayer",
    color: "var(--neon-coral)",
  },
  {
    id: "p-s22-convivencia",
    titulo: "Convivencia sin violencia — asamblea de aula",
    campo: "Ética, Naturaleza y Sociedades",
    proyecto: "Comunidad segura",
    grado: "4°",
    semana: "S22",
    cumplimiento: 88,
    estado: "Lista",
    fecha: "Lun",
    color: "var(--neon-pink)",
  },
  {
    id: "p-s21-bienestar",
    titulo: "Cuerpo, emociones y bienestar",
    campo: "De lo Humano y lo Comunitario",
    proyecto: "Yo me cuido",
    grado: "4°",
    semana: "S21",
    cumplimiento: 75,
    estado: "Borrador",
    fecha: "Vie",
    color: "var(--neon-amber)",
  },
  {
    id: "p-s20-ecosistemas",
    titulo: "Ecosistemas de mi entorno",
    campo: "Saberes y Pensamiento Científico",
    proyecto: "Naturaleza viva",
    grado: "4°",
    semana: "S20",
    cumplimiento: 100,
    estado: "Lista",
    fecha: "S20",
    color: "var(--neon-lime)",
  },
];

const coloresCampo: Record<string, string> = {
  "Lenguajes": "oklch(0.72 0.19 25)",
  "Saberes y Pensamiento Científico": "oklch(0.78 0.15 200)",
  "Ética, Naturaleza y Sociedades": "oklch(0.68 0.24 340)",
  "De lo Humano y lo Comunitario": "oklch(0.62 0.20 295)",
};

export interface CampoDistribucion {
  name: string;
  count: number;
  value: number; // porcentaje entero
  color: string;
}

/** Calcula la distribución real de planeaciones por campo formativo. */
export function distribucionCampos(
  registros: PlaneacionRegistro[] = planeaciones,
): CampoDistribucion[] {
  const total = registros.length;
  if (total === 0) return [];

  const conteo = new Map<string, number>();
  for (const r of registros) conteo.set(r.campo, (conteo.get(r.campo) ?? 0) + 1);

  return [...conteo.entries()]
    .map(([name, count]) => ({
      name,
      count,
      value: Math.round((count / total) * 100),
      color: coloresCampo[name] ?? "oklch(0.72 0.15 240)",
    }))
    .sort((a, b) => b.count - a.count);
}
