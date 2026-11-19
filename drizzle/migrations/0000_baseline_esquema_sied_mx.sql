COMMENT ON SCHEMA public IS 'SIED MX - Biblioteca Viva. Esquema de la app docente. Las tablas existentes se crearon antes de Lovable Database; desde ahora cada cambio de estructura se registra como migracion de Lovable Database.';

COMMENT ON TABLE public.profiles IS 'Perfil del docente: nombre, escuela, nivel, grado, grupo, ciclo, horario y banderas de onboarding y tutorial.';
COMMENT ON TABLE public.alumnos IS 'Alumnos del docente; foto_path apunta a la foto privada del alumno.';
COMMENT ON TABLE public.asistencia IS 'Registro diario de asistencia por alumno.';
COMMENT ON TABLE public.bitacoras IS 'Bitacora de observaciones e incidentes por alumno.';
COMMENT ON TABLE public.agenda_eventos IS 'Agenda y actividades del grupo.';
COMMENT ON TABLE public.recordatorios IS 'Recordatorios del docente con hora y dias de la semana.';
COMMENT ON TABLE public.licencias IS 'Codigos de licencia; al canjearse quedan ligados al docente que los activo.';