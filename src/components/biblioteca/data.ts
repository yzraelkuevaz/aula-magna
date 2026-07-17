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
  cover: string; // gradient key
  favorite?: boolean;
  pdfUrl?: string;
}

// Curated gradients (semantic — no arbitrary hex in components)
export const covers: Record<string, string> = {
  clay: "linear-gradient(135deg, oklch(0.72 0.14 40) 0%, oklch(0.55 0.15 30) 100%)",
  sage: "linear-gradient(135deg, oklch(0.78 0.08 155) 0%, oklch(0.52 0.09 165) 100%)",
  ochre: "linear-gradient(135deg, oklch(0.82 0.13 80) 0%, oklch(0.62 0.14 60) 100%)",
  lilac: "linear-gradient(135deg, oklch(0.78 0.09 300) 0%, oklch(0.52 0.12 290) 100%)",
  ink: "linear-gradient(135deg, oklch(0.42 0.05 250) 0%, oklch(0.22 0.03 260) 100%)",
  rose: "linear-gradient(135deg, oklch(0.82 0.09 20) 0%, oklch(0.58 0.14 15) 100%)",
  ocean: "linear-gradient(135deg, oklch(0.72 0.09 230) 0%, oklch(0.42 0.11 245) 100%)",
  forest: "linear-gradient(135deg, oklch(0.62 0.09 145) 0%, oklch(0.32 0.06 155) 100%)",
};

// A free CORS-friendly sample PDF for the preview modal
const SAMPLE_PDF = "https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf";

export const resources: Resource[] = [
  { id: "r1", title: "Lengua Materna. Español", author: "SEP", category: "Libro de texto", type: "libro-sep", grade: "3°", subject: "Español", date: "2024-08-01", size: "12.4 MB", pages: 224, cover: "clay", pdfUrl: SAMPLE_PDF },
  { id: "r2", title: "Matemáticas — Cuaderno de trabajo", author: "SEP", category: "Libro de texto", type: "libro-sep", grade: "4°", subject: "Matemáticas", date: "2024-08-01", size: "9.8 MB", pages: 180, cover: "ocean", pdfUrl: SAMPLE_PDF },
  { id: "r3", title: "Ciencias Naturales", author: "SEP", category: "Libro de texto", type: "libro-sep", grade: "5°", subject: "Ciencias", date: "2024-08-15", size: "14.1 MB", pages: 210, cover: "forest", pdfUrl: SAMPLE_PDF },
  { id: "r4", title: "Guía para el Maestro", author: "SEP", category: "Docente", type: "libro-maestro", grade: "2°", subject: "Multigrado", date: "2024-07-20", size: "18.2 MB", pages: 320, cover: "ink", favorite: true, pdfUrl: SAMPLE_PDF },
  { id: "r5", title: "Planeación semanal — Valores", author: "Mtra. Alicia R.", category: "Planeación", type: "planeacion", grade: "2°", subject: "Formación cívica", date: "2025-10-11", size: "0.4 MB", cover: "ochre", pdfUrl: SAMPLE_PDF },
  { id: "r6", title: "Formato de evaluación diagnóstica", author: "SIED MX", category: "Formato", type: "formato", date: "2025-09-02", size: "0.2 MB", cover: "sage", pdfUrl: SAMPLE_PDF },
  { id: "r7", title: "Reglamento escolar 2025", author: "SEP", category: "Normatividad", type: "reglamento", date: "2025-01-10", size: "1.1 MB", cover: "lilac", pdfUrl: SAMPLE_PDF },
  { id: "r8", title: "Cuento: El árbol de las palabras", author: "Ana Ruiz", category: "Lectura", type: "libro-sep", grade: "2°", subject: "Español", date: "2025-03-14", size: "2.6 MB", pages: 32, cover: "rose", favorite: true, pdfUrl: SAMPLE_PDF },
  { id: "r9", title: "Video: Fracciones con material concreto", author: "Canal SIED", category: "Tutorial", type: "video", grade: "4°", subject: "Matemáticas", date: "2025-05-20", size: "84 MB", cover: "ocean" },
  { id: "r10", title: "Audio: Lecturas para primaria", author: "Radio SIED", category: "Audio", type: "audio", date: "2025-04-01", size: "22 MB", cover: "sage" },
  { id: "r11", title: "Presentación: Efemérides de noviembre", author: "Mtro. José P.", category: "Presentación", type: "presentacion", date: "2025-10-30", size: "3.2 MB", cover: "ochre", pdfUrl: SAMPLE_PDF },
  { id: "r12", title: "Oficio de comisión — modelo", author: "SIED MX", category: "Oficio", type: "oficio", date: "2025-08-11", size: "0.1 MB", cover: "clay", pdfUrl: SAMPLE_PDF },
];

export const continueReading = resources.slice(0, 4).map((r, i) => ({
  ...r,
  progress: [0.62, 0.28, 0.85, 0.14][i],
}));

export const recentlyAdded = [resources[8], resources[7], resources[4], resources[10], resources[5], resources[2]];
export const aiRecommended = [resources[7], resources[4], resources[10], resources[2], resources[3], resources[8]];
