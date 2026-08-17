import { useState } from "react";
import {
  Users, CalendarDays, ClipboardCheck, AlertTriangle, Cake, Bell, TrendingUp,
  BookOpen, ScrollText, Gavel, NotebookPen, ShieldAlert, Backpack, FolderKanban,
  Sparkles, Plus, Search, Download, Share2, Signature, QrCode, Filter, ChevronRight,
  Phone, Mail, MessageSquare, FileText, Camera, MapPin, Clock, Star, Play,
} from "lucide-react";
import {
  ResponsiveContainer, AreaChart, Area, LineChart, Line, BarChart, Bar,
  PieChart, Pie, Cell, XAxis, YAxis, Tooltip, CartesianGrid, RadialBarChart, RadialBar,
} from "recharts";

/* ---------- data ---------- */

const attendance = [
  { d: "L", v: 26 }, { d: "M", v: 27 }, { d: "M", v: 25 }, { d: "J", v: 27 },
  { d: "V", v: 24 }, { d: "L", v: 27 }, { d: "M", v: 26 },
];
const performance = [
  { m: "Sep", esp: 8.2, mat: 7.8 }, { m: "Oct", esp: 8.5, mat: 8.1 },
  { m: "Nov", esp: 8.7, mat: 8.4 }, { m: "Dic", esp: 8.4, mat: 8.6 },
  { m: "Ene", esp: 8.9, mat: 8.7 }, { m: "Feb", esp: 9.1, mat: 8.9 },
];
const behavior = [
  { c: "Excelente", v: 14, color: "var(--neon-cyan)" },
  { c: "Bueno", v: 9, color: "var(--neon-violet)" },
  { c: "Regular", v: 3, color: "var(--neon-coral)" },
  { c: "Atención", v: 1, color: "var(--neon-pink)" },
];
const tasks = [
  { s: "Español", entregadas: 24, pendientes: 3 },
  { s: "Matemáticas", entregadas: 22, pendientes: 5 },
  { s: "Ciencias", entregadas: 25, pendientes: 2 },
  { s: "Cívica", entregadas: 26, pendientes: 1 },
];
const birthdays = [
  { n: "Sofía R.", d: "12 mar", days: 3 },
  { n: "Diego M.", d: "18 mar", days: 9 },
  { n: "Ana G.", d: "27 mar", days: 18 },
];
const alerts = [
  { t: "3 alumnos sin material de arte", type: "warn" },
  { t: "Entrevista pendiente: Familia Ramírez", type: "info" },
  { t: "Simulacro sísmico — jueves 10:00", type: "ok" },
];

const sections = [
  { key: "resumen", label: "Resumen", icon: TrendingUp },
  { key: "reglamento", label: "Reglamento", icon: ScrollText },
  { key: "padres", label: "Padres de familia", icon: Users },
  { key: "calendario", label: "Calendario", icon: CalendarDays },
  { key: "bitacora", label: "Bitácora", icon: NotebookPen },
  { key: "incidentes", label: "Incidentes", icon: ShieldAlert },
  { key: "juridico", label: "Documentos jurídicos", icon: Gavel },
  { key: "materiales", label: "Materiales", icon: Backpack },
  { key: "repositorio", label: "Repositorio", icon: FolderKanban },
] as const;

type SectionKey = typeof sections[number]["key"];

/* ---------- shared UI ---------- */

