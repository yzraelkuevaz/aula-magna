export const BACKEND_CONFIGURATION_MESSAGE =
  "No fue posible conectar SIED MX con el servicio de datos. Verifica la configuración de Lovable Cloud e inténtalo de nuevo.";

export function getBackendConfigurationError(): Error | null {
  const serverUrl = typeof process !== "undefined" ? process.env["SUPABASE_URL"] : undefined;
  const serverKey =
    typeof process !== "undefined" ? process.env["SUPABASE_PUBLISHABLE_KEY"] : undefined;
  const url = import.meta.env["VITE_SUPABASE_URL"] || serverUrl;
  const key = import.meta.env["VITE_SUPABASE_PUBLISHABLE_KEY"] || serverKey;

  return url && key ? null : new Error(BACKEND_CONFIGURATION_MESSAGE);
}

export function getBackendErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message.includes("Missing Supabase environment variable")) {
    return BACKEND_CONFIGURATION_MESSAGE;
  }

  return error instanceof Error
    ? error.message
    : "No fue posible consultar tus datos. Inténtalo de nuevo.";
}