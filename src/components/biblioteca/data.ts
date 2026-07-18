export type ResourceType =
  | "libro-sep"
  | "libro-maestro"
  | "planeacion"
  | "formato"
  | "reglamento"
  | "video"
  | "audio"
  | "presentacion"
  | "oficio";

export interface Resource {
  id: string;
  title: string;
  author: string;
  category: string;
  type: ResourceType;
  grade?: string;
  subject?: string;
  date: string;
  size: string;
  pages?: number;
  cover: string;
  favorite?: boolean;
  pdfUrl?: string;
}

/* Gradientes vívidos tipo íconos de la referencia — azul, naranja, rosa, morado, verde, cyan */
export const covers: Record<string, string> = {
  clay:   "linear-gradient(135deg, oklch(0.82 0.17 55) 0%, oklch(0.62 0.20 35) 100%)",   // naranja
  sage:   "linear-gradient(135deg, oklch(0.82 0.18 145) 0%, oklch(0.58 0.16 155) 100%)", // verde neón
  ochre:  "linear-gradient(135deg, oklch(0.86 0.16 80) 0%, oklch(0.70 0.18 55) 100%)",   // ámbar
  lilac:  "linear-gradient(135deg, oklch(0.74 0.20 300) 0%, oklch(0.52 0.20 285) 100%)", // violeta
  ink:    "linear-gradient(135deg, oklch(0.42 0.06 265) 0%, oklch(0.20 0.03 265) 100%)", // grafito
  rose:   "linear-gradient(135deg, oklch(0.78 0.22 350) 0%, oklch(0.58 0.24 340) 100%)", // rosa neón
  ocean:  "linear-gradient(135deg, oklch(0.78 0.15 230) 0%, oklch(0.50 0.20 250) 100%)", // azul
  forest: "linear-gradient(135deg, oklch(0.78 0.15 200) 0%, oklch(0.45 0.14 215) 100%)", // cyan
};

const SAMPLE_PDF = "https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf";

export const resources: Resource[] = [
  { id: "r1", title: "Lengua Materna. Español", author: "SEP", category: "Libro de texto", type: "libro-sep", grade: "3°", subject: "Español", date: "2024-08-01", size: "12.4 MB", pages: 224, cover: "clay", pdfUrl: SAMPLE_PDF },
  { id: "r2", title: "Matemáticas — Cuaderno de trabajo", author: "SEP", category: "Libro de texto", type: "libro-sep", grade: "4°", subject: "Matemáticas", date: "2024-08-01", size: "9.8 MB", pages: 180, cover: "ocean", pdfUrl: SAMPLE_PDF },
  { id: "r3", title: "Ciencias Naturales", author: "SEP", category: "Libro de texto", type: "libro-sep", grade: "5°", subject: "Ciencias", date: "2024-08-15", size: "14.1 MB", pages: 210, cover: "forest", pdfUrl: SAMPLE_PDF },
  { id: "r4", title: "Guía para el Maestro", author: "SEP", category: "Docente", type: "libro-maestro", grade: "2°", subject: "Multigrado", date: "2024-07-20", size: "18.2 MB", pages: 320, cover: "lilac", favorite: true, pdfUrl: SAMPLE_PDF },
  { id: "r5", title: "Planeación semanal — Valores", author: "Mtra. Alicia R.", category: "Planeación", type: "planeacion", grade: "2°", subject: "Formación cívica", date: "2025-10-11", size: "0.4 MB", cover: "ochre", pdfUrl: SAMPLE_PDF },
  { id: "r6", title: "Formato de evaluación diagnóstica", author: "SIED MX", category: "Formato", type: "formato", date: "2025-09-02", size: "0.2 MB", cover: "sage", pdfUrl: SAMPLE_PDF },
  { id: "r7", title: "Reglamento escolar 2025", author: "SEP", category: "Normatividad", type: "reglamento", date: "2025-01-10", size: "1.1 MB", cover: "lilac", pdfUrl: SAMPLE_PDF },
  { id: "r8", title: "Cuento: El árbol de las palabras", author: "Ana Ruiz", category: "Lectura", type: "libro-sep", grade: "2°", subject: "Español", date: "2025-03-14", size: "2.6 MB", pages: 32, cover: "rose", favorite: true, pdfUrl: SAMPLE_PDF },
  { id: "r9", title: "Video: Fracciones con material concreto", author: "Canal SIED", category: "Tutorial", type: "video", grade: "4°", subject: "Matemáticas", date: "2025-05-20", size: "84 MB", cover: "ocean" },
  { id: "r10", title: "Audio: Lecturas para primaria", author: "Radio SIED", category: "Audio", type: "audio", date: "2025-04-01", size: "22 MB", cover: "sage" },
  { id: "r11", title: "Presentación: Efemérides de noviembre", author: "Mtro. José P.", category: "Presentación", type: "presentacion", date: "2025-10-30", size: "3.2 MB", cover: "ochre", pdfUrl: SAMPLE_PDF },
  { id: "r12", title: "Oficio de comisión — modelo", author: "SIED MX", category: "Oficio", type: "oficio", date: "2025-08-11", size: "0.1 MB", cover: "rose", pdfUrl: SAMPLE_PDF },
];

export const continueReading = resources.slice(0, 4).map((r, i) => ({
  ...r,
  progress: [0.62, 0.28, 0.85, 0.14][i],
}));

export const recentlyAdded = [resources[8], resources[7], resources[4], resources[10], resources[5], resources[2]];
export const aiRecommended = [resources[7], resources[4], resources[10], resources[2], resources[3], resources[8]];
