import { BookOpen, GraduationCap, ClipboardList, FileType, Scale, Video, Music, FileText } from "lucide-react";

const categories = [
  { key: "libro-sep", label: "Libros SEP", icon: BookOpen, count: 214, cover: "ocean" },
  { key: "libro-maestro", label: "Libros del Maestro", icon: GraduationCap, count: 96, cover: "lilac" },
  { key: "planeacion", label: "Planeaciones", icon: ClipboardList, count: 148, cover: "clay" },
  { key: "formato", label: "Formatos", icon: FileType, count: 72, cover: "sage" },
  { key: "reglamento", label: "Reglamentos", icon: Scale, count: 24, cover: "rose" },
  { key: "video", label: "Videos", icon: Video, count: 63, cover: "forest" },
  { key: "audio", label: "Audios", icon: Music, count: 41, cover: "ochre" },
  { key: "oficio", label: "Oficios", icon: FileText, count: 33, cover: "ink" },
] as const;

const gradientMap: Record<string, string> = {
  clay:   "from-[oklch(0.82_0.17_55)] to-[oklch(0.62_0.20_35)]",
  sage:   "from-[oklch(0.82_0.18_145)] to-[oklch(0.58_0.16_155)]",
  ochre:  "from-[oklch(0.86_0.16_80)] to-[oklch(0.70_0.18_55)]",
  lilac:  "from-[oklch(0.74_0.20_300)] to-[oklch(0.52_0.20_285)]",
  ink:    "from-[oklch(0.42_0.06_265)] to-[oklch(0.20_0.03_265)]",
  rose:   "from-[oklch(0.78_0.22_350)] to-[oklch(0.58_0.24_340)]",
  ocean:  "from-[oklch(0.78_0.15_230)] to-[oklch(0.50_0.20_250)]",
  forest: "from-[oklch(0.78_0.15_200)] to-[oklch(0.45_0.14_215)]",
};

interface Props {
  onSelect: (key: string) => void;
}

export function CategoryCards({ onSelect }: Props) {
  return (
    <section className="px-5 lg:px-10 mt-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {categories.map(({ key, label, icon: Icon, count, cover }) => (
          <button
            key={key}
            onClick={() => onSelect(key)}
            className="card-lift card-lift-hover group relative overflow-hidden rounded-3xl aspect-[4/3] text-left glass p-4 flex flex-col justify-between"
          >
            {/* Ícono con degradado vívido tipo referencia */}
            <div className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${gradientMap[cover]} grid place-items-center shadow-[0_10px_24px_-6px_oklch(0_0_0/60%)] ring-1 ring-white/15`}>
              <Icon className="h-6 w-6 text-white drop-shadow" />
            </div>

            {/* Glow halo del color del ícono, solo en hover */}
            <div
              className={`pointer-events-none absolute -inset-4 opacity-0 group-hover:opacity-70 transition-opacity duration-500 blur-2xl bg-gradient-to-br ${gradientMap[cover]}`}
              style={{ zIndex: -1 }}
            />

            <div>
              <div className="font-serif text-lg leading-tight text-ink">{label}</div>
              <div className="text-xs text-ink-soft mt-0.5">{count} recursos</div>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