function GlassCard({ children, className = "", glow = false }: { children: React.ReactNode; className?: string; glow?: boolean }) {
  return (
    <div
      className={`glass rounded-3xl border border-white/10 p-5 transition-all duration-300 hover:border-white/20 ${
        glow ? "hover:shadow-[0_0_40px_-10px_var(--neon-coral)]" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}

function Btn3D({ children, variant = "default", onClick, className = "" }: {
  children: React.ReactNode; variant?: "default" | "primary" | "ghost"; onClick?: () => void; className?: string;
}) {
  const base = "inline-flex items-center gap-2 h-10 px-4 rounded-xl text-[13px] font-medium transition-all duration-200 active:scale-[0.97]";
  const styles = {
    primary: "text-white shadow-[0_6px_20px_-6px_var(--neon-coral),inset_0_1px_0_rgba(255,255,255,0.25)] hover:brightness-110",
    default: "glass-strong text-ink hover:border-white/20 shadow-[0_4px_12px_-4px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.08)]",
    ghost: "text-ink-soft hover:text-ink hover:bg-white/5",
  }[variant];
  const bg = variant === "primary" ? { background: "var(--gradient-neon)" } : undefined;
  return (
    <button onClick={onClick} className={`${base} ${styles} ${className}`} style={bg}>
      {children}
    </button>
  );
}

/* ---------- header ---------- */

function AulaHeader({ onAskAI }: { onAskAI: () => void }) {
  return (
    <div className="relative overflow-hidden rounded-3xl glass-strong border border-white/10 p-6 lg:p-8 mb-6">
      <div
        className="absolute -top-24 -right-24 h-64 w-64 rounded-full opacity-40 blur-3xl"
        style={{ background: "var(--gradient-neon)" }}
      />
      <div className="relative flex flex-wrap items-end gap-6 justify-between">
        <div>
          <div className="text-[10px] uppercase tracking-[0.2em] text-ink-soft">Mi Aula · Ciclo 2025–2026</div>
          <h1 className="font-serif text-4xl lg:text-5xl text-ink mt-2 leading-tight">
            Segundo <span className="italic" style={{ color: "var(--neon-coral)" }}>"C"</span>
          </h1>
          <div className="mt-2 text-ink-soft text-sm flex flex-wrap items-center gap-x-4 gap-y-1">
            <span className="inline-flex items-center gap-1.5"><Users className="h-3.5 w-3.5" /> 27 alumnos</span>
            <span className="inline-flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> Esc. Prim. "Benito Juárez"</span>
            <span className="inline-flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> Turno matutino</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Btn3D><Plus className="h-4 w-4" /> Nuevo registro</Btn3D>
          <Btn3D variant="primary" onClick={onAskAI}><Sparkles className="h-4 w-4" /> Asistente Pedagógico</Btn3D>
        </div>
      </div>
    </div>
  );
}

/* ---------- section nav ---------- */

function SectionNav({ current, onChange }: { current: SectionKey; onChange: (k: SectionKey) => void }) {
  return (
    <div className="glass rounded-2xl border border-white/10 p-1.5 mb-6 flex gap-1 overflow-x-auto scrollbar-hide">
      {sections.map(({ key, label, icon: Icon }) => {
        const active = current === key;
        return (
          <button
            key={key}
            onClick={() => onChange(key)}
            className={`shrink-0 inline-flex items-center gap-2 h-10 px-4 rounded-xl text-[13px] transition-all ${
              active ? "text-ink shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]" : "text-ink-soft hover:text-ink hover:bg-white/5"
            }`}
            style={active ? { background: "var(--gradient-neon)", color: "#fff" } : undefined}
          >
            <Icon className="h-4 w-4" /> {label}
          </button>
        );
      })}
    </div>
  );
}

/* ---------- RESUMEN ---------- */

function KPI({ icon: Icon, label, value, sub, color }: {
  icon: React.ComponentType<{ className?: string }>; label: string; value: string; sub?: string; color: string;
}) {
  return (
    <GlassCard glow>
      <div className="flex items-start justify-between">
        <div>
          <div className="text-[11px] uppercase tracking-[0.15em] text-ink-soft">{label}</div>
          <div className="font-serif text-3xl text-ink mt-2">{value}</div>
          {sub && <div className="text-xs text-ink-soft mt-1">{sub}</div>}
        </div>
        <div
          className="h-11 w-11 rounded-2xl grid place-items-center ring-1 ring-white/15"
          style={{ background: color }}
        >
          <Icon className="h-5 w-5 text-white" />
        </div>
      </div>
    </GlassCard>
  );
}

function Resumen() {
  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPI icon={ClipboardCheck} label="Asistencia hoy" value="26/27" sub="96% presente" color="linear-gradient(135deg, var(--neon-cyan), var(--neon-violet))" />
        <KPI icon={TrendingUp} label="Promedio general" value="8.7" sub="+0.3 vs bimestre" color="linear-gradient(135deg, var(--neon-violet), var(--neon-pink))" />
        <KPI icon={Cake} label="Cumpleaños" value="3" sub="Próximos 20 días" color="linear-gradient(135deg, var(--neon-pink), var(--neon-coral))" />
        <KPI icon={Bell} label="Avisos pendientes" value="5" sub="2 urgentes" color="linear-gradient(135deg, var(--neon-coral), oklch(0.75 0.16 60))" />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <GlassCard className="lg:col-span-2">
          <div className="flex items-baseline justify-between mb-4">
            <div>
              <div className="text-[11px] uppercase tracking-[0.15em] text-ink-soft">Aprovechamiento</div>
              <div className="font-serif text-xl text-ink mt-1">Promedio por materia · últimos 6 meses</div>
            </div>
            <div className="flex items-center gap-3 text-[11px]">
              <span className="inline-flex items-center gap-1.5"><i className="h-2 w-2 rounded-full" style={{ background: "var(--neon-coral)" }} /> Español</span>
              <span className="inline-flex items-center gap-1.5"><i className="h-2 w-2 rounded-full" style={{ background: "var(--neon-cyan)" }} /> Matemáticas</span>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer>
              <AreaChart data={performance}>
                <defs>
                  <linearGradient id="gEsp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.72 0.19 25)" stopOpacity={0.6} />
                    <stop offset="100%" stopColor="oklch(0.72 0.19 25)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gMat" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.78 0.16 200)" stopOpacity={0.6} />
                    <stop offset="100%" stopColor="oklch(0.78 0.16 200)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
                <XAxis dataKey="m" stroke="rgba(255,255,255,0.5)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis domain={[6, 10]} stroke="rgba(255,255,255,0.5)" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: "rgba(20,20,30,0.9)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, fontSize: 12 }} />
                <Area type="monotone" dataKey="esp" stroke="oklch(0.72 0.19 25)" strokeWidth={2.5} fill="url(#gEsp)" />
                <Area type="monotone" dataKey="mat" stroke="oklch(0.78 0.16 200)" strokeWidth={2.5} fill="url(#gMat)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="text-[11px] uppercase tracking-[0.15em] text-ink-soft">Conducta</div>
          <div className="font-serif text-xl text-ink mt-1 mb-2">Distribución del grupo</div>
          <div className="h-48">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={behavior} dataKey="v" nameKey="c" cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={3}>
                  {behavior.map((b, i) => <Cell key={i} fill={b.color} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "rgba(20,20,30,0.9)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {behavior.map((b) => (
              <div key={b.c} className="flex items-center gap-2 text-[11px] text-ink-soft">
                <i className="h-2 w-2 rounded-full" style={{ background: b.color }} />
                {b.c} <span className="text-ink ml-auto">{b.v}</span>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Second row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <GlassCard className="lg:col-span-2">
          <div className="text-[11px] uppercase tracking-[0.15em] text-ink-soft">Asistencia · últimas 2 semanas</div>
          <div className="font-serif text-xl text-ink mt-1 mb-2">Presencia diaria</div>
          <div className="h-48">
            <ResponsiveContainer>
              <BarChart data={attendance}>
                <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
                <XAxis dataKey="d" stroke="rgba(255,255,255,0.5)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis domain={[0, 27]} stroke="rgba(255,255,255,0.5)" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: "rgba(20,20,30,0.9)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, fontSize: 12 }} />
                <Bar dataKey="v" radius={[8, 8, 0, 0]}>
                  {attendance.map((_, i) => (
                    <Cell key={i} fill="url(#barGrad)" />
                  ))}
                </Bar>
                <defs>
                  <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.72 0.19 25)" />
                    <stop offset="100%" stopColor="oklch(0.62 0.20 295)" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="text-[11px] uppercase tracking-[0.15em] text-ink-soft flex items-center gap-1.5">
            <AlertTriangle className="h-3.5 w-3.5" style={{ color: "var(--neon-coral)" }} /> Alertas importantes
          </div>
          <div className="mt-3 space-y-2">
            {alerts.map((a, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] transition">
                <div
                  className="h-2 w-2 rounded-full mt-1.5 shrink-0"
                  style={{
                    background:
                      a.type === "warn" ? "var(--neon-coral)"
                      : a.type === "info" ? "var(--neon-cyan)"
                      : "oklch(0.78 0.17 145)",
                    boxShadow: `0 0 8px ${a.type === "warn" ? "var(--neon-coral)" : a.type === "info" ? "var(--neon-cyan)" : "oklch(0.78 0.17 145)"}`,
                  }}
                />
                <div className="text-[13px] text-ink leading-snug">{a.t}</div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Third row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <GlassCard className="lg:col-span-2">
          <div className="text-[11px] uppercase tracking-[0.15em] text-ink-soft">Entrega de tareas</div>
          <div className="font-serif text-xl text-ink mt-1 mb-2">Cumplimiento por materia</div>
          <div className="h-52">
            <ResponsiveContainer>
              <BarChart data={tasks} layout="vertical" barGap={4}>
                <CartesianGrid stroke="rgba(255,255,255,0.06)" horizontal={false} />
                <XAxis type="number" stroke="rgba(255,255,255,0.5)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis type="category" dataKey="s" stroke="rgba(255,255,255,0.7)" fontSize={12} tickLine={false} axisLine={false} width={90} />
                <Tooltip contentStyle={{ background: "rgba(20,20,30,0.9)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, fontSize: 12 }} />
                <Bar dataKey="entregadas" stackId="a" fill="oklch(0.78 0.16 200)" radius={[8, 0, 0, 8]} />
                <Bar dataKey="pendientes" stackId="a" fill="oklch(0.72 0.19 25)" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="text-[11px] uppercase tracking-[0.15em] text-ink-soft flex items-center gap-1.5">
            <Cake className="h-3.5 w-3.5" style={{ color: "var(--neon-pink)" }} /> Cumpleaños próximos
          </div>
          <div className="mt-3 space-y-2">
            {birthdays.map((b) => (
              <div key={b.n} className="flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.03] border border-white/5">
                <div
                  className="h-10 w-10 rounded-full grid place-items-center text-white text-xs font-semibold ring-1 ring-white/15"
                  style={{ background: "linear-gradient(135deg, var(--neon-pink), var(--neon-violet))" }}
                >
                  {b.n.split(" ").map((p) => p[0]).join("")}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] text-ink truncate">{b.n}</div>
                  <div className="text-[11px] text-ink-soft">{b.d}</div>
                </div>
                <div className="text-[11px] text-ink-soft">en {b.days} d</div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

/* ---------- REGLAMENTO ---------- */

function Reglamento() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <GlassCard className="lg:col-span-2">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-[11px] uppercase tracking-[0.15em] text-ink-soft">Reglamento interno · v3</div>
            <div className="font-serif text-2xl text-ink mt-1">Segundo "C" · Ciclo 2025–2026</div>
          </div>
          <div className="flex gap-2">
            <Btn3D><Signature className="h-4 w-4" /> Firmar</Btn3D>
            <Btn3D><Download className="h-4 w-4" /> PDF</Btn3D>
            <Btn3D variant="primary"><Sparkles className="h-4 w-4" /> Regenerar</Btn3D>
          </div>
        </div>
        <div className="rounded-2xl bg-white/[0.02] border border-white/5 p-6 space-y-4 max-h-[500px] overflow-y-auto text-[13.5px] leading-relaxed text-ink/90">
          {[
            ["I. De la puntualidad", "El horario de entrada es a las 8:00 a.m. Después de 8:10 se registrará retardo. Tres retardos equivalen a una falta."],
            ["II. Del uniforme", "Uso obligatorio y completo. Los viernes se permite ropa deportiva reglamentaria."],
            ["III. De la convivencia", "Se promueve el respeto mutuo, la escucha activa y la resolución pacífica de conflictos."],
            ["IV. Del material", "El material solicitado debe presentarse en la fecha indicada. Se llevará control por alumno."],
            ["V. De la comunicación con padres", "Los avisos se enviarán por SIED MX. Las entrevistas se agendarán con 48 h de anticipación."],
          ].map(([t, d]) => (
            <div key={t}>
              <div className="font-serif text-base text-ink">{t}</div>
              <p className="text-ink-soft mt-1">{d}</p>
            </div>
          ))}
        </div>
      </GlassCard>

      <div className="space-y-4">
        <GlassCard>
          <div className="text-[11px] uppercase tracking-[0.15em] text-ink-soft mb-3">Firma digital</div>
          <div className="rounded-2xl bg-white/[0.03] border border-dashed border-white/15 p-6 text-center">
            <Signature className="h-8 w-8 mx-auto text-ink-soft" />
            <div className="text-sm text-ink mt-2">Docente (demo)</div>
            <div className="text-[11px] text-ink-soft">Firmado el 12 sep 2025</div>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="text-[11px] uppercase tracking-[0.15em] text-ink-soft mb-3">Código QR</div>
          <div className="grid place-items-center py-3">
            <div className="h-32 w-32 rounded-2xl bg-white grid place-items-center">
              <QrCode className="h-24 w-24 text-ink" />
            </div>
          </div>
          <div className="text-[11px] text-ink-soft text-center mt-2">Padres pueden consultar y firmar</div>
        </GlassCard>

        <GlassCard>
          <div className="text-[11px] uppercase tracking-[0.15em] text-ink-soft mb-2">Versiones</div>
          {["v3 · Actual", "v2 · Ago 2025", "v1 · Ago 2024"].map((v, i) => (
            <div key={v} className={`flex items-center justify-between py-2 text-sm ${i === 0 ? "text-ink" : "text-ink-soft"}`}>
              {v} <ChevronRight className="h-3.5 w-3.5" />
            </div>
          ))}
        </GlassCard>
      </div>
    </div>
  );
}

/* ---------- PADRES ---------- */

const parents = [
  { n: "Ana López", h: "Sofía R.", tel: "555 123 4567", mail: "ana@correo.mx", rol: "Presidenta mesa directiva" },
  { n: "Carlos Méndez", h: "Diego M.", tel: "555 987 6543", mail: "carlos@correo.mx", rol: "Tesorero" },
  { n: "Laura García", h: "Ana G.", tel: "555 555 1212", mail: "laura@correo.mx", rol: "Vocal" },
  { n: "Roberto Núñez", h: "Iker N.", tel: "555 222 3344", mail: "roberto@correo.mx", rol: "" },
  { n: "Patricia Silva", h: "Emma S.", tel: "555 444 8899", mail: "patricia@correo.mx", rol: "" },
];

function Padres() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <GlassCard className="lg:col-span-2">
        <div className="flex items-center justify-between mb-4">
          <div className="font-serif text-xl text-ink">Directorio de padres</div>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-soft" />
              <input placeholder="Buscar…" className="h-10 pl-9 pr-3 rounded-xl bg-white/[0.06] border border-white/10 text-sm text-ink placeholder:text-ink-soft/70 focus:outline-none focus:border-white/20" />
            </div>
            <Btn3D variant="primary"><Plus className="h-4 w-4" /> Agregar</Btn3D>
          </div>
        </div>
        <div className="space-y-2">
          {parents.map((p) => (
            <div key={p.n} className="flex items-center gap-3 p-3 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] transition">
              <div className="h-11 w-11 rounded-full grid place-items-center text-white text-xs font-semibold ring-1 ring-white/15"
                style={{ background: "linear-gradient(135deg, var(--neon-violet), var(--neon-cyan))" }}>
                {p.n.split(" ").map((x) => x[0]).join("")}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[14px] text-ink flex items-center gap-2">
                  {p.n}
                  {p.rol && <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: "var(--gradient-neon)", color: "#fff" }}>{p.rol}</span>}
                </div>
                <div className="text-[11px] text-ink-soft">Padre/tutor de {p.h}</div>
              </div>
              <div className="hidden md:flex items-center gap-1.5">
                <button className="h-9 w-9 rounded-full glass grid place-items-center hover:border-white/20"><Phone className="h-4 w-4 text-ink-soft" /></button>
                <button className="h-9 w-9 rounded-full glass grid place-items-center hover:border-white/20"><Mail className="h-4 w-4 text-ink-soft" /></button>
                <button className="h-9 w-9 rounded-full glass grid place-items-center hover:border-white/20"><MessageSquare className="h-4 w-4 text-ink-soft" /></button>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      <div className="space-y-4">
        <GlassCard>
          <div className="text-[11px] uppercase tracking-[0.15em] text-ink-soft">Mesa directiva</div>
          <div className="mt-3 space-y-3">
            {parents.filter((p) => p.rol).map((p) => (
              <div key={p.n} className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full grid place-items-center text-white text-[10px] font-semibold"
                  style={{ background: "linear-gradient(135deg, var(--neon-pink), var(--neon-coral))" }}>
                  {p.n.split(" ").map((x) => x[0]).join("")}
                </div>
                <div className="min-w-0">
                  <div className="text-sm text-ink truncate">{p.n}</div>
                  <div className="text-[11px] text-ink-soft truncate">{p.rol}</div>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard>
          <div className="text-[11px] uppercase tracking-[0.15em] text-ink-soft mb-3">Registro de entrevistas</div>
          {[
            { f: "05 mar", p: "Fam. Ramírez", t: "Seguimiento académico" },
            { f: "28 feb", p: "Fam. López", t: "Conducta" },
            { f: "14 feb", p: "Fam. Silva", t: "Material pendiente" },
          ].map((e) => (
            <div key={e.f} className="py-2 border-b border-white/5 last:border-0">
              <div className="text-[13px] text-ink">{e.p}</div>
              <div className="text-[11px] text-ink-soft">{e.f} · {e.t}</div>
            </div>
          ))}
        </GlassCard>
      </div>
    </div>
  );
}

/* ---------- CALENDARIO ---------- */

function Calendario() {
  const events = [
    { d: 12, m: "MAR", t: "Junta bimestral", tag: "Reunión", color: "var(--neon-cyan)" },
    { d: 18, m: "MAR", t: "Cumpleaños Diego", tag: "Cumpleaños", color: "var(--neon-pink)" },
    { d: 21, m: "MAR", t: "Ceremonia cívica", tag: "Ceremonia", color: "var(--neon-violet)" },
    { d: 25, m: "MAR", t: "Suspensión oficial", tag: "Suspensión", color: "var(--neon-coral)" },
    { d: 2, m: "ABR", t: "Guardia de recreo", tag: "Guardia", color: "oklch(0.78 0.17 145)" },
  ];
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <GlassCard className="lg:col-span-2">
        <div className="flex items-center justify-between mb-4">
          <div className="font-serif text-xl text-ink">Marzo 2026</div>
          <Btn3D variant="primary"><Plus className="h-4 w-4" /> Evento</Btn3D>
        </div>
        <div className="grid grid-cols-7 gap-1.5 text-center text-[11px] text-ink-soft mb-2">
          {["D", "L", "M", "M", "J", "V", "S"].map((d, i) => <div key={i}>{d}</div>)}
        </div>
        <div className="grid grid-cols-7 gap-1.5">
          {Array.from({ length: 35 }).map((_, i) => {
            const day = i - 0;
            const has = [12, 18, 21, 25].includes(day);
            const today = day === 15;
            return (
              <div
                key={i}
                className={`aspect-square rounded-xl grid place-items-center text-sm transition ${
                  today
                    ? "text-white font-semibold"
                    : has
                    ? "text-ink bg-white/[0.06] hover:bg-white/[0.10]"
                    : day > 0 && day < 32 ? "text-ink-soft hover:bg-white/[0.04]" : "text-ink-soft/30"
                }`}
                style={today ? { background: "var(--gradient-neon)", boxShadow: "0 0 20px -6px var(--neon-coral)" } : undefined}
              >
                {day > 0 && day < 32 ? day : ""}
                {has && !today && <span className="absolute mt-6 h-1 w-1 rounded-full" style={{ background: "var(--neon-coral)" }} />}
              </div>
            );
          })}
        </div>
      </GlassCard>

      <GlassCard>
        <div className="text-[11px] uppercase tracking-[0.15em] text-ink-soft mb-3">Próximos eventos</div>
        <div className="space-y-2">
          {events.map((e) => (
            <div key={e.t} className="flex items-center gap-3 p-3 rounded-2xl bg-white/[0.03] border border-white/5">
              <div className="text-center shrink-0 w-12">
                <div className="font-serif text-2xl text-ink leading-none">{e.d}</div>
                <div className="text-[10px] uppercase tracking-wider text-ink-soft mt-0.5">{e.m}</div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[13px] text-ink truncate">{e.t}</div>
                <div className="text-[10px] uppercase tracking-wider mt-0.5" style={{ color: e.color }}>{e.tag}</div>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}

/* ---------- BITÁCORA ---------- */

function Bitacora() {
  const entries = [
    { f: "Hoy · 10:32", t: "Actividad de lectura", d: "Los alumnos participaron activamente en la lectura del cuento 'El árbol generoso'. Se registró comprensión alta.", tag: "Aula", photos: 2 },
    { f: "Ayer · 14:15", t: "Junta con dirección", d: "Se acordó ajustar el calendario de evaluaciones del tercer bimestre.", tag: "Administrativo", photos: 0 },
    { f: "10 mar · 09:00", t: "Simulacro sísmico", d: "Se realizó simulacro completo. Tiempo de evacuación: 2 min 40 seg. Sin incidentes.", tag: "Protección civil", photos: 4 },
    { f: "08 mar · 11:20", t: "Actividad Día de la Mujer", d: "Alumnos elaboraron cartas de reconocimiento a mujeres importantes en su vida.", tag: "Efeméride", photos: 6 },
  ];
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
      <div className="lg:col-span-3 space-y-3">
        <div className="flex items-center justify-between">
          <div className="font-serif text-xl text-ink">Bitácora cronológica</div>
          <div className="flex gap-2">
            <Btn3D><Filter className="h-4 w-4" /> Filtrar</Btn3D>
            <Btn3D variant="primary"><Plus className="h-4 w-4" /> Nueva entrada</Btn3D>
          </div>
        </div>
        <div className="relative pl-6">
          <div className="absolute left-2 top-2 bottom-2 w-px bg-white/10" />
          {entries.map((e, i) => (
            <div key={i} className="relative mb-3">
              <div
                className="absolute -left-[18px] top-4 h-3 w-3 rounded-full ring-4 ring-background"
                style={{ background: "var(--gradient-neon)" }}
              />
              <GlassCard>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="text-[11px] text-ink-soft">{e.f}</div>
                    <div className="font-serif text-lg text-ink mt-0.5">{e.t}</div>
                    <p className="text-[13px] text-ink-soft mt-1.5 leading-relaxed">{e.d}</p>
                    <div className="flex items-center gap-3 mt-3">
                      <span className="text-[10px] uppercase tracking-wider px-2 py-1 rounded-full bg-white/[0.06] text-ink">{e.tag}</span>
                      {e.photos > 0 && (
                        <span className="text-[11px] text-ink-soft inline-flex items-center gap-1">
                          <Camera className="h-3 w-3" /> {e.photos} evidencias
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </GlassCard>
            </div>
          ))}
        </div>
      </div>
      <GlassCard className="h-fit">
        <div className="text-[11px] uppercase tracking-[0.15em] text-ink-soft mb-2">Este mes</div>
        <div className="font-serif text-4xl text-ink">18</div>
        <div className="text-xs text-ink-soft mt-1">entradas registradas</div>
        <div className="h-px bg-white/10 my-4" />
        <div className="text-[11px] uppercase tracking-[0.15em] text-ink-soft mb-2">Con evidencia</div>
        <div className="font-serif text-4xl text-ink">12</div>
        <div className="text-xs text-ink-soft mt-1">con fotografías</div>
      </GlassCard>
    </div>
  );
}

/* ---------- INCIDENTES ---------- */

function Incidentes() {
  const items = [
    { t: "Caída en recreo", tipo: "Accidente", est: "Resuelto", color: "oklch(0.78 0.17 145)", f: "12 mar" },
    { t: "Conflicto entre alumnos", tipo: "Conducta", est: "En seguimiento", color: "var(--neon-coral)", f: "10 mar" },
    { t: "Canalización USAER", tipo: "Canalización", est: "Activo", color: "var(--neon-cyan)", f: "05 mar" },
  ];
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPI icon={ShieldAlert} label="Total ciclo" value="7" color="linear-gradient(135deg, var(--neon-coral), var(--neon-pink))" />
        <KPI icon={AlertTriangle} label="Activos" value="2" color="linear-gradient(135deg, var(--neon-pink), var(--neon-violet))" />
        <KPI icon={ClipboardCheck} label="Resueltos" value="5" color="linear-gradient(135deg, oklch(0.78 0.17 145), var(--neon-cyan))" />
        <KPI icon={FileText} label="PDF generados" value="12" color="linear-gradient(135deg, var(--neon-cyan), var(--neon-violet))" />
      </div>

      <GlassCard>
        <div className="flex items-center justify-between mb-4">
          <div className="font-serif text-xl text-ink">Registro de incidentes</div>
          <Btn3D variant="primary"><Plus className="h-4 w-4" /> Reportar</Btn3D>
        </div>
        <div className="space-y-2">
          {items.map((i) => (
            <div key={i.t} className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] transition">
              <div className="h-11 w-11 rounded-xl grid place-items-center shrink-0" style={{ background: i.color }}>
                <ShieldAlert className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[14px] text-ink">{i.t}</div>
                <div className="text-[11px] text-ink-soft mt-0.5">{i.tipo} · {i.f}</div>
              </div>
              <span className="text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full" style={{ background: `${i.color}22`, color: i.color }}>{i.est}</span>
              <Btn3D><Download className="h-4 w-4" /> PDF</Btn3D>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}

/* ---------- JURÍDICO ---------- */

function Juridico() {
  const docs = [
    { t: "Acta administrativa", n: "12 documentos", icon: FileText, color: "var(--neon-coral)" },
    { t: "Citatorios", n: "8 documentos", icon: Bell, color: "var(--neon-pink)" },
    { t: "Compromisos", n: "5 documentos", icon: Signature, color: "var(--neon-violet)" },
    { t: "Acuerdos", n: "6 documentos", icon: ScrollText, color: "var(--neon-cyan)" },
    { t: "Permisos", n: "9 documentos", icon: ClipboardCheck, color: "oklch(0.78 0.17 145)" },
    { t: "Oficios", n: "14 documentos", icon: FolderKanban, color: "oklch(0.75 0.16 60)" },
  ];
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="font-serif text-xl text-ink">Documentación jurídica</div>
        <Btn3D variant="primary"><Sparkles className="h-4 w-4" /> Generar con IA</Btn3D>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {docs.map((d) => (
          <GlassCard key={d.t} glow>
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-2xl grid place-items-center shrink-0 ring-1 ring-white/15" style={{ background: d.color }}>
                <d.icon className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <div className="font-serif text-lg text-ink">{d.t}</div>
                <div className="text-[11px] text-ink-soft mt-1">{d.n}</div>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <Btn3D className="flex-1 justify-center"><Plus className="h-4 w-4" /> Crear</Btn3D>
              <button className="h-10 w-10 rounded-xl glass-strong grid place-items-center"><ChevronRight className="h-4 w-4 text-ink-soft" /></button>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}

/* ---------- MATERIALES ---------- */

function Materiales() {
  const data = [
    { name: "Entregado", value: 68, fill: "oklch(0.78 0.17 145)" },
    { name: "Pendiente", value: 22, fill: "var(--neon-coral)" },
    { name: "Sin registrar", value: 10, fill: "var(--neon-violet)" },
  ];
  const list = [
    { m: "Cartulina blanca", est: "Entregado", c: 24 },
    { m: "Colores de madera", est: "Entregado", c: 26 },
    { m: "Regla 30 cm", est: "Pendiente", c: 19 },
    { m: "Pegamento líquido", est: "Pendiente", c: 22 },
  ];
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <GlassCard>
        <div className="text-[11px] uppercase tracking-[0.15em] text-ink-soft">Estado general</div>
        <div className="font-serif text-xl text-ink mt-1 mb-2">Cumplimiento del grupo</div>
        <div className="h-56">
          <ResponsiveContainer>
            <RadialBarChart innerRadius="40%" outerRadius="100%" data={data} startAngle={90} endAngle={-270}>
              <RadialBar dataKey="value" cornerRadius={10} background={{ fill: "rgba(255,255,255,0.05)" }} />
              <Tooltip contentStyle={{ background: "rgba(20,20,30,0.9)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, fontSize: 12 }} />
            </RadialBarChart>
          </ResponsiveContainer>
        </div>
        <div className="space-y-1.5 mt-2">
          {data.map((d) => (
            <div key={d.name} className="flex items-center gap-2 text-[12px] text-ink-soft">
              <i className="h-2 w-2 rounded-full" style={{ background: d.fill }} />
              {d.name} <span className="text-ink ml-auto">{d.value}%</span>
            </div>
          ))}
        </div>
      </GlassCard>

      <GlassCard className="lg:col-span-2">
        <div className="flex items-center justify-between mb-4">
          <div className="font-serif text-xl text-ink">Control de material</div>
          <Btn3D variant="primary"><Plus className="h-4 w-4" /> Solicitar</Btn3D>
        </div>
        <div className="space-y-2">
          {list.map((m) => (
            <div key={m.m} className="flex items-center gap-4 p-3 rounded-2xl bg-white/[0.03] border border-white/5">
              <div className="h-10 w-10 rounded-xl grid place-items-center" style={{ background: "linear-gradient(135deg, var(--neon-cyan), var(--neon-violet))" }}>
                <Backpack className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <div className="text-[14px] text-ink">{m.m}</div>
                <div className="text-[11px] text-ink-soft">{m.c}/27 alumnos</div>
              </div>
              <div className="w-40 hidden md:block">
                <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${(m.c / 27) * 100}%`,
                      background: m.est === "Entregado" ? "oklch(0.78 0.17 145)" : "var(--neon-coral)",
                    }}
                  />
                </div>
              </div>
              <span
                className="text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full"
                style={{
                  background: m.est === "Entregado" ? "oklch(0.78 0.17 145 / 15%)" : "oklch(0.72 0.19 25 / 15%)",
                  color: m.est === "Entregado" ? "oklch(0.78 0.17 145)" : "var(--neon-coral)",
                }}
              >
                {m.est}
              </span>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}

