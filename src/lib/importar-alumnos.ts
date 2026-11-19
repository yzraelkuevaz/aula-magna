/** Extrae nombres de alumnos de un texto pegado o un CSV (primera columna, una fila por alumno). */
export function parseNombresAlumnos(texto: string): string[] {
  const vistos = new Set<string>();
  const nombres: string[] = [];
  for (const linea of texto.split(/\r?\n/)) {
    const primera = linea.split(/[,;\t]/)[0]?.replace(/^"|"$/g, "").replace(/^\d+[.)-]?\s+/, "").trim() ?? "";
    if (!primera || /^nombre/i.test(primera)) continue;
    const clave = primera.toLowerCase();
    if (vistos.has(clave)) continue;
    vistos.add(clave);
    nombres.push(primera);
  }
  return nombres;
}
