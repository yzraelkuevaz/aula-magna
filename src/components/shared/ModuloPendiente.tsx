import { Construction } from "lucide-react";

export interface ModuloPendienteProps {
  title: string;
  description: string;
  onBack?: () => void;
}

export function ModuloPendiente({ title, description, onBack }: ModuloPendienteProps) {
  return (
    <section className="px-5 lg:px-8 py-10">
      <div className="max-w-2xl rounded-3xl glass p-8">
        <div className="flex items-center gap-3">
          <div
            className="h-11 w-11 rounded-2xl grid place-items-center ring-1 ring-white/15"
            style={{ background: "color-mix(in oklab, var(--neon-amber) 22%, transparent)" }}
          >
            <Construction className="h-5 w-5" style={{ color: "var(--neon-amber)" }} aria-hidden="true" />
          </div>
          <div>
            <h1 className="font-serif text-2xl text-ink leading-tight">{title}</h1>
            <span className="inline-block mt-1 text-[10px] uppercase tracking-[0.15em] rounded-full px-2 py-0.5 text-ink-soft border border-white/15">
              Próximamente
            </span>
          </div>
        </div>

        <p className="text-sm text-ink-soft mt-5 leading-relaxed">{description}</p>
        <p className="text-sm text-ink-soft mt-3 leading-relaxed">
          Este módulo aún no tiene funciones activas. Para evitar botones que no hacen nada, se muestra
          esta pantalla hasta que su sprint de desarrollo esté listo.
        </p>

        {onBack && (
          <button
            onClick={onBack}
            className="mt-6 h-11 px-5 rounded-full text-sm font-medium text-white hover:brightness-110 transition"
            style={{ background: "var(--neon-violet)" }}
          >
            Volver al Escritorio
          </button>
        )}
      </div>
    </section>
  );
}