/* ---------- REPOSITORIO ---------- */

const repoCategories = [
  { t: "Libros del Maestro", icon: "📘", n: 24, g: "linear-gradient(135deg, var(--neon-cyan), var(--neon-violet))" },
  { t: "Libros de Texto", icon: "📗", n: 32, g: "linear-gradient(135deg, oklch(0.78 0.17 145), var(--neon-cyan))" },
  { t: "Planeaciones", icon: "📙", n: 48, g: "linear-gradient(135deg, oklch(0.75 0.16 60), var(--neon-coral))" },
  { t: "Formatos Oficiales", icon: "📄", n: 15, g: "linear-gradient(135deg, var(--neon-violet), var(--neon-pink))" },
  { t: "Exámenes", icon: "📝", n: 18, g: "linear-gradient(135deg, var(--neon-coral), var(--neon-pink))" },
  { t: "Rúbricas", icon: "🎯", n: 12, g: "linear-gradient(135deg, var(--neon-pink), var(--neon-violet))" },
  { t: "Documentos PDF", icon: "📂", n: 63, g: "linear-gradient(135deg, oklch(0.6 0.15 260), var(--neon-cyan))" },
  { t: "Videos", icon: "📹", n: 21, g: "linear-gradient(135deg, var(--neon-pink), var(--neon-coral))" },
  { t: "Audios", icon: "🎵", n: 9, g: "linear-gradient(135deg, var(--neon-cyan), oklch(0.78 0.17 145))" },
  { t: "Imágenes", icon: "🖼", n: 87, g: "linear-gradient(135deg, var(--neon-violet), var(--neon-cyan))" },
  { t: "Actividades Digitales", icon: "🎮", n: 14, g: "linear-gradient(135deg, var(--neon-coral), oklch(0.75 0.16 60))" },
  { t: "Recursos Web", icon: "🌎", n: 26, g: "linear-gradient(135deg, var(--neon-cyan), var(--neon-pink))" },
];

