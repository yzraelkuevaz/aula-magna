ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS turno text,
  ADD COLUMN IF NOT EXISTS avatar_url text,
  ADD COLUMN IF NOT EXISTS nombre_grupo text,
  ADD COLUMN IF NOT EXISTS tema text NOT NULL DEFAULT 'oscuro',
  ADD COLUMN IF NOT EXISTS sonidos boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS notificaciones boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS hora_entrada text DEFAULT '08:00',
  ADD COLUMN IF NOT EXISTS hora_recreo text DEFAULT '10:30',
  ADD COLUMN IF NOT EXISTS hora_salida text DEFAULT '13:00',
  ADD COLUMN IF NOT EXISTS tutorial_completed boolean NOT NULL DEFAULT false;

CREATE TABLE IF NOT EXISTS public.recordatorios (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  nombre text NOT NULL,
  tipo text NOT NULL DEFAULT 'personalizado',
  hora text NOT NULL DEFAULT '08:00',
  dias integer[] NOT NULL DEFAULT '{1,2,3,4,5}',
  mensaje text,
  activo boolean NOT NULL DEFAULT true,
  repetir boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.recordatorios TO authenticated;
GRANT ALL ON public.recordatorios TO service_role;
ALTER TABLE public.recordatorios ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own recordatorios" ON public.recordatorios FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER update_recordatorios_updated_at BEFORE UPDATE ON public.recordatorios FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE IF NOT EXISTS public.bitacoras (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  fecha date NOT NULL DEFAULT current_date,
  alumno_id uuid REFERENCES public.alumnos(id) ON DELETE SET NULL,
  alumno_nombre text,
  categoria text NOT NULL DEFAULT 'Observación',
  descripcion text NOT NULL,
  importancia text NOT NULL DEFAULT 'media',
  estado text NOT NULL DEFAULT 'pendiente',
  seguimiento text,
  observaciones text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.bitacoras TO authenticated;
GRANT ALL ON public.bitacoras TO service_role;
ALTER TABLE public.bitacoras ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own bitacoras" ON public.bitacoras FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER update_bitacoras_updated_at BEFORE UPDATE ON public.bitacoras FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE IF NOT EXISTS public.agenda_eventos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  titulo text NOT NULL,
  descripcion text,
  fecha date NOT NULL,
  hora text,
  tipo text NOT NULL DEFAULT 'actividad',
  todo_el_dia boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.agenda_eventos TO authenticated;
GRANT ALL ON public.agenda_eventos TO service_role;
ALTER TABLE public.agenda_eventos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own agenda" ON public.agenda_eventos FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER update_agenda_updated_at BEFORE UPDATE ON public.agenda_eventos FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE IF NOT EXISTS public.asistencia (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  alumno_id uuid NOT NULL REFERENCES public.alumnos(id) ON DELETE CASCADE,
  fecha date NOT NULL DEFAULT current_date,
  estado text NOT NULL DEFAULT 'presente',
  nota text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (alumno_id, fecha)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.asistencia TO authenticated;
GRANT ALL ON public.asistencia TO service_role;
ALTER TABLE public.asistencia ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own asistencia" ON public.asistencia FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER update_asistencia_updated_at BEFORE UPDATE ON public.asistencia FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();