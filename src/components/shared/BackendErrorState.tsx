import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function BackendErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <main className="min-h-screen grid place-items-center bg-background px-5 text-foreground">
      <div className="w-full max-w-md text-center">
        <AlertTriangle className="mx-auto h-7 w-7 text-destructive" aria-hidden="true" />
        <h1 className="mt-4 text-xl font-semibold text-ink">No pudimos cargar tu espacio</h1>
        <p className="mt-2 text-sm text-ink-soft">{message}</p>
        {onRetry ? (
          <Button type="button" className="mt-6" onClick={onRetry} aria-label="Reintentar conexión">
            Reintentar
          </Button>
        ) : null}
      </div>
    </main>
  );
}