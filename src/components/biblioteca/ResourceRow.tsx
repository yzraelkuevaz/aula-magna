import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ResourceCard } from "./ResourceCard";
import type { Resource } from "./data";

interface Props {
  title: string;
  subtitle?: string;
  resources: Resource[];
  onOpen: (r: Resource) => void;
  onToggleFav: (id: string) => void;
  action?: React.ReactNode;
}

export function ResourceRow({ title, subtitle, resources, onOpen, onToggleFav, action }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const scroll = (dir: number) => {
    ref.current?.scrollBy({ left: dir * 520, behavior: "smooth" });
  };
  return (
    <section className="px-5 lg:px-10 mt-14">
      <div className="flex items-end justify-between mb-5 gap-4">
        <div>
          <h2 className="font-serif text-2xl lg:text-[28px] text-ink tracking-tight">{title}</h2>
          {subtitle && <p className="text-sm text-ink-soft mt-1">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-2">
          {action}
          <button onClick={() => scroll(-1)} className="h-9 w-9 rounded-full border border-border grid place-items-center hover:bg-secondary transition">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button onClick={() => scroll(1)} className="h-9 w-9 rounded-full border border-border grid place-items-center hover:bg-secondary transition">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div ref={ref} className="flex gap-5 overflow-x-auto scrollbar-hide -mx-5 lg:-mx-10 px-5 lg:px-10 pb-2 snap-x snap-mandatory">
        {resources.map((r) => (
          <div key={r.id} className="w-[220px] shrink-0 snap-start">
            <ResourceCard resource={r} onOpen={onOpen} onToggleFav={onToggleFav} />
          </div>
        ))}
      </div>
    </section>
  );
}
