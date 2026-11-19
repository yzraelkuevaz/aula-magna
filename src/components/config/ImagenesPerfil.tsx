import { useEffect, useState } from "react";
import { Loader2, Upload } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const BUCKET = "docente-archivos";

/** Avatar del docente y logo de la escuela (carpeta privada del docente). */
export function ImagenesPerfil({
  userId, avatarPath, logoPath, onChanged,
}: {
  userId: string;
  avatarPath: string | null;
  logoPath: string | null;
  onChanged: () => void;
}) {
  return (
    <section className="rounded-3xl glass-strong p-6 space-y-4">
      <h2 className="font-serif text-xl text-ink">Mi avatar y logo de la escuela</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Slot userId={userId} campo="avatar_path" path={avatarPath} label="Mi avatar" redondo onChanged={onChanged} />
        <Slot userId={userId} campo="logo_path" path={logoPath} label="Logo de la escuela" onChanged={onChanged} />
      </div>
    </section>
  );
}

function Slot({
  userId, campo, path, label, redondo, onChanged,
}: {
  userId: string;
  campo: "avatar_path" | "logo_path";
  path: string | null;
  label: string;
  redondo?: boolean;
  onChanged: () => void;
}) {
  const [url, setUrl] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!path) return setUrl(null);
    void supabase.storage.from(BUCKET).createSignedUrl(path, 3600).then(({ data }) => setUrl(data?.signedUrl ?? null));
  }, [path]);

  const subir = async (file?: File) => {
    if (!file) return;
    setBusy(true);
    try {
      const ext = (file.name.split(".").pop() || "png").toLowerCase();
      const nuevo = `${userId}/perfil/${campo === "avatar_path" ? "avatar" : "logo"}-${Date.now()}.${ext}`;
      const { error } = await supabase.storage.from(BUCKET).upload(nuevo, file, { contentType: file.type });
      if (error) throw error;
      const { error: e2 } = await supabase.from("profiles").update({ [campo]: nuevo }).eq("user_id", userId);
      if (e2) throw e2;
      if (path) await supabase.storage.from(BUCKET).remove([path]);
      toast.success(`${label} actualizado`);
      onChanged();
    } catch {
      toast.error(`No se pudo subir ${label.toLowerCase()}`);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="rounded-2xl border border-dashed border-border p-4 flex items-center gap-4">
      <div className={`h-16 w-16 shrink-0 overflow-hidden ring-1 ring-border bg-primary/5 grid place-items-center ${redondo ? "rounded-full" : "rounded-xl"}`}>
        {url ? <img src={url} alt={label} className={redondo ? "h-full w-full object-cover" : "h-full w-full object-contain"} /> : <span className="text-[10px] text-ink-soft">Sin imagen</span>}
      </div>
      <div className="min-w-0">
        <div className="text-sm text-ink">{label}</div>
        <label className="mt-2 h-9 px-3 inline-flex items-center gap-1.5 rounded-lg glass text-xs text-ink cursor-pointer" aria-label={`Subir ${label}`}>
          {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" /> : <Upload className="h-3.5 w-3.5" aria-hidden="true" />}
          {path ? "Cambiar" : "Subir"}
          <input type="file" accept="image/*" className="hidden" disabled={busy} onChange={(e) => void subir(e.target.files?.[0])} />
        </label>
      </div>
    </div>
  );
}
