import { useState } from "react";
import { FileUp, Loader2, ListPlus } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { parseNombresAlumnos } from "@/lib/importar-alumnos";

/** Carga de la lista de alumnos: pegar nombres o subir un archivo CSV/TXT. */
export function ImportarAlumnos({
  userId, existentes, onChanged,
}: {
  userId: string;
  existentes: string[];
  onChanged: () => void;
}) {
  const [texto, setTexto] = useState("");
  const [busy, setBusy] = useState(false);

  const importar = async (fuente: string) => {
    const ya = new Set(existentes.map((n) => n.toLowerCase()));
    const nuevos = parseNombresAlumnos(fuente).filter((n) => !ya.has(n.toLowerCase()));
    if (nuevos.length === 0) return toast.error("No encontré nombres nuevos en la lista");
    setBusy(true);
    const { error } = await supabase.from("alumnos").insert(nuevos.map((nombre) => ({ nombre, user_id: userId })));
    setBusy(false);
    if (error) return toast.error("No se pudo cargar la lista");
    toast.success(`${nuevos.length} alumno(s) agregados`);
    setTexto("");
    onChanged();
  };

  return (
    <section className="rounded-3xl glass-strong p-6 space-y-3">
      <h2 className="font-serif text-xl text-ink">Cargar lista de alumnos</h2>
      <p className="text-xs text-ink-soft">
        Pega un nombre por renglón o sube un archivo CSV (de Excel: “Guardar como CSV”). Se usa la primera columna.
      </p>
      <textarea
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        rows={5}
        aria-label="Lista de alumnos"
        placeholder={"Ana López García\nLuis Pérez Ramírez"}
        className="w-full p-3 rounded-xl bg-primary/5 border border-border text-sm text-ink focus:outline-none"
      />
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => void importar(texto)}
          disabled={busy || !texto.trim()}
          className="inline-flex items-center gap-2 h-10 px-4 rounded-xl text-sm font-semibold text-white disabled:opacity-50"
          style={{ background: "var(--gradient-neon)" }}
        >
          {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <ListPlus className="h-4 w-4" aria-hidden="true" />}
          Agregar lista
        </button>
        <label className="inline-flex items-center gap-2 h-10 px-4 rounded-xl glass text-sm text-ink cursor-pointer">
          <FileUp className="h-4 w-4" aria-hidden="true" /> Subir CSV / TXT
          <input
            type="file"
            accept=".csv,.txt,text/csv,text/plain"
            className="hidden"
            onChange={async (e) => {
              const f = e.target.files?.[0];
              e.target.value = "";
              if (f) await importar(await f.text());
            }}
          />
        </label>
      </div>
    </section>
  );
}
