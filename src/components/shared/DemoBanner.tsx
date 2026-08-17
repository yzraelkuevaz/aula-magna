import { FlaskConical } from "lucide-react";

/**
 * Marca visible para los módulos que aún muestran el CONTENIDO DEMO
 * (datos de ejemplo no pertenecientes al docente autenticado).
 * No se eliminan: quedan aislados y etiquetados como entorno demo.
 */
export function DemoBanner({
  texto = "Contenido de ejemplo (entorno DEMO). Todavía no está ligado a tu cuenta; tus datos reales viven en tu perfil y tu grupo.",
}: {
  texto?: string;
}) {
  return (
    <div className="px-5 lg:px-8 pt-5">
      <div className="rounded-2xl glass px-4 py-3 flex items-start gap-3">
        <FlaskConical className="h-4 w-4 mt-0.5 shrink-0 text-[var(--neon-amber)]" aria-hidden="true" />
        <p className="text-xs text-ink-soft leading-relaxed">
          <span className="text-ink font-medium">Modo demo · </span>
          {texto}
        </p>
      </div>
    </div>
  );
}
