import { useEffect, useRef, useState } from "react";
import { Sparkles, Send, X } from "lucide-react";
import { responderConsulta } from "@/lib/asistente";

interface Msg { role: "user" | "ai"; text: string; }

const suggestions = [
  "Propón una actividad para trabajar fracciones.",
  "Necesito una actividad de comprensión lectora.",
  "¿Cómo puedo evaluar esta planeación?",
  "Adapta esta actividad para alumnos que requieren mayor apoyo.",
  "Genera una actividad de cierre.",
];

interface Props {
  open: boolean;
  onClose: () => void;
}

export function AIPanel({ open, onClose }: Props) {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const send = (text: string) => {
    const t = text.trim();
    if (!t) return;
    setMessages((m) => [...m, { role: "user", text: t }]);
    setInput("");
    setTimeout(() => {
      setMessages((m) => [
        ...m,
        {
          role: "ai",
          text: "Encontré varios recursos que podrían ayudarte. Aquí tienes una selección basada en tu grado y materia. ¿Te gustaría que prepare una versión imprimible?",
        },
      ]);
    }, 700);
  };

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-ink/40 backdrop-blur-sm transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />
      <aside
        className={`fixed top-0 right-0 z-50 h-full w-full sm:w-[440px] bg-surface-elevated border-l border-border shadow-2xl flex flex-col transition-transform duration-400 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <header className="flex items-center justify-between h-16 px-5 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-ink text-background grid place-items-center">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <div className="font-serif font-semibold text-ink leading-tight">IAsistente</div>
              <div className="text-[11px] text-ink-soft leading-tight">Tu compañero de aula</div>
            </div>
          </div>
          <button onClick={onClose} className="h-9 w-9 rounded-full hover:bg-secondary grid place-items-center">
            <X className="h-4 w-4" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center pt-6">
              <div className="font-serif text-xl text-ink">¿En qué puedo ayudarte?</div>
              <p className="text-sm text-ink-soft mt-2 max-w-xs mx-auto">
                Pídeme planeaciones, cuentos, reglamentos o cualquier recurso.
              </p>
              <div className="mt-6 space-y-2">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="w-full text-left text-sm px-4 py-3 rounded-xl border border-border hover:border-primary/30 hover:bg-secondary transition"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((m, i) => (
              <div
                key={i}
                className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed animate-in fade-in slide-in-from-bottom-2 duration-300 ${
                  m.role === "user"
                    ? "ml-auto bg-primary text-primary-foreground rounded-br-md"
                    : "bg-secondary text-ink rounded-bl-md"
                }`}
              >
                {m.text}
              </div>
            ))
          )}
        </div>

        <form
          onSubmit={(e) => { e.preventDefault(); send(input); }}
          className="p-4 border-t border-border"
        >
          <div className="relative">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escribe tu petición…"
              className="w-full h-12 pl-4 pr-12 rounded-xl bg-secondary border border-transparent focus:border-primary/40 focus:bg-surface-elevated focus:outline-none focus:ring-4 focus:ring-ring/20 transition text-sm"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1.5 h-9 w-9 rounded-lg bg-primary text-primary-foreground grid place-items-center hover:brightness-105 transition"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </form>
      </aside>
    </>
  );
}
