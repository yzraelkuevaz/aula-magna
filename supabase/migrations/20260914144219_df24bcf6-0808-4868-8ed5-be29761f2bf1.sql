REVOKE ALL ON FUNCTION public.redimir_licencia(text) FROM anon;

CREATE POLICY "Docentes ven las fotos de sus alumnos"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'alumnos-fotos' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Docentes suben fotos de sus alumnos"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'alumnos-fotos' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Docentes actualizan fotos de sus alumnos"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'alumnos-fotos' AND (storage.foldername(name))[1] = auth.uid()::text)
WITH CHECK (bucket_id = 'alumnos-fotos' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Docentes borran fotos de sus alumnos"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'alumnos-fotos' AND (storage.foldername(name))[1] = auth.uid()::text);