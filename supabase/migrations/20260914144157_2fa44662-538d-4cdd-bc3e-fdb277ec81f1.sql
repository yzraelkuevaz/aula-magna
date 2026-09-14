CREATE TABLE public.licencias (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  codigo text NOT NULL UNIQUE,
  tipo text NOT NULL DEFAULT 'demo',
  activa boolean NOT NULL DEFAULT true,
  user_id uuid,
  notas text,
  redeemed_at timestamp with time zone,
  expira_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT ON public.licencias TO authenticated;
GRANT ALL ON public.licencias TO service_role;

ALTER TABLE public.licencias ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Docentes ven su propia licencia"
ON public.licencias FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE TRIGGER update_licencias_updated_at
BEFORE UPDATE ON public.licencias
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.licencias (codigo, tipo, notas) VALUES
  ('SIEDMX-DEMO-01', 'demo', 'Licencia demo 1'),
  ('SIEDMX-DEMO-02', 'demo', 'Licencia demo 2'),
  ('SIEDMX-DEMO-03', 'demo', 'Licencia demo 3'),
  ('SIEDMX-DEMO-04', 'demo', 'Licencia demo 4'),
  ('SIEDMX-DEMO-05', 'demo', 'Licencia demo 5'),
  ('SIEDMX-DEMO-06', 'demo', 'Licencia demo 6'),
  ('SIEDMX-DEMO-07', 'demo', 'Licencia demo 7'),
  ('SIEDMX-DEMO-08', 'demo', 'Licencia demo 8'),
  ('SIEDMX-DEMO-09', 'demo', 'Licencia demo 9'),
  ('SIEDMX-DEMO-10', 'demo', 'Licencia demo 10');

CREATE OR REPLACE FUNCTION public.redimir_licencia(p_codigo text)
RETURNS jsonb
LANGUAGE plpgsql
VOLATILE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user uuid := auth.uid();
  v_codigo text := upper(btrim(coalesce(p_codigo, '')));
  v_lic public.licencias;
BEGIN
  IF v_user IS NULL THEN
    RETURN jsonb_build_object('ok', false, 'motivo', 'sin_sesion');
  END IF;

  SELECT * INTO v_lic FROM public.licencias WHERE user_id = v_user AND activa LIMIT 1;
  IF v_lic.id IS NOT NULL THEN
    RETURN jsonb_build_object('ok', true, 'codigo', v_lic.codigo, 'tipo', v_lic.tipo);
  END IF;

  SELECT * INTO v_lic FROM public.licencias WHERE codigo = v_codigo FOR UPDATE;
  IF v_lic.id IS NULL THEN
    RETURN jsonb_build_object('ok', false, 'motivo', 'no_existe');
  END IF;
  IF NOT v_lic.activa THEN
    RETURN jsonb_build_object('ok', false, 'motivo', 'inactiva');
  END IF;
  IF v_lic.expira_at IS NOT NULL AND v_lic.expira_at < now() THEN
    RETURN jsonb_build_object('ok', false, 'motivo', 'expirada');
  END IF;
  IF v_lic.user_id IS NOT NULL AND v_lic.user_id <> v_user THEN
    RETURN jsonb_build_object('ok', false, 'motivo', 'ya_usada');
  END IF;

  UPDATE public.licencias
     SET user_id = v_user, redeemed_at = coalesce(redeemed_at, now())
   WHERE id = v_lic.id;

  RETURN jsonb_build_object('ok', true, 'codigo', v_lic.codigo, 'tipo', v_lic.tipo);
END;
$$;

REVOKE ALL ON FUNCTION public.redimir_licencia(text) FROM public;
GRANT EXECUTE ON FUNCTION public.redimir_licencia(text) TO authenticated;

ALTER TABLE public.alumnos ADD COLUMN IF NOT EXISTS foto_path text;