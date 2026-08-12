import {
  Users, TrendingUp, AlertCircle, Clock, ArrowRight, Sparkles, ChevronRight,
  BookOpen, Scale, Calendar, Notebook, Cloud, FileText, MonitorPlay, Trophy,
  Palette, Play, ClipboardList, MapPin,
} from "lucide-react";
import banner from "@/assets/sunrise-banner.jpg";

export function Dashboard({
  onAskAI,
  onNavigate,
}: {
  onAskAI: () => void;
  onNavigate?: (key: string) => void;
}) {

  return (
    <div className="px-5 lg:px-8 py-6 grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-6">
      {/* Main column */}
      <div className="min-w-0 space-y-6">
        {/* Greeting banner */}
        <section
          className="relative overflow-hidden rounded-3xl glass-strong h-[168px] flex items-center"
          style={{ boxShadow: "var(--glow-rainbow)" }}
        >
          <img
            src={banner}
            alt=""
            className="absolute inset-0 h-full w-full object-cover object-center opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[oklch(0.16_0.015_265)] via-[oklch(0.16_0.015_265/70%)] to-transparent" />
          <div className="relative z-10 px-8">
            <h1 className="font-serif text-3xl lg:text-[34px] leading-tight text-ink">
              ¡Buenos días,<br />
              <span
                className="italic font-normal bg-clip-text text-transparent"
                style={{ backgroundImage: "var(--gradient-neon)" }}
              >
                Profesor Israel!
              </span> <span className="not-italic">👋</span>
            </h1>
            <p className="text-ink-soft text-sm mt-1.5">Hoy tienes una oportunidad más para cambiar vidas.</p>
          </div>
        </section>

        {/* KPI row */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard
            label="Asistencia hoy"
            value="19"
            suffix=" / 20"
            trailing="95%"
            trailingTint="var(--neon-violet)"
            icon={Users}
            iconTint="var(--neon-cyan)"
            footer="1 falta"
            progress={0.95}
          />
          <KpiCard
            label="Promedio general"
            value="8.7"
            trailing="↑ 0.6"
            trailingTint="var(--neon-lime)"
            icon={TrendingUp}
            iconTint="var(--neon-lime)"
            footer="Respecto a la semana pasada"
            sparkline
          />
          <KpiCard
            label="Actividades pendientes"
            value="4"
            icon={AlertCircle}
            iconTint="var(--neon-coral)"
            footer="2 planeaciones · 2 evaluaciones"
          />
          <KpiCard
            label="Tiempo recuperado"
            value="4"
            suffix=" h 12 m"
            icon={Clock}
            iconTint="var(--neon-cyan)"
            footer="Esta semana"
          />
        </section>

        {/* Charts row */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Panel title="Resumen de mi grupo">
            <div className="flex items-center gap-6">
              <DonutChart />
              <ul className="flex-1 space-y-2.5 text-sm">
                {[
                  { label: "Excelente", value: 5, pct: "25%", color: "var(--neon-lime)" },
                  { label: "Adecuado", value: 8, pct: "40%", color: "var(--neon-cyan)" },
                  { label: "En proceso", value: 5, pct: "25%", color: "var(--neon-amber)" },
                  { label: "Requiere apoyo", value: 2, pct: "10%", color: "var(--neon-coral)" },
                ].map((r) => (
                  <li key={r.label} className="flex items-center gap-2.5">
                    <span className="h-2 w-2 rounded-full" style={{ background: r.color, boxShadow: `0 0 8px ${r.color}` }} />
                    <span className="text-ink-soft flex-1">{r.label}</span>
                    <span className="text-ink font-medium">{r.value}</span>
                    <span className="text-ink-soft text-xs w-10 text-right">{r.pct}</span>
                  </li>
                ))}
              </ul>
            </div>
            <PanelFooter label="Ver detalles del grupo" onClick={() => onNavigate?.("aula")} />
          </Panel>

          <Panel
            title="Comparativo de promedios"
            right={
              <span className="text-xs text-ink-soft glass rounded-full px-3 py-1 flex items-center gap-1">
                Este ciclo
              </span>

            }
          >
            <div className="flex items-center gap-4 text-[11px] text-ink-soft mb-2">
              <Legend color="var(--neon-violet)" label="Español" />
              <Legend color="var(--neon-cyan)" label="Matemáticas" />
              <Legend color="var(--neon-lime)" label="Ciencias" />
            </div>
            <LineChart />
          </Panel>
        </section>

        {/* Progress + bars row */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Panel title="Áreas de oportunidad">
            <ul className="space-y-3">
              {[
                { label: "Comprensión lectora", pct: 68, color: "var(--neon-amber)" },
                { label: "Resolución de problemas", pct: 72, color: "var(--neon-cyan)" },
                { label: "Operaciones básicas", pct: 85, color: "var(--neon-lime)" },
                { label: "Participación", pct: 90, color: "var(--neon-violet)" },
              ].map((r) => (
                <li key={r.label}>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-ink">{r.label}</span>
                    <span className="text-ink-soft">{r.pct}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${r.pct}%`, background: r.color, boxShadow: `0 0 8px ${r.color}` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
            <PanelFooter label="Ver estrategias recomendadas" icon={MapPin} />
          </Panel>

          <Panel title="Distribución de calificaciones">
            <BarChart />
            <PanelFooter label="Ver matriz de evaluación" onClick={() => onNavigate?.("evaluaciones")} />
          </Panel>
        </section>

        {/* Quick access */}
        <section>
          <h3 className="text-sm font-medium text-ink mb-3 px-1">Accesos rápidos</h3>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
            {[
              { label: "Biblioteca\nPedagógica", icon: BookOpen, tint: "var(--neon-coral)", to: "biblioteca" },
              { label: "Centro\nJurídico", icon: Scale, tint: "var(--neon-cyan)", to: "juridico", soon: true },
              { label: "Planeador\nInteligente", icon: Calendar, tint: "var(--neon-coral)", to: "planeaciones" },
              { label: "Bitácoras\nInteligentes", icon: Notebook, tint: "var(--neon-amber)", to: "bitacoras", soon: true },
              { label: "Repositorio\nNacional", icon: Cloud, tint: "var(--neon-cyan)", to: "recursos" },
              { label: "Documentos\nInteligentes", icon: FileText, tint: "var(--neon-lime)", to: "documentos", soon: true },
              { label: "Comunidad\nDocente", icon: Users, tint: "var(--neon-violet)", to: "comunidad", soon: true },
              { label: "Centro\nTIC", icon: MonitorPlay, tint: "var(--neon-cyan)", to: "tic", soon: true },
            ].map(({ label, icon: Icon, tint, to, soon }) => {
              const plain = label.replace("\n", " ");
              return (
                <button
                  key={label}
                  onClick={() => onNavigate?.(to)}
                  aria-label={soon ? `${plain} (próximamente)` : `Abrir ${plain}`}
                  title={soon ? `${plain} — próximamente` : plain}
                  className="card-lift card-lift-hover glass rounded-2xl p-3 flex flex-col items-center gap-2 text-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--neon-coral)]/60"
                >
                  <div
                    className="h-11 w-11 rounded-xl grid place-items-center ring-1 ring-white/15"
                    style={{ background: `color-mix(in oklab, ${tint} 22%, transparent)` }}
                  >
                    <Icon className="h-5 w-5" style={{ color: tint }} aria-hidden="true" />
                  </div>
                  <div className="text-[10.5px] leading-tight text-ink whitespace-pre-line">{label}</div>
                  {soon && <span className="text-[8.5px] uppercase tracking-[0.12em] text-ink-soft/80">Pronto</span>}
                </button>
              );
            })}

          </div>
        </section>
      </div>

      {/* Right column */}
      <aside className="space-y-4 min-w-0">
        {/* IAsistente */}
        <div className="rounded-3xl glass-strong p-5 relative overflow-hidden" style={{ boxShadow: "var(--glow-rainbow)" }}>
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-lg grid place-items-center" style={{ background: "var(--neon-violet)" }}>
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
                <span className="font-serif text-[18px] text-ink">IAssistente</span>
              </div>
              <div className="text-[11px] text-ink-soft mt-4 mb-2">Puedo ayudarte a:</div>
              <ul className="space-y-1.5 text-[13px]">
                {["Crear planeaciones", "Generar evaluaciones", "Buscar recursos", "Redactar documentos", "Analizar resultados"].map((t) => (
                  <li key={t} className="flex items-center gap-2 text-ink">
                    <span className="h-4 w-4 rounded-full grid place-items-center text-[9px] text-white" style={{ background: "var(--neon-lime)" }}>✓</span>
                    {t}
                  </li>
                ))}
              </ul>
            </div>
            <div className="h-20 w-20 rounded-2xl grid place-items-center shrink-0 text-3xl" style={{ background: "linear-gradient(135deg, var(--neon-violet), var(--neon-cyan))" }}>
              🤖
            </div>
          </div>
          <button
            onClick={onAskAI}
            className="mt-5 w-full h-11 rounded-full font-medium text-white flex items-center justify-center gap-2 text-sm hover:brightness-110 transition"
            style={{ background: "var(--neon-violet)", boxShadow: "0 10px 28px -8px var(--neon-violet)" }}
          >
            <Sparkles className="h-4 w-4" />
            Pregúntame algo...
          </button>
        </div>

        {/* Recomendaciones */}
        <div className="rounded-3xl glass p-5">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-ink">Recomendaciones para ti</h4>
          </div>
          <ul className="space-y-2">
            {[
              { title: "Nuevo libro del maestro", sub: "2° grado ya disponible", icon: BookOpen, tint: "var(--neon-coral)" },
              { title: "Actividad sobre fracciones", sub: "para 2° grado", icon: Palette, tint: "var(--neon-cyan)" },
              { title: "Video: Estrategias de lectura", sub: "comprensiva", icon: Play, tint: "var(--neon-violet)" },
              { title: "Rúbrica para proyecto", sub: "\"Mi comunidad\"", icon: ClipboardList, tint: "var(--neon-amber)" },
            ].map((r) => (
              <li key={r.title}>
                <button
                  onClick={() => onNavigate?.("biblioteca")}
                  aria-label={`Ver en Biblioteca: ${r.title}`}
                  className="w-full flex items-center gap-3 rounded-xl p-2 hover:bg-white/[0.04] transition text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--neon-coral)]/60"
                >
                  <div
                    className="h-9 w-9 rounded-lg grid place-items-center shrink-0"
                    style={{ background: `color-mix(in oklab, ${r.tint} 22%, transparent)` }}
                  >
                    <r.icon className="h-4 w-4" style={{ color: r.tint }} aria-hidden="true" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[13px] text-ink truncate">{r.title}</div>
                    <div className="text-[11px] text-ink-soft truncate">{r.sub}</div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-ink-soft" aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
          <button
            onClick={() => onNavigate?.("biblioteca")}
            className="mt-2 w-full text-right text-[11px] text-[var(--neon-cyan)] hover:brightness-110"
          >
            Ver todas
          </button>

        </div>

        {/* Próximos eventos */}
        <div className="rounded-3xl glass p-5">
          <h4 className="text-sm font-medium text-ink mb-3">Próximos eventos</h4>
          <ul className="space-y-2.5">
            {[
              { d: "06", m: "MAY", title: "Consejo Técnico Escolar", sub: "Sesión ordinaria" },
              { d: "09", m: "MAY", title: "Día del Estudiante", sub: "Actividades especiales" },
              { d: "15", m: "MAY", title: "Entrega de proyectos", sub: "2° Trimestre" },
            ].map((e) => (
              <li key={e.d + e.title} className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-xl grid place-items-center shrink-0 glass text-center leading-none">
                  <div>
                    <div className="font-serif text-[15px] text-ink">{e.d}</div>
                    <div className="text-[8px] tracking-wider text-[var(--neon-coral)] mt-0.5">{e.m}</div>
                  </div>
                </div>
                <div className="min-w-0">
                  <div className="text-[13px] text-ink truncate">{e.title}</div>
                  <div className="text-[11px] text-ink-soft truncate">{e.sub}</div>
                </div>
              </li>
            ))}
          </ul>
          <button
            onClick={() => onNavigate?.("agenda")}
            className="mt-3 w-full text-right text-[11px] text-[var(--neon-cyan)] hover:brightness-110"
          >
            Ver calendario completo
          </button>

        </div>

        {/* Trophy card */}
        <div className="rounded-3xl glass-strong p-5 text-center relative overflow-hidden" style={{ boxShadow: "var(--glow-coral)" }}>
          <div className="mx-auto h-16 w-16 rounded-2xl grid place-items-center" style={{ background: "linear-gradient(135deg, var(--neon-amber), var(--neon-coral))" }}>
            <Trophy className="h-8 w-8 text-white drop-shadow" />
          </div>
          <div className="font-serif text-[16px] text-ink mt-3">¡Excelente semana!</div>
          <div className="text-[11px] text-ink-soft mt-1">Superaste tu meta de tiempo recuperado.</div>
        </div>
      </aside>
    </div>
  );
}

function KpiCard({
  label, value, suffix, trailing, trailingTint, icon: Icon, iconTint, footer, progress, sparkline,
}: {
  label: string;
  value: string;
  suffix?: string;
  trailing?: string;
  trailingTint?: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  iconTint: string;
  footer?: string;
  progress?: number;
  sparkline?: boolean;
}) {
  return (
    <div className="card-lift card-lift-hover rounded-2xl glass p-4">
      <div className="flex items-center justify-between text-[11.5px] text-ink-soft">
        <span>{label}</span>
        <div
          className="h-7 w-7 rounded-lg grid place-items-center"
          style={{ background: `color-mix(in oklab, ${iconTint} 22%, transparent)` }}
        >
          <Icon className="h-3.5 w-3.5" style={{ color: iconTint }} />
        </div>
      </div>
      <div className="mt-3 flex items-baseline justify-between gap-2">
        <div className="font-serif text-[26px] leading-none text-ink">
          {value}
          {suffix && <span className="text-ink-soft text-[15px]">{suffix}</span>}
        </div>
        {trailing && (
          <span className="text-xs font-medium" style={{ color: trailingTint }}>{trailing}</span>
        )}
      </div>
      {progress != null && (
        <div className="mt-3 h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
          <div
            className="h-full rounded-full"
            style={{ width: `${progress * 100}%`, background: "var(--gradient-neon)" }}
          />
        </div>
      )}
      {sparkline && (
        <svg viewBox="0 0 100 22" className="mt-3 w-full h-5">
          <polyline
            fill="none"
            stroke="var(--neon-cyan)"
            strokeWidth="1.5"
            points="0,16 15,12 30,14 45,7 60,9 75,4 100,6"
            style={{ filter: "drop-shadow(0 0 3px var(--neon-cyan))" }}
          />
        </svg>
      )}
      {footer && <div className="mt-3 text-[11px] text-ink-soft">{footer}</div>}
    </div>
  );
}

function Panel({ title, right, children }: { title: string; right?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl glass p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-ink">{title}</h3>
        {right}
      </div>
      {children}
    </div>
  );
}

function PanelFooter({
  label,
  icon: Icon = ArrowRight,
  onClick,
}: {
  label: string;
  icon?: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  onClick?: () => void;
}) {
  const soon = !onClick;
  return (
    <button
      onClick={onClick}
      disabled={soon}
      title={soon ? `${label} — próximamente` : label}
      aria-label={soon ? `${label} (próximamente)` : label}
      className="mt-4 w-full h-9 rounded-xl bg-white/[0.04] hover:bg-white/[0.07] border border-white/10 text-[12px] text-ink flex items-center justify-center gap-1.5 transition disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--neon-coral)]/60"
    >
      <Icon className="h-3.5 w-3.5 text-[var(--neon-coral)]" />
      {label}
      {soon ? (
        <span className="text-[9px] uppercase tracking-[0.12em] text-ink-soft">Pronto</span>
      ) : (
        <ArrowRight className="h-3 w-3 text-ink-soft" />
      )}
    </button>
  );
}


function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="h-2 w-2 rounded-full" style={{ background: color, boxShadow: `0 0 6px ${color}` }} />
      {label}
    </span>
  );
}

function DonutChart() {
  const data = [
    { pct: 0.25, color: "oklch(0.82 0.18 145)" },
    { pct: 0.40, color: "oklch(0.78 0.15 200)" },
    { pct: 0.25, color: "oklch(0.78 0.17 65)" },
    { pct: 0.10, color: "oklch(0.72 0.19 25)" },
  ];
  const r = 42;
  const c = 2 * Math.PI * r;
  let offset = 0;
  return (
    <div className="relative h-[120px] w-[120px] shrink-0">
      <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
        <circle cx="60" cy="60" r={r} fill="none" stroke="oklch(1 0 0 / 6%)" strokeWidth="14" />
        {data.map((d, i) => {
          const dash = d.pct * c;
          const el = (
            <circle
              key={i}
              cx="60" cy="60" r={r}
              fill="none"
              stroke={d.color}
              strokeWidth="14"
              strokeDasharray={`${dash} ${c - dash}`}
              strokeDashoffset={-offset}
              style={{ filter: `drop-shadow(0 0 4px ${d.color})` }}
            />
          );
          offset += dash;
          return el;
        })}
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">
        <div>
          <div className="font-serif text-[24px] leading-none text-ink">20</div>
          <div className="text-[10px] text-ink-soft mt-1">Alumnos</div>
        </div>
      </div>
    </div>
  );
}

function LineChart() {
  const series = [
    { color: "var(--neon-violet)", points: [7.5, 8.0, 7.8, 8.3, 8.6] },
    { color: "var(--neon-cyan)", points: [6.8, 7.2, 7.6, 7.4, 8.0] },
    { color: "var(--neon-lime)", points: [8.2, 8.4, 8.3, 8.5, 8.8] },
  ];
  const w = 320, h = 140, pad = 20;
  const xStep = (w - pad * 2) / 4;
  const yFor = (v: number) => h - pad - ((v - 6) / 4) * (h - pad * 2);
  return (
    <div>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-[140px]">
        {[10, 8, 6, 4, 2, 0].map((y, i) => (
          <line key={i} x1={pad} x2={w - pad} y1={pad + i * ((h - pad * 2) / 5)} y2={pad + i * ((h - pad * 2) / 5)} stroke="oklch(1 0 0 / 6%)" strokeWidth="1" />
        ))}
        {series.map((s, si) => {
          const pts = s.points.map((v, i) => `${pad + i * xStep},${yFor(v)}`).join(" ");
          return (
            <g key={si}>
              <polyline points={pts} fill="none" stroke={s.color} strokeWidth="2" strokeLinecap="round" style={{ filter: `drop-shadow(0 0 4px ${s.color})` }} />
              {s.points.map((v, i) => (
                <circle key={i} cx={pad + i * xStep} cy={yFor(v)} r="3" fill={s.color} />
              ))}
            </g>
          );
        })}
      </svg>
      <div className="flex justify-between text-[10px] text-ink-soft px-5 -mt-1">
        {["Sem 1", "Sem 2", "Sem 3", "Sem 4", "Sem 5"].map((l) => <span key={l}>{l}</span>)}
      </div>
    </div>
  );
}

function BarChart() {
  const bars = [
    { label: "0-5", pct: 4, color: "var(--neon-coral)" },
    { label: "6", pct: 12, color: "var(--neon-amber)" },
    { label: "7", pct: 28, color: "var(--neon-violet)" },
    { label: "8", pct: 32, color: "var(--neon-cyan)" },
    { label: "9-10", pct: 24, color: "var(--neon-lime)" },
  ];
  return (
    <div>
      <div className="flex items-end gap-4 h-[140px] px-2">
        {bars.map((b) => (
          <div key={b.label} className="flex-1 flex flex-col items-center gap-1.5">
            <div className="text-[10px] text-ink">{b.pct}%</div>
            <div className="w-full rounded-t-md" style={{ height: `${b.pct * 3}px`, background: b.color, boxShadow: `0 0 10px ${b.color}` }} />
          </div>
        ))}
      </div>
      <div className="flex justify-between px-2 mt-2 text-[10px] text-ink-soft">
        {bars.map((b) => <span key={b.label} className="flex-1 text-center">{b.label}</span>)}
      </div>
    </div>
  );
}
