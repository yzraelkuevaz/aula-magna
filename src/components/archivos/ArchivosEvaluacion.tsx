import { useCallback, useEffect, useState } from "react";
import { Download, FileText, Loader2, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { AlumnoBasico } from "@/lib/perfil";

const BUCKET = "docente-archivos";

interface Archivo {
  id: string;
  titulo: string;
  file_path: string;
  file_name: string;
  size_bytes: number | null;
  alumno_id: string | null;
  created_at: string;
}

/** Archivos de evaluación reales del docente (exámenes, rúbricas, listas de cotejo, etc.). */
export function ArchivosEvaluacion({ userId, alumnos }: { userId: string; alumnos: AlumnoBasico[] }) {
  const [items, setItems] = useState<Archivo[]>([]);
  const [loading, setLoading] = useState(true);
  const [titulo, setTitulo] = useState("");
  const [alumnoId, setAlumnoId] = useState("");
  const [busy, setBusy] = useState(false);

  const cargar = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("evaluaciones_archivos")
      .select("id, titulo, file_path, file_name, size_bytes, alumno_id, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    if (error) toast.error("No se pudieron cargar tus archivos");
    setItems((data as Archivo[]) ?? []);
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    void cargar();
  }, [cargar]);

  const subir = async (files: FileList | null) => {
    if (!files?.length) return;
    setBusy(true);
    let ok = 0;
    for (const file of Array.from(files)) {
      const limpio = file.name.replace(/[^\w.\-]+/g, "_");
      const path = `${userId}/evaluaciones/${Date.now()}-${limpio}`;
      const up = await supabase.storage.from(BUCKET).upload(path, file, { contentType: file.type || undefined });
      if (up.error) continue;
      const { error } = await supabase.from("evaluaciones_archivos").insert({
        user_id: userId,
        alumno_id: alumnoId || null,
        titulo: titulo.trim() || file.name.replace(/\.[^.]+$/, ""),
        file_path: path,
        file_name: file.name,
        mime: file.type || null,
        size_bytes: file.size,
      });
      if (error) await supabase.storage.from(BUCKET).remove([path]);
      else ok += 1;
    }
    setBusy(false);
    if (ok) toast.success(`${ok} archivo(s) guardados`);
    if (ok < files.length) toast.error(`${files.length - ok} archivo(s) no se pudieron subir (máx. 20 MB)`);
    setTitulo("");
    void cargar();
  };

  const descargar = async (a: Archivo) => {
    const { data } = await supabase.storage.from(BUCKET).createSignedUrl(a.file_path, 300, { download: a.file_name });
    if (data?.signedUrl) window.open(data.signedUrl, "_blank", "noopener");
    else toast.error("No se pudo abrir el archivo");
  };

  const borrar = async (a: Archivo) => {
    if (!confirm(`¿Eliminar "${a.titulo}"?`)) return;
    await supabase.storage.from(BUCKET).remove([a.file_path]);
    const { error } = await supabase.from("evaluaciones_archivos").delete().eq("id", a.id);
    if (error) return toast.error("No se pudo eliminar");
    void cargar();
  };

  const nombreAlumno = (id: string | null) => alumnos.find((x) => x.id === id)?.nombre;

  return (
    <div className="px-5 lg:px-8 py-6 max-w-4xl space-y-6">
      <header>
        <h1 className="font-serif text-3xl text-ink">Centro de Evaluación</h1>
        <p className="text-sm text-ink-soft mt-1">Tus archivos de evaluación: exámenes, rúbricas, listas de cotejo, reportes.</p>
      </header>

      <section className="rounded-3xl glass-strong p-6 space-y-3">
        <h2 className="font-serif text-xl text-ink">Subir archivos</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            aria-label="Título del archivo"
            placeholder="Título (opcional, ej. Examen bimestral 1)"
            className="h-11 px-4 rounded-xl bg-primary/5 border border-border text-sm text-ink focus:outline-none"
          />
          <select
            value={alumnoId}
            onChange={(e) => setAlumnoId(e.target.value)}
            aria-label="Alumno relacionado"
            className="h-11 px-3 rounded-xl bg-primary/5 border border-border text-sm text-ink"
          >
            <option value="">Todo el grupo</option>
            {alumnos.map((a) => (
              <option key={a.id} value={a.id}>{a.nombre}</option>
            ))}
          </select>
        </div>
        <label className="inline-flex items-center gap-2 h-11 px-5 rounded-xl text-sm font-semibold text-white cursor-pointer" style={{ background: "var(--gradient-neon)" }}>
          {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Upload className="h-4 w-4" aria-hidden="true" />}
          Elegir archivos (PDF, Word, Excel, imágenes)
          <input type="file" multiple className="hidden" disabled={busy} onChange={(e) => { void subir(e.target.files); e.target.value = ""; }} />
        </label>
      </section>

      <section className="rounded-3xl glass p-6">
        <h2 className="font-serif text-xl text-ink mb-3">Mis archivos · {items.length}</h2>
        {loading ? (
          <Loader2 className="h-5 w-5 animate-spin text-ink-soft" aria-hidden="true" />
        ) : items.length === 0 ? (
          <p className="text-sm text-ink-soft">Aún no has subido archivos de evaluación.</p>
        ) : (
          <ul className="divide-y divide-border">
            {items.map((a) => (
              <li key={a.id} className="py-3 flex items-center gap-3">
                <FileText className="h-5 w-5 text-ink-soft shrink-0" aria-hidden="true" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-ink truncate">{a.titulo}</div>
                  <div className="text-xs text-ink-soft truncate">
                    {nombreAlumno(a.alumno_id) ?? "Todo el grupo"} · {new Date(a.created_at).toLocaleDateString("es-MX")}
                    {a.size_bytes ? ` · ${(a.size_bytes / 1024 / 1024).toFixed(1)} MB` : ""}
                  </div>
                </div>
                <button onClick={() => void descargar(a)} aria-label={`Descargar ${a.titulo}`} className="h-9 w-9 grid place-items-center rounded-lg glass">
                  <Download className="h-4 w-4" aria-hidden="true" />
                </button>
                <button onClick={() => void borrar(a)} aria-label={`Eliminar ${a.titulo}`} className="h-9 w-9 grid place-items-center rounded-lg glass">
                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
