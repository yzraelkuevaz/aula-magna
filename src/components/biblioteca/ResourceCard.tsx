import { Star, Share2, Download, Eye, FileText, Video, Music, Presentation } from "lucide-react";
import { covers, type Resource } from "./data";

const typeIcon: Record<string, React.ComponentType<{ className?: string }>> = {
  "libro-sep": FileText,
  "libro-maestro": FileText,
  planeacion: FileText,
  formato: FileText,
  reglamento: FileText,
  video: Video,
  audio: Music,
  presentacion: Presentation,
  oficio: FileText,
};

interface Props {
  resource: Resource;
  onOpen: (r: Resource) => void;
  onToggleFav: (id: string) => void;
}

export function ResourceCard({ resource, onOpen, onToggleFav }: Props) {
  const Icon = typeIcon[resource.type] ?? FileText;
  return (
    <article className="card-lift card-lift-hover group rounded-3xl glass overflow-hidden flex flex-col">
      <button
        onClick={() => onOpen(resource)}
        className="relative aspect-[3/4] overflow-hidden"
        style={{ background: covers[resource.cover] }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute top-3 left-3 flex gap-1.5">
          <span className="text-[10px] uppercase tracking-wider bg-black/40 backdrop-blur text-white px-2 py-0.5 rounded-full font-medium ring-1 ring-white/20">
            {resource.category}
          </span>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); onToggleFav(resource.id); }}
          className="absolute top-3 right-3 h-8 w-8 rounded-full bg-black/40 backdrop-blur grid place-items-center hover:bg-black/60 transition ring-1 ring-white/20"
        >
          <Star className={`h-4 w-4 ${resource.favorite ? "fill-[var(--neon-coral)] text-[var(--neon-coral)]" : "text-white"}`} />
        </button>
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between text-white">
          <Icon className="h-8 w-8 opacity-90 drop-shadow" />
          {resource.grade && (
            <span className="text-[10px] font-semibold bg-black/40 backdrop-blur px-2 py-0.5 rounded-full ring-1 ring-white/20">
              {resource.grade}
            </span>
          )}
        </div>
        <div className="absolute inset-0 grid place-items-center opacity-0 group-hover:opacity-100 transition bg-black/30">
          <div className="inline-flex items-center gap-1.5 bg-primary text-primary-foreground px-4 py-2 rounded-full text-xs font-semibold shadow-[0_10px_24px_-6px_var(--neon-coral)]">
            <Eye className="h-3.5 w-3.5" />
            Vista previa
          </div>
        </div>
      </button>

      <div className="p-4 flex-1 flex flex-col gap-2">
        <h3 className="font-serif text-[15px] leading-snug text-ink line-clamp-2">{resource.title}</h3>
        <div className="text-xs text-ink-soft">{resource.author}</div>
        <div className="mt-auto flex items-center justify-between pt-2">
          <div className="text-[11px] text-ink-soft">
            {new Date(resource.date).toLocaleDateString("es-MX", { day: "numeric", month: "short", year: "numeric" })} · {resource.size}
          </div>
          <div className="flex items-center gap-0.5 text-ink-soft">
            <button className="h-7 w-7 rounded-lg grid place-items-center hover:bg-white/[0.06] hover:text-ink transition" title="Compartir">
              <Share2 className="h-3.5 w-3.5" />
            </button>
            <button className="h-7 w-7 rounded-lg grid place-items-center hover:bg-white/[0.06] hover:text-ink transition" title="Descargar">
              <Download className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
