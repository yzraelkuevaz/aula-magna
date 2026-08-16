import { useEffect, useState } from "react";
import { Copy, Check, X, Share2, Info, Printer } from "lucide-react";
import { toast } from "sonner";
import type { PlaneacionRegistro } from "./planData";

/**
 * Compartir planeación.
 * Hoy el enlace es funcional dentro de la plataforma (abre la planeación en el
 * repositorio para quien tenga acceso a SIED MX). El acceso público sin sesión
 * requiere backend, y eso se comunica explícitamente en lugar de simularlo.
 */

export function enlaceDePlaneacion(plan: PlaneacionRegistro): string {
  const base =
    typeof window !== "undefined" ? window.location.origin : "https://aula-magna.lovable.app";
  return `${base}/?modulo=planeaciones&planeacion=${encodeURIComponent(plan.id)}`;
}

export async function copiarAlPortapapeles(texto: string): Promise<boolean> {
  try {
    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(texto);
      return true;
    }
  } catch {
    /* fallback abajo */
  }
  try {
    const el = document.createElement("textarea");
    el.value = texto;
    el.setAttribute("readonly", "");
    el.style.position = "fixed";
    el.style.opacity = "0";
    document.body.appendChild(el);
    el.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(el);
    return ok;
  } catch {
    return false;
  }
}

interface Props {
  plan: PlaneacionRegistro | null;
  onClose: () => void;
}

export function CompartirPlaneacion({ plan, onClose }: Props) {
  const [copiado, setCopiado] = useState(false);

  useEffect(() => {
    setCopiado(false);
    if (!plan) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [plan, onClose]);

  if (!plan) return null;
  const enlace = enlaceDePlaneacion(plan);

  const copiar = async () => {
    const ok = await copiarAlPortapapeles(enlace);
    setCopiado(ok);
    if (ok) toast.success("Enlace copiado al portapapeles");
    else toast.error("No se pudo copiar. Selecciona el enlace y cópialo manualmente.");
  };

  const compartirNativo = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title: plan.titulo, text: plan.titulo, url: enlace });
        return;
      } catch {
        return; // el usuario canceló
      }
    }
    await copiar();
    toast.info("Este navegador no tiene compartir nativo: se copió el enlace.");
  };

  return (
    <div className="fixed inset-0 z-[60] grid place-items-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Compartir ${plan.titulo}`}
        className="relative w-full max-w-lg glass-strong rounded-3xl p-6 animate-in fade-in zoom-in-95 duration-200"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="text-[10px] uppercase tracking-[0.2em] text-ink-soft">Compartir</div>
            <h2 className="font-serif text-xl text-ink mt-1 leading-snug">{plan.titulo}</h2>
            <div className="text-[11px] text-ink-soft mt-1">
              {plan.campo} · {plan.grado} · {plan.semana}
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Cerrar"
            className="h-9 w-9 grid place-items-center rounded-full hover:bg-white/[0.08]"
          >
            <X className="h-4 w-4 text-ink-soft" aria-hidden="true" />
          </button>
        </div>

        <label
          htmlFor="enlace-planeacion"
          className="block text-[10px] uppercase tracking-[0.15em] text-ink-soft mt-6"
        >
          Enlace de la planeación
        </label>
        <div className="mt-2 flex gap-2">
          <input
            id="enlace-planeacion"
            readOnly
            value={enlace}
            onFocus={(e) => e.currentTarget.select()}
            className="flex-1 h-11 px-3 rounded-xl bg-white/[0.05] border border-white/10 text-[12px] text-ink focus:outline-none focus:ring-2 focus:ring-white/20"
          />
          <button
            onClick={copiar}
            className="btn-3d h-11 px-4 rounded-xl text-sm font-medium text-white inline-flex items-center gap-2 shrink-0"
            style={{ background: "var(--gradient-neon)" }}
          >
            {copiado ? (
              <Check className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Copy className="h-4 w-4" aria-hidden="true" />
            )}
            {copiado ? "Copiado" : "Copiar enlace"}
          </button>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          <button
            onClick={compartirNativo}
            className="btn-3d h-10 px-3.5 rounded-xl glass border border-white/10 text-[12px] text-ink inline-flex items-center gap-1.5"
          >
            <Share2 className="h-3.5 w-3.5 text-ink-soft" aria-hidden="true" /> Compartir…
          </button>
          <button
            onClick={() => window.print()}
            className="btn-3d h-10 px-3.5 rounded-xl glass border border-white/10 text-[12px] text-ink inline-flex items-center gap-1.5"
          >
            <Printer className="h-3.5 w-3.5 text-ink-soft" aria-hidden="true" /> Imprimir vista
          </button>
        </div>

        <div className="mt-5 rounded-2xl bg-white/[0.03] border border-white/[0.07] p-4 flex gap-3">
          <Info
            className="h-4 w-4 shrink-0 mt-0.5"
            style={{ color: "var(--neon-amber)" }}
            aria-hidden="true"
          />
          <p className="text-[12px] text-ink-soft leading-relaxed">
            El enlace funciona para personas con acceso a SIED MX. El acceso público (sin sesión)
            y el código QR requieren configuración adicional del backend: base de datos para
            guardar la planeación y permisos de lectura pública. Mientras no exista, no se activan
            para no prometer algo que no funciona.
          </p>
        </div>
      </div>
    </div>
  );
}
