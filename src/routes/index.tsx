import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Filter } from "lucide-react";
import { Sidebar } from "@/components/biblioteca/Sidebar";
import { TopBar } from "@/components/biblioteca/TopBar";
import { Dashboard } from "@/components/biblioteca/Dashboard";
import { Hero } from "@/components/biblioteca/Hero";
import { CategoryCards } from "@/components/biblioteca/CategoryCards";
import { ResourceRow } from "@/components/biblioteca/ResourceRow";
import { ResourceCard } from "@/components/biblioteca/ResourceCard";
import { PreviewModal } from "@/components/biblioteca/PreviewModal";
import { AIPanel } from "@/components/biblioteca/AIPanel";
import { MomentoRibbon } from "@/components/biblioteca/MomentoRibbon";
import { CommandPalette } from "@/components/biblioteca/CommandPalette";
import { MiAula } from "@/components/aula/MiAula";
import { CentroEvaluacion } from "@/components/evaluacion/CentroEvaluacion";
import { Planeaciones } from "@/components/planeaciones/Planeaciones";
import { ModuloPendiente } from "@/components/shared/ModuloPendiente";
import { resources as seed, continueReading, recentlyAdded, aiRecommended, type Resource } from "@/components/biblioteca/data";

export const Route = createFileRoute("/")({
  component: BibliotecaViva,
});

const pendingModules: Record<string, { title: string; description: string }> = {
  agenda: { title: "Agenda escolar", description: "Calendario oficial del ciclo, efemérides, consejos técnicos y recordatorios del grupo." },
  juridico: { title: "Centro Jurídico", description: "Normativa, actas, citatorios y formatos legales para el docente." },
  bitacoras: { title: "Bitácoras", description: "Registro diario de la práctica docente con evidencias y seguimiento." },
  evidencias: { title: "Evidencias", description: "Portafolio de fotos, videos y productos de los alumnos." },
  documentos: { title: "Documentos", description: "Generación y resguardo de documentos oficiales del docente." },
  comunidad: { title: "Comunidad", description: "Red de docentes para compartir recursos y experiencias." },
  tic: { title: "Centro TIC", description: "Herramientas digitales y capacitación tecnológica." },
  reportes: { title: "Reportes", description: "Informes automáticos de grupo, evaluación y planeación." },
  config: { title: "Configuración", description: "Datos del docente, grupo, escuela y preferencias de la plataforma." },
};

const filterGroups = [
  { label: "Grado", options: ["1°", "2°", "3°", "4°", "5°", "6°"] },
  { label: "Asignatura", options: ["Español", "Matemáticas", "Ciencias", "Cívica"] },
  { label: "Tipo", options: ["Libro SEP", "Planeación", "Formato", "Reglamento", "Video", "Audio"] },
  { label: "Fuente", options: ["SEP", "Propio", "Compartido", "Favorito"] },
];


function BibliotecaViva() {
  const [active, setActive] = useState("escritorio");
  const [query, setQuery] = useState("");
  const [preview, setPreview] = useState<Resource | null>(null);
  const [aiOpen, setAiOpen] = useState(false);
  const [resources, setResources] = useState(seed);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const toggleFav = (id: string) =>
    setResources((rs) => rs.map((r) => (r.id === id ? { ...r, favorite: !r.favorite } : r)));

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return resources;
    return resources.filter((r) =>
      [r.title, r.author, r.category, r.subject ?? "", r.grade ?? "", r.type]
        .join(" ")
        .toLowerCase()
        .includes(q),
    );
  }, [query, resources]);

  const openAI = () => setAiOpen(true);

  // "ia" no es una pantalla: abre el panel del IAsistente y mantiene la vista actual.
  const handleSelect = (key: string) => {
    if (key === "ia") {
      setAiOpen(true);
      return;
    }
    setQuery("");
    setActive(key);
  };

  const showDashboard = active === "escritorio" && !query.trim();
  const showAula = active === "aula";
  const showEvaluacion = active === "evaluaciones";
  const showPlaneaciones = active === "planeaciones";
  const showBiblioteca = active === "biblioteca" || active === "recursos";
  const pendiente = pendingModules[active];

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      <Sidebar active={active} onSelect={handleSelect} />

      <main className="flex-1 min-w-0">
        <TopBar
          query={query}
          onQuery={setQuery}
          onCommand={() => setPaletteOpen(true)}
          onNavigate={handleSelect}
        />

        {query.trim() ? (
          <SearchResults
            query={query}
            results={filtered}
            onOpen={setPreview}
            onToggleFav={toggleFav}
            filtersOpen={filtersOpen}
            setFiltersOpen={setFiltersOpen}
          />
        ) : showDashboard ? (
          <Dashboard onAskAI={openAI} onNavigate={handleSelect} />
        ) : showAula ? (
          <MiAula onAskAI={openAI} />
        ) : showEvaluacion ? (
          <CentroEvaluacion onAskAI={openAI} />
        ) : showPlaneaciones ? (
          <Planeaciones onAskAI={openAI} />
        ) : showBiblioteca ? (

          <>
            <MomentoRibbon name="Profesor Israel" />
            <Hero query={query} onQuery={setQuery} onAskAI={openAI} />

            <div className="px-5 lg:px-10 mt-10 flex items-baseline justify-between">
              <h2 className="font-serif text-2xl lg:text-[28px] text-ink tracking-tight">Explora por categoría</h2>
              <button
                onClick={() => setFiltersOpen((o) => !o)}
                className="inline-flex items-center gap-1.5 text-sm text-ink-soft hover:text-ink"
              >
                <Filter className="h-4 w-4" />
                Filtros
              </button>
            </div>
            {filtersOpen && <FiltersBar />}

            <CategoryCards onSelect={(key) => setQuery(key)} />

            <ContinueReading items={continueReading} onOpen={setPreview} onToggleFav={toggleFav} />

            <ResourceRow
              title="Recientemente agregados"
              subtitle="Lo más nuevo de la biblioteca"
              resources={recentlyAdded}
              onOpen={setPreview}
              onToggleFav={toggleFav}
            />

            <ResourceRow
              title="Recomendados por IA"
              subtitle="Basado en tu grado, materia y actividad reciente"
              resources={aiRecommended}
              onOpen={setPreview}
              onToggleFav={toggleFav}
              action={
                <span className="text-[10px] uppercase tracking-[0.15em] bg-ink text-background px-2.5 py-1 rounded-full font-medium">
                  IA
                </span>
              }
            />

            <footer className="mt-24 py-10 px-5 lg:px-10 border-t border-border text-center text-xs text-ink-soft">
              Biblioteca Viva · Un órgano de SIED MX · Diseñado para docentes
            </footer>
          </>
        ) : (
          <ModuloPendiente
            title={pendiente?.title ?? "Módulo no disponible"}
            description={
              pendiente?.description ??
              "Este destino aún no tiene una pantalla asignada dentro de SIED MX."
            }
            onBack={() => setActive("escritorio")}
          />
        )}

      </main>

      <PreviewModal resource={preview} onClose={() => setPreview(null)} onToggleFav={toggleFav} />
      <AIPanel open={aiOpen} onClose={() => setAiOpen(false)} />
      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} onOpenResource={setPreview} />
    </div>
  );
}