function Repositorio() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-64">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-soft" />
          <input placeholder="Buscar en el repositorio…" className="w-full h-12 pl-11 pr-4 rounded-2xl glass border border-white/10 text-sm text-ink placeholder:text-ink-soft/70 focus:outline-none focus:border-white/20 focus:ring-4 focus:ring-white/5" />
        </div>
        <Btn3D><Filter className="h-4 w-4" /> Filtros</Btn3D>
        <Btn3D variant="primary"><Plus className="h-4 w-4" /> Subir recurso</Btn3D>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {repoCategories.map((c) => (
          <button
            key={c.t}
            className="group relative overflow-hidden rounded-3xl glass border border-white/10 p-5 text-left transition-all duration-300 hover:border-white/25 hover:-translate-y-1 hover:shadow-[0_15px_40px_-15px_rgba(0,0,0,0.6)]"
          >
            <div
              className="absolute -top-10 -right-10 h-32 w-32 rounded-full opacity-30 blur-2xl group-hover:opacity-60 transition"
              style={{ background: c.g }}
            />
            <div className="relative">
              <div
                className="h-12 w-12 rounded-2xl grid place-items-center text-2xl ring-1 ring-white/15"
                style={{ background: c.g }}
              >
                <span>{c.icon}</span>
              </div>
              <div className="font-serif text-lg text-ink mt-4">{c.t}</div>
              <div className="text-[11px] text-ink-soft mt-1">{c.n} recursos</div>
              <div className="mt-4 flex items-center justify-between text-[11px] text-ink-soft">
                <span>Abrir</span>
                <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition" />
              </div>
            </div>
          </button>
        ))}
      </div>

      <GlassCard>
        <div className="flex items-center justify-between mb-4">
          <div className="font-serif text-xl text-ink">Recientes</div>
          <Btn3D>Ver todos</Btn3D>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { t: "Planeación semanal Mat.", tag: "Planeación", i: "📙" },
            { t: "Examen bimestral Español", tag: "Examen", i: "📝" },
            { t: "Rúbrica de exposición", tag: "Rúbrica", i: "🎯" },
            { t: "Video: fracciones", tag: "Video", i: "📹" },
          ].map((r) => (
            <div key={r.t} className="rounded-2xl bg-white/[0.03] border border-white/5 p-3 hover:bg-white/[0.06] transition">
              <div className="h-24 rounded-xl grid place-items-center text-4xl mb-2" style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))" }}>
                {r.i}
              </div>
              <div className="text-[13px] text-ink truncate">{r.t}</div>
              <div className="flex items-center justify-between mt-1">
                <div className="text-[10px] uppercase tracking-wider text-ink-soft">{r.tag}</div>
                <div className="flex gap-1">
                  <button className="h-7 w-7 rounded-lg hover:bg-white/[0.06] grid place-items-center"><Star className="h-3.5 w-3.5 text-ink-soft" /></button>
                  <button className="h-7 w-7 rounded-lg hover:bg-white/[0.06] grid place-items-center"><Share2 className="h-3.5 w-3.5 text-ink-soft" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}

/* ---------- root ---------- */

export function MiAula({ onAskAI }: { onAskAI: () => void }) {
  const [current, setCurrent] = useState<SectionKey>("resumen");

  return (
    <div className="px-4 lg:px-8 py-6 max-w-[1500px] mx-auto">
      <AulaHeader onAskAI={onAskAI} />
      <SectionNav current={current} onChange={setCurrent} />
      <div className="animate-in fade-in slide-in-from-bottom-2 duration-300" key={current}>
        {current === "resumen" && <Resumen />}
        {current === "reglamento" && <Reglamento />}
        {current === "padres" && <Padres />}
        {current === "calendario" && <Calendario />}
        {current === "bitacora" && <Bitacora />}
        {current === "incidentes" && <Incidentes />}
        {current === "juridico" && <Juridico />}
        {current === "materiales" && <Materiales />}
        {current === "repositorio" && <Repositorio />}
      </div>
    </div>
  );
}
