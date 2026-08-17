import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpen, ArrowRight, ShieldCheck, Sparkles, Users } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SIED MX — El sistema del docente mexicano" },
      { name: "description", content: "SIED MX reúne tu grupo, planeaciones, evaluaciones y biblioteca en un solo lugar. Cada docente accede únicamente a su propia información." },
      { property: "og:title", content: "SIED MX — El sistema del docente mexicano" },
      { property: "og:description", content: "Tu grupo, tus planeaciones y tus evaluaciones en un espacio privado por docente." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="flex items-center justify-between px-5 lg:px-10 h-20">
        <div className="flex items-center gap-3">
          <div
            className="h-10 w-10 rounded-2xl grid place-items-center ring-1 ring-white/20"
            style={{ background: "var(--gradient-neon)" }}
          >
            <BookOpen className="h-5 w-5 text-white" aria-hidden="true" />
          </div>
          <span className="font-serif text-lg text-ink">SIED MX</span>
        </div>
        <Link
          to="/auth"
          className="inline-flex items-center gap-2 h-11 px-5 rounded-full text-sm font-semibold text-white"
          style={{ background: "var(--gradient-neon)" }}
        >
          Entrar <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </header>

      <section className="px-5 lg:px-10 pt-14 pb-20 max-w-4xl">
        <div className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-ink-soft">
          <Sparkles className="h-3.5 w-3.5" aria-hidden="true" /> Plataforma para docentes
        </div>
        <h1 className="font-serif text-4xl lg:text-6xl leading-[1.05] text-ink mt-4">
          Tu grupo, tus planeaciones y tus evaluaciones{" "}
          <span
            className="italic bg-clip-text text-transparent"
            style={{ backgroundImage: "var(--gradient-neon)" }}
          >
            en un solo lugar
          </span>
        </h1>
        <p className="text-ink-soft mt-5 text-base lg:text-lg max-w-2xl">
          SIED MX es privado por docente: al iniciar sesión verás únicamente tu perfil, tu grupo y
          tus registros. Nadie más puede ver tu información.
        </p>

        <div className="mt-9 flex flex-wrap gap-3">
          <Link
            to="/auth"
            className="inline-flex items-center gap-2 h-12 px-6 rounded-xl text-sm font-semibold text-white"
            style={{ background: "var(--gradient-neon)" }}
          >
            Iniciar sesión o crear cuenta <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card
            icon={Users}
            title="Tu propio grupo"
            text="Crea tu grado, grupo y lista de alumnos en tu configuración inicial."
          />
          <Card
            icon={ShieldCheck}
            title="Datos aislados"
            text="Cada registro está ligado a tu cuenta con reglas de acceso a nivel de base de datos."
          />
          <Card
            icon={Sparkles}
            title="IAsistente pedagógico"
            text="Apoyo para planear, evaluar y organizar tu práctica docente."
          />
        </div>
      </section>

      <footer className="px-5 lg:px-10 py-10 border-t border-white/10 text-center text-xs text-ink-soft">
        SIED MX · Sistema Integral Educativo Docente
      </footer>
    </main>
  );
}

function Card({
  icon: Icon, title, text,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl glass p-5">
      <Icon className="h-5 w-5 text-[var(--neon-cyan)]" aria-hidden="true" />
      <div className="font-serif text-lg text-ink mt-3">{title}</div>
      <p className="text-sm text-ink-soft mt-1.5 leading-relaxed">{text}</p>
    </div>
  );
}
