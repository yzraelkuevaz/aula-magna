import { planActual, type PlanContext } from "@/components/planeaciones/planData";

/**
 * Motor del IAsistente. Analiza realmente la consulta del docente
 * (intención + tema + grado) y compone una respuesta usando el contexto
 * de la planeación activa. Todo el procesamiento es local y determinista:
 * no depende de servicios externos.
 */

export type Intencion =
  | "actividad"
  | "inicio"
  | "cierre"
  | "evaluacion"
  | "adecuacion"
  | "recursos"
  | "planeacion"
  | "normativa"
  | "general";

const normaliza = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

const contiene = (t: string, palabras: string[]) => palabras.some((p) => t.includes(p));

export function detectarIntencion(texto: string): Intencion {
  const t = normaliza(texto);
  if (contiene(t, ["evalua", "evaluar", "rubrica", "lista de cotejo", "calific", "instrumento"]))
    return "evaluacion";
  if (contiene(t, ["adapta", "adecua", "apoyo", "bap", "inclusi", "necesidades", "rezago"]))
    return "adecuacion";
  if (contiene(t, ["cierre", "cerrar", "conclu"])) return "cierre";
  if (contiene(t, ["inicio", "detonad", "arrancar", "motivar", "iniciar"])) return "inicio";
  if (contiene(t, ["recurso", "material", "video", "libro sep", "audio", "juego"]))
    return "recursos";
  if (contiene(t, ["planeacion", "planeaci", "secuencia", "semanal", "proyecto"]))
    return "planeacion";
  if (contiene(t, ["reglamento", "normativ", "acta", "citatorio", "juridic", "legal"]))
    return "normativa";
  if (contiene(t, ["actividad", "dinamica", "ejercicio", "propon", "sugiere", "cuento", "juego"]))
    return "actividad";
  return "general";
}

/** Temas pedagógicos reconocidos con su campo formativo y ejemplos concretos. */
const temas: {
  clave: string;
  claves: string[];
  campo: string;
  enfoque: string;
  actividad: string;
  producto: string;
  criterio: string;
  material: string;
}[] = [
  {
    clave: "fracciones",
    claves: ["fraccion", "fracciones", "quebrado", "mitad", "tercio", "decimal"],
    campo: "Saberes y Pensamiento Científico",
    enfoque: "comparación de fracciones con representaciones concretas y gráficas",
    actividad:
      "reparto de tiras de papel: cada equipo divide la misma tira en medios, cuartos y octavos, luego busca equivalencias y las registra en una tabla",
    producto: "tabla de equivalencias y cartel colectivo del equipo",
    criterio: "compara fracciones justificando con material concreto o dibujo",
    material: "tiras de fracciones, tijeras, cartulina y marcadores",
  },
  {
    clave: "comprension lectora",
    claves: ["comprension", "lectora", "lectura", "leer", "texto", "cuento", "narrativa"],
    campo: "Lenguajes",
    enfoque: "comprensión lectora en sus tres niveles (literal, inferencial y crítico)",
    actividad:
      "lectura en voz alta por turnos de un texto breve, marcado de palabras clave y respuesta a tres preguntas: qué dice, qué deduzco, qué opino",
    producto: "ficha de lectura con las tres preguntas resueltas",
    criterio: "recupera información explícita e infiere el propósito del texto",
    material: "texto impreso, resaltadores y ficha de lectura",
  },
  {
    clave: "multiplicacion",
    claves: ["multiplic", "tablas", "division", "dividir"],
    campo: "Saberes y Pensamiento Científico",
    enfoque: "cálculo mental y resolución de problemas multiplicativos",
    actividad:
      "mercado del salón: cada equipo compra y vende productos con precios enteros y calcula totales con arreglos rectangulares",
    producto: "notas de venta con el procedimiento escrito",
    criterio: "resuelve problemas multiplicativos y explica su procedimiento",
    material: "billetes didácticos, etiquetas de precios y cuaderno",
  },
  {
    clave: "escritura",
    claves: ["escrib", "redacc", "ortograf", "texto propio", "diario"],
    campo: "Lenguajes",
    enfoque: "producción escrita con proceso de planeación, borrador y revisión",
    actividad:
      "diario del explorador: escriben un episodio real de su semana, lo revisan en pareja con una guía de tres preguntas y publican la versión final",
    producto: "texto final publicado en el mural del aula",
    criterio: "organiza sus ideas en párrafos y revisa su escrito",
    material: "cuaderno, guía de revisión y mural del aula",
  },
  {
    clave: "convivencia",
    claves: ["convivencia", "valores", "emocion", "violencia", "respeto", "acuerdos"],
    campo: "Ética, Naturaleza y Sociedades",
    enfoque: "construcción de acuerdos y resolución pacífica de conflictos",
    actividad:
      "asamblea de aula: se plantea un caso del grupo, cada estudiante propone una salida y se votan tres acuerdos que se firman",
    producto: "cartel de acuerdos firmado por el grupo",
    criterio: "participa con respeto y propone soluciones pacíficas",
    material: "cartulina, tarjetas de propuestas y plumones",
  },
  {
    clave: "ciencias",
    claves: ["ciencia", "experimento", "ecosistema", "cuerpo", "plantas", "germina", "materia"],
    campo: "Saberes y Pensamiento Científico",
    enfoque: "indagación científica con registro de observaciones",
    actividad:
      "montaje de un experimento por equipo con hipótesis inicial, observación diaria durante cinco días y conclusión final",
    producto: "bitácora de observación con hipótesis y conclusión",
    criterio: "formula una hipótesis y la contrasta con lo observado",
    material: "frascos, semillas o materiales del experimento y bitácora",
  },
];