function FiltersBar() {
  return (
    <div className="px-5 lg:px-10 mt-4 animate-in fade-in slide-in-from-top-2 duration-300">
      <div className="rounded-2xl bg-surface-elevated border border-border p-4 flex flex-wrap gap-x-8 gap-y-3">
        {filterGroups.map((g) => (
          <div key={g.label}>
            <div className="text-[10px] uppercase tracking-[0.15em] text-ink-soft mb-1.5">{g.label}</div>
            <div className="flex flex-wrap gap-1.5">
              {g.options.map((o) => (
                <button
                  key={o}
                  className="text-xs px-2.5 py-1 rounded-full border border-border hover:border-primary/40 hover:text-primary transition"
                >
                  {o}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ContinueReading({
  items, onOpen,
}: {
  items: (Resource & { progress: number })[];
  onOpen: (r: Resource) => void;
  onToggleFav: (id: string) => void;
}) {
  return (
    <section className="px-5 lg:px-10 mt-14">
      <div className="flex items-end justify-between mb-5">
        <div>
          <h2 className="font-serif text-2xl lg:text-[28px] text-ink tracking-tight">Continuar leyendo</h2>
          <p className="text-sm text-ink-soft mt-1">Retoma justo donde te quedaste</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((r) => (
          <button
            key={r.id}
            onClick={() => onOpen(r)}
            className="card-lift card-lift-hover group flex gap-4 rounded-2xl bg-surface-elevated border border-border p-4 text-left overflow-hidden shadow-[var(--shadow-soft)]"
          >
            <div
              className="h-24 w-20 shrink-0 rounded-xl relative overflow-hidden"
              style={{ background: `linear-gradient(135deg, oklch(0.72 0.13 60), oklch(0.5 0.15 30))` }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            </div>
            <div className="flex-1 min-w-0 flex flex-col">
              <div className="text-[10px] uppercase tracking-[0.15em] text-ink-soft">{r.category}</div>
              <div className="font-serif text-base text-ink line-clamp-2 mt-0.5">{r.title}</div>
              <div className="text-xs text-ink-soft mt-1">{r.author}</div>
              <div className="mt-auto pt-3">
                <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all"
                    style={{ width: `${Math.round(r.progress * 100)}%` }}
                  />
                </div>
                <div className="mt-1.5 text-[11px] text-ink-soft">{Math.round(r.progress * 100)}% completado</div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}

function SearchResults({
  query, results, onOpen, onToggleFav, filtersOpen, setFiltersOpen,
}: {
  query: string;
  results: Resource[];
  onOpen: (r: Resource) => void;
  onToggleFav: (id: string) => void;
  filtersOpen: boolean;
  setFiltersOpen: (v: boolean) => void;
}) {
  return (
    <div className="px-5 lg:px-10 py-8">
      <div className="flex items-baseline justify-between gap-4 flex-wrap">
        <div>
          <div className="text-xs uppercase tracking-[0.15em] text-ink-soft">Resultados</div>
          <h1 className="font-serif text-3xl lg:text-4xl text-ink mt-1">
            {results.length} para <span className="italic">"{query}"</span>
          </h1>
        </div>
        <button
          onClick={() => setFiltersOpen(!filtersOpen)}
          className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border border-border text-sm hover:bg-secondary transition"
        >
          <Filter className="h-4 w-4" /> Filtros
        </button>
      </div>
      {filtersOpen && <div className="mt-4"><FiltersBar /></div>}
      {results.length === 0 ? (
        <div className="mt-16 text-center text-ink-soft">
          <div className="font-serif text-xl text-ink">Sin resultados</div>
          <p className="mt-2 text-sm">Intenta con otras palabras o pregúntale al IAsistente.</p>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
          {results.map((r) => (
            <ResourceCard key={r.id} resource={r} onOpen={onOpen} onToggleFav={onToggleFav} />
          ))}
        </div>
      )}
    </div>
  );
}
