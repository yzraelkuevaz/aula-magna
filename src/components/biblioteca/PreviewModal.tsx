import { useEffect } from "react";
import { X, Download, Share2, Star, FileText } from "lucide-react";
import type { Resource } from "./data";
import { covers } from "./data";

interface Props {
  resource: Resource | null;
  onClose: () => void;
  onToggleFav: (id: string) => void;
}

export function PreviewModal({ resource, onClose, onToggleFav }: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!resource) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200" role="dialog" aria-modal>
      <div className="absolute inset-0 bg-ink/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-6xl h-[88vh] bg-surface-elevated rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row animate-in zoom-in-95 duration-300">

        {/* Info panel */}
        <aside className="w-full lg:w-[340px] shrink-0 border-b lg:border-b-0 lg:border-r border-border flex flex-col">
          <div
            className="h-40 lg:h-56 relative"
            style={{ background: covers[resource.cover] }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            <button onClick={onClose} className="lg:hidden absolute top-3 right-3 h-9 w-9 rounded-full bg-white/90 grid place-items-center">
              <X className="h-4 w-4" />
            </button>
            <FileText className="absolute bottom-4 left-5 h-10 w-10 text-white/90" />
          </div>
          <div className="p-6 flex-1 overflow-y-auto">
            <div className="text-[11px] uppercase tracking-[0.15em] text-ink-soft">{resource.category}</div>
            <h2 className="font-serif text-2xl leading-snug mt-2 text-ink">{resource.title}</h2>
            <div className="text-sm text-ink-soft mt-1">{resource.author}</div>

            <dl className="mt-6 space-y-3 text-sm">
              {resource.grade && <Row k="Grado" v={resource.grade} />}
              {resource.subject && <Row k="Materia" v={resource.subject} />}
              <Row k="Tipo" v={resource.type.replace("-", " ")} />
              <Row k="Fecha" v={new Date(resource.date).toLocaleDateString("es-MX", { day: "numeric", month: "long", year: "numeric" })} />
              <Row k="Peso" v={resource.size} />
              {resource.pages && <Row k="Páginas" v={String(resource.pages)} />}
            </dl>

            <div className="mt-6 flex flex-wrap gap-2">
              <button
                onClick={() => onToggleFav(resource.id)}
                className={`inline-flex items-center gap-1.5 h-9 px-3 rounded-lg text-sm border transition ${
                  resource.favorite ? "bg-primary/10 border-primary/30 text-primary" : "border-border hover:bg-secondary"
                }`}
              >
                <Star className={`h-4 w-4 ${resource.favorite ? "fill-primary" : ""}`} />
                Favorito
              </button>
              <button className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg text-sm border border-border hover:bg-secondary transition">
                <Share2 className="h-4 w-4" />
                Compartir
              </button>
              <button className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg text-sm bg-primary text-primary-foreground hover:brightness-105 transition">
                <Download className="h-4 w-4" />
                Descargar
              </button>
            </div>
          </div>
        </aside>

        {/* Preview surface */}
        <div className="relative flex-1 bg-secondary/50">
          <button onClick={onClose} className="hidden lg:grid absolute top-4 right-4 z-10 h-10 w-10 rounded-full bg-surface-elevated shadow place-items-center hover:bg-secondary transition">
            <X className="h-4 w-4" />
          </button>
          {resource.pdfUrl ? (
            <iframe
              title={resource.title}
              src={resource.pdfUrl}
              className="w-full h-full bg-white"
            />
          ) : (
            <div className="w-full h-full grid place-items-center text-center p-10">
              <div className="max-w-sm">
                <div className="mx-auto h-16 w-16 rounded-2xl bg-primary/10 grid place-items-center text-primary mb-4">
                  <FileText className="h-7 w-7" />
                </div>
                <div className="font-serif text-xl text-ink">Vista previa no disponible</div>
                <p className="text-sm text-ink-soft mt-2">
                  Este recurso puede descargarse o abrirse en su reproductor externo.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between border-b border-border/60 pb-2">
      <dt className="text-ink-soft text-xs uppercase tracking-wider">{k}</dt>
      <dd className="text-ink capitalize">{v}</dd>
    </div>
  );
}
