import { BookOpen, GraduationCap, ClipboardList, FileType, Scale, Video, Music, FileText } from "lucide-react";

const categories = [
  { key: "libro-sep", label: "Libros SEP", icon: BookOpen, count: 214, cover: "clay" },
  { key: "libro-maestro", label: "Libros del Maestro", icon: GraduationCap, count: 96, cover: "ink" },
  { key: "planeacion", label: "Planeaciones", icon: ClipboardList, count: 148, cover: "ochre" },
  { key: "formato", label: "Formatos", icon: FileType, count: 72, cover: "sage" },
  { key: "reglamento", label: "Reglamentos", icon: Scale, count: 24, cover: "lilac" },
  { key: "video", label: "Videos", icon: Video, count: 63, cover: "ocean" },
  { key: "audio", label: "Audios", icon: Music, count: 41, cover: "forest" },
  { key: "oficio", label: "Oficios", icon: FileText, count: 33, cover: "rose" },
] as const;

const gradientMap: Record<string, string> = {
  clay: "from-[oklch(0.78_0.11_45)] to-[oklch(0.58_0.15_30)]",
  ink: "from-[oklch(0.48_0.05_250)] to-[oklch(0.22_0.03_260)]",
  ochre: "from-[oklch(0.85_0.12_80)] to-[oklch(0.62_0.14_60)]",
  sage: "from-[oklch(0.80_0.08_155)] to-[oklch(0.50_0.09_165)]",
  lilac: "from-[oklch(0.80_0.09_300)] to-[oklch(0.52_0.12_290)]",
  ocean: "from-[oklch(0.76_0.09_230)] to-[oklch(0.42_0.11_245)]",
  forest: "from-[oklch(0.66_0.09_145)] to-[oklch(0.32_0.06_155)]",
  rose: "from-[oklch(0.85_0.09_20)] to-[oklch(0.58_0.14_15)]",
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
            className="card-lift card-lift-hover group relative overflow-hidden rounded-2xl aspect-[4/3] text-left shadow-[var(--shadow-soft)]"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${gradientMap[cover]}`} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            <div className="absolute inset-0 opacity-20 mix-blend-overlay"
              style={{ background: "radial-gradient(120% 60% at 100% 0%, #fff, transparent)" }}
            />
            <div className="relative h-full p-5 flex flex-col justify-between text-primary-foreground">
              <div className="h-10 w-10 rounded-xl bg-white/15 backdrop-blur grid place-items-center">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <div className="font-serif text-lg leading-tight">{label}</div>
                <div className="text-xs opacity-80 mt-0.5">{count} recursos</div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