function detectarTema(texto: string) {
  const t = normaliza(texto);
  return temas.find((tema) => tema.claves.some((k) => t.includes(k)));
}

function encabezado(ctx: PlanContext) {
  return `Contexto: ${ctx.grado} ${ctx.grupo} · ${ctx.campoFormativo} · ${ctx.contenido}`;
}

export function responderConsulta(consulta: string, ctx: PlanContext = planActual): string {
  const q = consulta.trim();
  if (!q) return "Escribe tu petición y la trabajo con los datos de tu planeación activa.";

  const intencion = detectarIntencion(q);
  const tema = detectarTema(q);
  const foco = tema ? tema.enfoque : ctx.contenido;
  const campo = tema ? tema.campo : ctx.campoFormativo;

  switch (intencion) {
    case "evaluacion":
      return [
        `Sobre "${q}"`,
        encabezado(ctx),
        "",
        `Para evaluar ${foco} te propongo tres instrumentos que ya se alinean con tu PDA (“${ctx.pda}”):`,
        `1. Lista de cotejo de proceso — 5 indicadores observables durante el desarrollo.`,
        `2. Rúbrica de 4 niveles con el criterio central: ${tema ? tema.criterio : "cumple el PDA con apoyo, en proceso, autónomo o lo explica a otros"}.`,
        `3. Autoevaluación breve al cierre (3 preguntas: qué aprendí, qué me costó, qué necesito).`,
        "",
        `Evidencia sugerida: ${tema ? tema.producto : ctx.actividades[2]?.descripcion ?? "producto del cierre"}.`,
        `Ya registrado en tu planeación: ${ctx.evaluacion.join(", ")}.`,
      ].join("\n");

    case "adecuacion":
      return [
        `Sobre "${q}"`,
        encabezado(ctx),
        "",
        `Adecuaciones para trabajar ${foco} con estudiantes que requieren mayor apoyo:`,
        `• Reducir la consigna a un solo paso a la vez y modelarlo frente al grupo.`,
        `• Sustituir la parte abstracta por material concreto (${tema ? tema.material : ctx.recursos.join(", ")}).`,
        `• Tiempo extendido y trabajo en pareja tutora dentro del equipo.`,
        `• Evaluar con el mismo criterio pero con apoyo visual y respuesta oral.`,
        "",
        `Adecuaciones ya declaradas en la planeación: ${ctx.inclusion.join("; ")}.`,
      ].join("\n");

    case "cierre":
      return [
        `Sobre "${q}"`,
        encabezado(ctx),
        "",
        `Actividad de cierre para ${foco} (10–15 min):`,
        `• Puesta en común: cada equipo presenta ${tema ? tema.producto : "su producto"} en 1 minuto.`,
        `• Síntesis colectiva en el pizarrón con la idea central del día.`,
        `• Boleto de salida: una pregunta escrita que responde el propósito “${ctx.proposito}”.`,
        "",
        `Cierre actual de tu planeación: ${ctx.actividades.find((a) => a.fase === "Cierre")?.descripcion ?? "sin registrar"}.`,
      ].join("\n");

    case "inicio":
      return [
        `Sobre "${q}"`,
        encabezado(ctx),
        "",
        `Inicio para ${foco} (10 min):`,
        `• Pregunta detonadora abierta ligada al proyecto “${ctx.proyecto}”.`,
        `• Recuperación de saberes previos en lluvia de ideas registrada en el pizarrón.`,
        `• Presentación del reto del día y del criterio con el que se evaluará.`,
        "",
        `Inicio actual: ${ctx.actividades.find((a) => a.fase === "Inicio")?.descripcion ?? "sin registrar"}.`,
      ].join("\n");

    case "recursos":
      return [
        `Sobre "${q}"`,
        encabezado(ctx),
        "",
        `Recursos pertinentes para ${foco} en ${ctx.grado}:`,
        `• Material concreto: ${tema ? tema.material : ctx.recursos.join(", ")}.`,
        `• Libro de texto SEP del campo ${campo}, sección correspondiente al contenido.`,
        `• Un recurso audiovisual corto (máx. 4 min) como disparador, no como explicación central.`,
        "",
        `Recursos ya listados en la planeación: ${ctx.recursos.join(", ")}.`,
      ].join("\n");

    case "planeacion":
      return [
        `Sobre "${q}"`,
        encabezado(ctx),
        "",
        `Estructura sugerida para ${foco} (${ctx.metodologia}):`,
        `• Inicio: situación problema del proyecto “${ctx.proyecto}”.`,
        `• Desarrollo: ${tema ? tema.actividad : ctx.actividades.find((a) => a.fase === "Desarrollo")?.descripcion}.`,
        `• Cierre: socialización de ${tema ? tema.producto : "productos"} y autoevaluación.`,
        "",
        `PDA que articula la secuencia: ${ctx.pda}`,
        `Intención didáctica: ${ctx.intencion}`,
      ].join("\n");

    case "normativa":
      return [
        `Sobre "${q}"`,
        "",
        "Este tipo de consulta corresponde al Centro Jurídico (normativa, actas, citatorios y formatos).",
        "Ese módulo aún no tiene documentos cargados, por lo que no puedo citar normativa sin inventarla.",
        "Lo que sí puedo hacer ahora: redactar contigo el borrador del reglamento interno de tu grupo a partir de los acuerdos del aula.",
      ].join("\n");

    case "actividad":
    default:
      return [
        `Sobre "${q}"`,
        encabezado(ctx),
        "",
        tema
          ? `Actividad para ${tema.enfoque} en ${ctx.grado} ${ctx.grupo} (campo: ${tema.campo}):`
          : `Interpreté tu petición como una propuesta de trabajo para ${ctx.contenido}:`,
        `• Consigna: ${tema ? tema.actividad : ctx.actividades.find((a) => a.fase === "Desarrollo")?.descripcion}.`,
        `• Organización: equipos heterogéneos de 4 integrantes, 35–40 min.`,
        `• Producto: ${tema ? tema.producto : "registro en el cuaderno con evidencia gráfica"}.`,
        `• Criterio de logro: ${tema ? tema.criterio : ctx.pda}.`,
        "",
        `Se vincula con el propósito de tu planeación: “${ctx.proposito}”.`,
        intencion === "general"
          ? "Si buscabas otra cosa, dime si quieres inicio, desarrollo, cierre, evaluación, adecuaciones o recursos."
          : "",
      ]
        .filter(Boolean)
        .join("\n");
  }
}
