CREATE OR REPLACE FUNCTION public.tiene_licencia_activa()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.licencias WHERE user_id = auth.uid() AND activa AND (expira_at IS NULL OR expira_at > now()))
$$;
REVOKE ALL ON FUNCTION public.tiene_licencia_activa() FROM public;
GRANT EXECUTE ON FUNCTION public.tiene_licencia_activa() TO authenticated;
CREATE POLICY "Requiere licencia activa" ON public.alumnos AS RESTRICTIVE FOR ALL TO authenticated USING (public.tiene_licencia_activa()) WITH CHECK (public.tiene_licencia_activa());
CREATE POLICY "Requiere licencia activa" ON public.asistencia AS RESTRICTIVE FOR ALL TO authenticated USING (public.tiene_licencia_activa()) WITH CHECK (public.tiene_licencia_activa());
CREATE POLICY "Requiere licencia activa" ON public.bitacoras AS RESTRICTIVE FOR ALL TO authenticated USING (public.tiene_licencia_activa()) WITH CHECK (public.tiene_licencia_activa());
CREATE POLICY "Requiere licencia activa" ON public.agenda_eventos AS RESTRICTIVE FOR ALL TO authenticated USING (public.tiene_licencia_activa()) WITH CHECK (public.tiene_licencia_activa());
CREATE POLICY "Requiere licencia activa" ON public.recordatorios AS RESTRICTIVE FOR ALL TO authenticated USING (public.tiene_licencia_activa()) WITH CHECK (public.tiene_licencia_activa());