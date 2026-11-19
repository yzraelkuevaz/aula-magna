ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_path text, ADD COLUMN IF NOT EXISTS logo_path text;

CREATE TABLE public.evaluaciones_archivos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  alumno_id uuid REFERENCES public.alumnos(id) ON DELETE SET NULL,
  titulo text NOT NULL,
  file_path text NOT NULL,
  file_name text NOT NULL,
  mime text,
  size_bytes bigint,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.evaluaciones_archivos TO authenticated;
GRANT ALL ON public.evaluaciones_archivos TO service_role;
ALTER TABLE public.evaluaciones_archivos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Docente gestiona sus archivos" ON public.evaluaciones_archivos FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Requiere licencia activa" ON public.evaluaciones_archivos AS RESTRICTIVE FOR ALL TO authenticated USING (public.tiene_licencia_activa()) WITH CHECK (public.tiene_licencia_activa());
CREATE INDEX evaluaciones_archivos_user_idx ON public.evaluaciones_archivos (user_id, created_at DESC);

CREATE POLICY "Docente lee su carpeta" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'docente-archivos' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "Docente sube a su carpeta" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'docente-archivos' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "Docente actualiza su carpeta" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'docente-archivos' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "Docente borra su carpeta" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'docente-archivos' AND (storage.foldername(name))[1] = auth.uid()::text);