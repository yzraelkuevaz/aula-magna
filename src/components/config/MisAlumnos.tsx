import { useEffect, useMemo, useRef, useState } from "react";
import { Camera, Images, Loader2, Trash2, UserPlus, X } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export interface AlumnoConFoto {
  id: string;
  nombre: string;
  foto_path?: string | null;
}

const BUCKET = "alumnos-fotos";

function normaliza(s: string) {
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

/** "Mis alumnos": alta, baja y fotos (individual o carga grupal). */
export function MisAlumnos({
  userId, alumnos, onChanged,
}: {
  userId: string;
  alumnos: AlumnoConFoto[];
  onChanged: () => void;
}) {
  const [nuevoAlumno, setNuevoAlumno] = useState("");
  const [urls, setUrls] = useState<Record<string, string>>({});
  const [subiendo, setSubiendo] = useState<string | null>(null);
  const [grupal, setGrupal] = useState(false);
  const grupalRef = useRef<HTMLInputElement>(null);

  const conFoto = useMemo(() => alumnos.filter((a) => a.foto_path).length, [alumnos]);

  useEffect(() => {
    const paths = alumnos.map((a) => a.foto_path).filter(Boolean) as string[];
    if (paths.length === 0) {
      setUrls({});
      return;
    }
    void (async () => {
      const { data } = await supabase.storage.from(BUCKET).createSignedUrls(paths, 3600);
      const map: Record<string, string> = {};
      data?.forEach((d) => {
        if (d.path && d.signedUrl) map[d.path] = d.signedUrl;
      });
      setUrls(map);
    })();
  }, [alumnos]);

  const agregarAlumno = async () => {
    const nombre = nuevoAlumno.trim();
    if (!nombre) return;
    const { error } = await supabase.from("alumnos").insert({ nombre, user_id: userId });
    if (error) return toast.error("No se pudo agregar el alumno");
    setNuevoAlumno("");
    toast.success("Alumno agregado");
    onChanged();
  };

  const borrarAlumno = async (id: string) => {
    const { error } = await supabase.from("alumnos").delete().eq("id", id);
    if (error) return toast.error("No se pudo eliminar");
    onChanged();
  };

  const subirFoto = async (alumnoId: string, file: File) => {
    const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
    const path = `${userId}/${alumnoId}.${ext}`;
    const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
      upsert: true,
      contentType: file.type || "image/jpeg",
    });
    if (error) throw error;
    const { error: e2 } = await supabase
      .from("alumnos")
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .update({ foto_path: path } as any)
      .eq("id", alumnoId);
    if (e2) throw e2;
  };

  const onFotoIndividual = async (alumnoId: string, file: File | undefined) => {
    if (!file) return;
    setSubiendo(alumnoId);
    try {
      await subirFoto(alumnoId, file);
      toast.success("Foto actualizada");
      onChanged();
    } catch {
      toast.error("No se pudo subir la foto");
    } finally {
      setSubiendo(null);
    }
  };

  const quitarFoto = async (alumno: AlumnoConFoto) => {
    if (!alumno.foto_path) return;
    setSubiendo(alumno.id);
    try {
      await supabase.storage.from(BUCKET).remove([alumno.foto_path]);
      await supabase
        .from("alumnos")
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .update({ foto_path: null } as any)
        .eq("id", alumno.id);
      onChanged();
    } finally {
      setSubiendo(null);
    }
  };

  const onCargaGrupal = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setGrupal(true);
    let ok = 0;
    const sinCoincidencia: string[] = [];
    for (const file of Array.from(files)) {
      const base = normaliza(file.name.replace(/\.[^.]+$/, ""));
      const alumno =
        alumnos.find((a) => normaliza(a.nombre) === base) ??
        alumnos.find((a) => base.includes(normaliza(a.nombre)));
      if (!alumno) {
        sinCoincidencia.push(file.name);
        continue;
      }
      try {
        await subirFoto(alumno.id, file);
        ok += 1;
      } catch {
        sinCoincidencia.push(file.name);
      }
    }
    setGrupal(false);
    if (grupalRef.current) grupalRef.current.value = "";
    onChanged();
    if (ok > 0) toast.success(`${ok} foto(s) asignadas correctamente`);
    if (sinCoincidencia.length > 0) {
      toast.error(
        `Sin coincidencia (${sinCoincidencia.length}): ${sinCoincidencia.slice(0, 3).join(", ")}${sinCoincidencia.length > 3 ? "…" : ""}`,
      );
    }
  };

  return (
    <section className="rounded-3xl glass-strong p-6 space-y-5">
      <div className="flex items-baseline justify-between gap-3 flex-wrap">
        <h2 className="font-serif text-xl text-ink">Mis alumnos · {alumnos.length}</h2>
        <span className="text-xs text-ink-soft">{conFoto} con foto</span>
      </div>

      <div className="flex gap-2">
        <input
          value={nuevoAlumno}
          onChange={(e) => setNuevoAlumno(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && agregarAlumno()}
          aria-label="Nombre del nuevo alumno"
          placeholder="Nombre del alumno"
          className="flex-1 h-11 px-4 rounded-xl bg-primary/5 border border-border focus:outline-none focus:border-[var(--neon-coral)]/40 text-sm text-ink placeholder:text-ink-soft/60"
        />
        <button
          onClick={agregarAlumno}
          aria-label="Agregar alumno"
          className="inline-flex items-center gap-2 h-11 px-4 rounded-xl glass hover:border-border text-sm text-ink"
        >
          <UserPlus className="h-4 w-4" aria-hidden="true" /> Agregar
        </button>
      </div>

      {/* Carga grupal de fotos */}
      <div className="rounded-2xl border border-dashed border-border p-5 text-center">
        <Images className="mx-auto h-6 w-6 text-ink-soft" aria-hidden="true" />
        <div className="mt-2 text-sm text-ink">Cargar fotos en grupo (opcional)</div>
        <p className="mt-1 text-xs text-ink-soft">
          Selecciona varias imágenes a la vez. Se asignan automáticamente si el nombre del archivo
          coincide con el nombre del alumno (por ejemplo <em>Ana Beltrán.jpg</em>).
        </p>
        <input
          ref={grupalRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => void onCargaGrupal(e.target.files)}
        />
        <button
          onClick={() => grupalRef.current?.click()}
          disabled={grupal || alumnos.length === 0}
          aria-label="Seleccionar varias fotos de alumnos"
          className="mt-3 inline-flex items-center gap-2 h-10 px-4 rounded-xl text-sm font-semibold text-white disabled:opacity-50"
          style={{ background: "var(--gradient-neon)" }}
        >
          {grupal ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Images className="h-4 w-4" aria-hidden="true" />}
          Elegir imágenes
        </button>
      </div>

      <ul className="divide-y divide-border">
        {alumnos.length === 0 && (
          <li className="py-4 text-sm text-ink-soft">Aún no has registrado alumnos en tu grupo.</li>
        )}
        {alumnos.map((a) => {
          const url = a.foto_path ? urls[a.foto_path] : undefined;
          return (
            <li key={a.id} className="py-3 flex items-center gap-3">
              <div className="relative h-11 w-11 shrink-0 rounded-full overflow-hidden ring-1 ring-border bg-primary/5 grid place-items-center">
                {url ? (
                  <img src={url} alt={`Foto de ${a.nombre}`} className="h-full w-full object-cover" loading="lazy" />
                ) : (
                  <span className="text-[11px] font-semibold text-ink-soft">
                    {a.nombre.slice(0, 1).toUpperCase()}
                  </span>
                )}
                {subiendo === a.id && (
                  <div className="absolute inset-0 grid place-items-center bg-[oklch(0.15_0.02_265_/_0.5)]">
                    <Loader2 className="h-4 w-4 animate-spin text-white" aria-hidden="true" />
                  </div>
                )}
              </div>

              <span className="flex-1 min-w-0 text-sm text-ink truncate">{a.nombre}</span>

              <label
                className="h-9 px-3 inline-flex items-center gap-1.5 rounded-lg glass text-xs text-ink cursor-pointer hover:border-border"
                aria-label={`Subir foto de ${a.nombre}`}
              >
                <Camera className="h-3.5 w-3.5" aria-hidden="true" />
                Foto
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => void onFotoIndividual(a.id, e.target.files?.[0])}
                />
              </label>

              {a.foto_path && (
                <button
                  onClick={() => void quitarFoto(a)}
                  aria-label={`Quitar foto de ${a.nombre}`}
                  className="h-9 w-9 grid place-items-center rounded-lg hover:bg-primary/8 text-ink-soft"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              )}

              <button
                onClick={() => void borrarAlumno(a.id)}
                aria-label={`Eliminar a ${a.nombre}`}
                className="h-9 w-9 grid place-items-center rounded-lg hover:bg-primary/8 text-ink-soft"
              >
                <Trash2 className="h-4 w-4" aria-hidden="true" />
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
