import { useMemo, useState } from "react";
import {
  Sparkles, Plus, TrendingUp, TrendingDown, Users, AlertTriangle, ClipboardCheck,
  Clock, CheckCircle2, Percent, Layers, Activity, ChevronRight, Search, Filter,
  FileText, FileSpreadsheet, Printer, Bell, Camera, Video, Paperclip, Mic,
  Star, Award, Target, BookOpen, PenLine, ListChecks, Grid3x3, GraduationCap,
  Eye, FolderOpen, MessageSquare, Share2, Copy, Save, X, Check, Minus,
  BarChart3, PieChart as PieIcon, LineChart as LineIcon, Radar as RadarIcon,
} from "lucide-react";
import {
  ResponsiveContainer, AreaChart, Area, LineChart, Line, BarChart, Bar,
  PieChart, Pie, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  XAxis, YAxis, Tooltip, CartesianGrid, Legend,
} from "recharts";

/* ============================================================
   CENTRO DE EVALUACIÓN — SIED MX
   Diseña, aplica, registra, analiza y da seguimiento a la
   evaluación con inteligencia artificial pedagógica.
   ============================================================ */

interface Props {
  onAskAI: () => void;
}

type SectionKey =
  | "dashboard" | "evaluaciones" | "nueva" | "captura" | "rubricas"
  | "cotejo" | "analisis" | "comparativos" | "expediente" | "reportes";

const sections: { key: SectionKey; label: string; icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }> }[] = [
  { key: "dashboard", label: "Panorama", icon: Activity },
  { key: "evaluaciones", label: "Evaluaciones", icon: ClipboardCheck },
  { key: "nueva", label: "Nueva evaluación", icon: Plus },
  { key: "captura", label: "Captura", icon: PenLine },
  { key: "rubricas", label: "Rúbricas", icon: Grid3x3 },
  { key: "cotejo", label: "Listas de cotejo", icon: ListChecks },
  { key: "analisis", label: "Análisis IA", icon: Sparkles },
  { key: "comparativos", label: "Comparativos", icon: BarChart3 },
  { key: "expediente", label: "Expediente", icon: FolderOpen },
  { key: "reportes", label: "Reportes", icon: FileText },
];

export function CentroEvaluacion({ onAskAI }: Props) {
  const [section, setSection] = useState<SectionKey>("dashboard");

  return (
    <div className="pb-16">
      <Header onAskAI={onAskAI} />
      <SectionNav active={section} onChange={setSection} />
      <div className="px-5 lg:px-10 mt-6">
        {section === "dashboard" && <Dashboard onAskAI={onAskAI} onNav={setSection} />}
        {section === "evaluaciones" && <EvaluacionesList onNav={setSection} />}
        {section === "nueva" && <NuevaEvaluacion onAskAI={onAskAI} onCreated={() => setSection("captura")} />}
        {section === "captura" && <Captura />}
        {section === "rubricas" && <Rubricas onAskAI={onAskAI} />}
        {section === "cotejo" && <ListasCotejo onAskAI={onAskAI} />}
        {section === "analisis" && <AnalisisIA onAskAI={onAskAI} />}
        {section === "comparativos" && <Comparativos />}
        {section === "expediente" && <Expediente />}
        {section === "reportes" && <Reportes />}
      </div>
    </div>
  );
}

/* ---------- Header ---------- */
function Header({ onAskAI }: { onAskAI: () => void }) {
  return (
    <div className="px-5 lg:px-10 pt-6">
      <div className="glass-strong glow-rainbow rounded-3xl p-6 lg:p-8 relative overflow-hidden led-strip">
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full opacity-40 blur-3xl"
             style={{ background: "var(--gradient-neon)" }} />
        <div className="relative flex flex-col lg:flex-row lg:items-center gap-6 justify-between">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-ink-soft">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--neon-cyan)]" /> SIED MX · Centro de Evaluación
            </div>
            <h1 className="font-serif text-3xl lg:text-[40px] leading-tight text-ink mt-2">
              Evalúa con evidencia, <em className="text-[var(--neon-coral)] not-italic">interpreta con IA</em>.
            </h1>
            <p className="text-ink-soft mt-2 max-w-2xl text-sm lg:text-base">
              Diseña rúbricas, captura calificaciones, y deja que SIED MX convierta cada número en una decisión pedagógica.
              Segundo <b>"C"</b> · Ciclo 2025–2026 · 28 alumnos.
            </p>
            <div className="flex flex-wrap gap-2 mt-4">
              <Chip icon={ClipboardCheck} label="12 evaluaciones activas" />
              <Chip icon={CheckCircle2} label="84% capturado" tone="cyan" />
              <Chip icon={AlertTriangle} label="3 alumnos en riesgo" tone="coral" />
            </div>
          </div>
          <div className="flex gap-3 shrink-0">
            <button
              onClick={onAskAI}
              className="btn-3d group flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-medium"
              style={{
                background: "linear-gradient(135deg, oklch(0.72 0.19 25), oklch(0.68 0.24 340))",
                color: "white",
                boxShadow: "0 10px 30px -8px oklch(0.68 0.24 340 / 55%), inset 0 1px 0 oklch(1 0 0 / 30%)",
              }}
            >
              <Sparkles className="h-4 w-4" /> Crear con IA
            </button>
            <button
              className="btn-3d flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-medium glass border border-white/10 text-ink"
            >
              <Plus className="h-4 w-4" /> Nueva evaluación
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Chip({ icon: Icon, label, tone = "default" }: {
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  label: string;
  tone?: "default" | "cyan" | "coral";
}) {
  const color = tone === "cyan" ? "var(--neon-cyan)" : tone === "coral" ? "var(--neon-coral)" : "var(--ink-soft)";
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full glass border border-white/10 px-3 py-1.5 text-xs text-ink">
      <Icon className="h-3.5 w-3.5" style={{ color }} />
      {label}
    </span>
  );
}

/* ---------- Section nav ---------- */
function SectionNav({ active, onChange }: { active: SectionKey; onChange: (k: SectionKey) => void }) {
  return (
    <div className="px-5 lg:px-10 mt-6 overflow-x-auto scrollbar-hide">
      <div className="inline-flex gap-1 rounded-2xl glass border border-white/10 p-1">
        {sections.map(({ key, label, icon: Icon }) => {
          const isActive = active === key;
          return (
            <button
              key={key}
              onClick={() => onChange(key)}
              className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-[13px] whitespace-nowrap transition-all ${
                isActive ? "pill-active" : "text-ink-soft hover:text-ink"
              }`}
            >
              <Icon className="h-4 w-4" /> {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ============================================================
   DASHBOARD
   ============================================================ */
function Dashboard({ onAskAI, onNav }: { onAskAI: () => void; onNav: (s: SectionKey) => void }) {
  const evolucion = [
    { m: "Ago", g: 7.4 }, { m: "Sep", g: 7.8 }, { m: "Oct", g: 8.1 },
    { m: "Nov", g: 8.3 }, { m: "Dic", g: 8.5 }, { m: "Ene", g: 8.7 },
  ];
  const campos = [
    { name: "Lenguajes", value: 8.7 },
    { name: "Saberes", value: 8.4 },
    { name: "Ética", value: 8.9 },
    { name: "De lo humano", value: 8.2 },
  ];
  const semaforo = [
    { name: "Óptimo", value: 14, color: "oklch(0.72 0.15 155)" },
    { name: "Satisfactorio", value: 9, color: "oklch(0.78 0.17 65)" },
    { name: "En proceso", value: 3, color: "oklch(0.68 0.24 340)" },
    { name: "Requiere apoyo", value: 2, color: "oklch(0.72 0.19 25)" },
  ];
  const topAlumnos = [
    { n: "María F. Ramos", g: 9.6 }, { n: "Luis A. Cortés", g: 9.5 },
    { n: "Sofía Mendoza", g: 9.4 }, { n: "Diego Pérez", g: 9.3 },
    { n: "Camila Ruiz", g: 9.2 },
  ];
  const riesgo = [
    { n: "Iván Torres", g: 5.8, motivo: "Bajas en Matemáticas" },
    { n: "Renata López", g: 6.1, motivo: "Ausentismo" },
    { n: "Julián Vega", g: 6.4, motivo: "Sin entregas" },
  ];

  return (
    <div className="space-y-6">
      {/* KPI row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <KPI icon={Activity} label="Promedio general" value="8.6" delta="+0.3" tone="cyan" />
        <KPI icon={Award} label="Mejor promedio" value="9.6" hint="María F." tone="lime" />
        <KPI icon={AlertTriangle} label="En riesgo" value="3" hint="ver alumnos" tone="coral" />
        <KPI icon={Clock} label="Pendientes" value="4" hint="por capturar" tone="amber" />
        <KPI icon={Percent} label="Captura" value="84%" delta="+12%" tone="violet" />
        <KPI icon={CheckCircle2} label="Última eval." value="Fracciones" hint="hace 2 días" tone="pink" />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Panel title="Evolución del aprendizaje" subtitle="Promedio grupal por mes" icon={LineIcon} className="lg:col-span-2">
          <div className="h-64">
            <ResponsiveContainer>
              <AreaChart data={evolucion}>
                <defs>
                  <linearGradient id="evoG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.72 0.19 25)" stopOpacity={0.55} />
                    <stop offset="100%" stopColor="oklch(0.72 0.19 25)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="oklch(1 0 0 / 6%)" vertical={false} />
                <XAxis dataKey="m" stroke="oklch(0.72 0.015 260)" tick={{ fontSize: 12 }} />
                <YAxis domain={[6, 10]} stroke="oklch(0.72 0.015 260)" tick={{ fontSize: 12 }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Area type="monotone" dataKey="g" stroke="oklch(0.72 0.19 25)" strokeWidth={2.5} fill="url(#evoG)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="Semáforo del grupo" subtitle="Distribución de niveles" icon={PieIcon}>
          <div className="h-64">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={semaforo} dataKey="value" nameKey="name" innerRadius={48} outerRadius={82} paddingAngle={3}>
                  {semaforo.map((s, i) => <Cell key={i} fill={s.color} stroke="transparent" />)}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-2 text-[11px]">
            {semaforo.map((s) => (
              <div key={s.name} className="flex items-center gap-1.5 text-ink-soft">
                <span className="h-2 w-2 rounded-full" style={{ background: s.color }} />
                {s.name} · <span className="text-ink">{s.value}</span>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Panel title="Promedio por Campo Formativo" icon={BarChart3}>
          <div className="h-56">
            <ResponsiveContainer>
              <BarChart data={campos}>
                <CartesianGrid stroke="oklch(1 0 0 / 6%)" vertical={false} />
                <XAxis dataKey="name" stroke="oklch(0.72 0.015 260)" tick={{ fontSize: 11 }} />
                <YAxis domain={[6, 10]} stroke="oklch(0.72 0.015 260)" tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="value" radius={[8, 8, 0, 0]} fill="oklch(0.78 0.15 200)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="Top alumnos" icon={Star} subtitle="Mayor aprovechamiento">
          <ul className="space-y-2.5 mt-1">
            {topAlumnos.map((a, i) => (
              <li key={a.n} className="flex items-center gap-3 rounded-xl px-2 py-1.5 hover:bg-white/[0.04]">
                <span className="h-7 w-7 grid place-items-center rounded-full text-[11px] font-semibold"
                      style={{ background: "var(--gradient-neon)", color: "white" }}>{i + 1}</span>
                <Avatar name={a.n} />
                <div className="flex-1 min-w-0 text-sm text-ink truncate">{a.n}</div>
                <span className="text-sm font-semibold text-[var(--neon-lime,oklch(0.82_0.18_145))]">{a.g}</span>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="Alumnos en riesgo" icon={AlertTriangle} tone="coral">
          <ul className="space-y-2.5 mt-1">
            {riesgo.map((a) => (
              <li key={a.n} className="rounded-xl px-2 py-2 hover:bg-white/[0.04]">
                <div className="flex items-center gap-3">
                  <Avatar name={a.n} />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-ink truncate">{a.n}</div>
                    <div className="text-[11px] text-ink-soft truncate">{a.motivo}</div>
                  </div>
                  <span className="text-sm font-semibold text-[var(--neon-coral)]">{a.g}</span>
                </div>
              </li>
            ))}
          </ul>
          <button onClick={onAskAI} className="mt-3 w-full text-xs inline-flex items-center justify-center gap-1.5 rounded-lg glass border border-white/10 py-2 text-ink hover:text-[var(--neon-coral)]">
            <Sparkles className="h-3.5 w-3.5" /> Sugerir intervención con IA
          </button>
        </Panel>
      </div>

      {/* Recent evaluations + quick actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Panel title="Últimas evaluaciones" icon={ClipboardCheck} className="lg:col-span-2"
               action={<button onClick={() => onNav("evaluaciones")} className="text-xs text-ink-soft hover:text-ink inline-flex items-center gap-1">Ver todas <ChevronRight className="h-3.5 w-3.5" /></button>}>
          <div className="divide-y divide-white/5">
            {mockEvaluaciones.slice(0, 5).map((e) => (
              <EvalRow key={e.id} e={e} onOpen={() => onNav("captura")} />
            ))}
          </div>
        </Panel>

        <Panel title="Acciones rápidas" icon={Sparkles}>
          <div className="grid grid-cols-2 gap-2 mt-1">
            <QuickAction icon={Plus} label="Nueva evaluación" onClick={() => onNav("nueva")} />
            <QuickAction icon={Grid3x3} label="Crear rúbrica" onClick={() => onNav("rubricas")} />
            <QuickAction icon={ListChecks} label="Lista de cotejo" onClick={() => onNav("cotejo")} />
            <QuickAction icon={Sparkles} label="Análisis IA" onClick={() => onNav("analisis")} />
            <QuickAction icon={BarChart3} label="Comparativos" onClick={() => onNav("comparativos")} />
            <QuickAction icon={FileText} label="Reporte grupal" onClick={() => onNav("reportes")} />
          </div>
          <div className="mt-4 rounded-xl glass border border-white/10 p-3">
            <div className="flex items-center gap-2 text-[11px] text-ink-soft"><Bell className="h-3.5 w-3.5" /> Notificaciones</div>
            <ul className="mt-2 space-y-1.5 text-[12px] text-ink">
              <li>· 4 alumnos sin capturar en <b>Fracciones</b></li>
              <li>· Rúbrica <b>Proyecto Cívico</b> vence mañana</li>
              <li>· Promedio de Iván bajó 1.2 en dos semanas</li>
            </ul>
          </div>
        </Panel>
      </div>
    </div>
  );
}

/* ---------- KPI ---------- */
function KPI({ icon: Icon, label, value, delta, hint, tone }: {
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>; label: string; value: string;
  delta?: string; hint?: string; tone: "cyan" | "coral" | "amber" | "lime" | "violet" | "pink";
}) {
  const map: Record<string, string> = {
    cyan: "oklch(0.78 0.15 200)", coral: "oklch(0.72 0.19 25)", amber: "oklch(0.78 0.17 65)",
    lime: "oklch(0.82 0.18 145)", violet: "oklch(0.62 0.20 295)", pink: "oklch(0.68 0.24 340)",
  };
  const color = map[tone];
  return (
    <div className="glass rounded-2xl p-4 border border-white/10 card-lift card-lift-hover relative overflow-hidden">
      <div className="absolute -top-8 -right-8 h-24 w-24 rounded-full opacity-25 blur-2xl" style={{ background: color }} />
      <div className="flex items-start justify-between relative">
        <div className="h-9 w-9 rounded-xl grid place-items-center ring-1 ring-white/15"
             style={{ background: `color-mix(in oklch, ${color} 20%, transparent)` }}>
          <Icon className="h-4.5 w-4.5" style={{ color }} />
        </div>
        {delta && (
          <span className="text-[10px] font-medium inline-flex items-center gap-0.5"
                style={{ color: delta.startsWith("-") ? "var(--neon-coral)" : "oklch(0.82 0.18 145)" }}>
            {delta.startsWith("-") ? <TrendingDown className="h-3 w-3" /> : <TrendingUp className="h-3 w-3" />}
            {delta}
          </span>
        )}
      </div>
      <div className="mt-3 font-serif text-2xl text-ink leading-none">{value}</div>
      <div className="text-[11px] text-ink-soft mt-1.5">{label}</div>
      {hint && <div className="text-[10px] text-ink-soft/80 mt-0.5">{hint}</div>}
    </div>
  );
}

/* ---------- Panel ---------- */
function Panel({ title, subtitle, icon: Icon, children, className = "", action, tone }: {
  title: string; subtitle?: string; icon?: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  children: React.ReactNode; className?: string; action?: React.ReactNode; tone?: "coral";
}) {
  return (
    <div className={`glass rounded-2xl p-5 border border-white/10 ${className}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2.5 min-w-0">
          {Icon && (
            <div className="h-8 w-8 rounded-lg grid place-items-center ring-1 ring-white/10"
                 style={{ background: tone === "coral" ? "color-mix(in oklch, var(--neon-coral) 18%, transparent)" : "oklch(1 0 0 / 5%)" }}>
              <Icon className="h-4 w-4" style={{ color: tone === "coral" ? "var(--neon-coral)" : "var(--ink)" }} />
            </div>
          )}
          <div className="min-w-0">
            <div className="text-sm font-medium text-ink truncate">{title}</div>
            {subtitle && <div className="text-[11px] text-ink-soft truncate">{subtitle}</div>}
          </div>
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}

function QuickAction({ icon: Icon, label, onClick }: { icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>; label: string; onClick?: () => void }) {
  return (
    <button onClick={onClick} className="btn-3d group rounded-xl glass border border-white/10 p-3 text-left hover:border-[var(--neon-coral)]/40 transition">
      <Icon className="h-4 w-4 text-ink group-hover:text-[var(--neon-coral)] transition" />
      <div className="text-[12px] text-ink mt-2 leading-tight">{label}</div>
    </button>
  );
}

/* ---------- Avatar ---------- */
function Avatar({ name }: { name: string }) {
  const initials = name.split(" ").map((n) => n[0]).slice(0, 2).join("");
  const hue = (name.charCodeAt(0) * 13) % 360;
  return (
    <div
      className="h-8 w-8 rounded-full grid place-items-center text-[11px] font-semibold text-white ring-1 ring-white/15 shrink-0"
      style={{ background: `linear-gradient(135deg, oklch(0.65 0.15 ${hue}), oklch(0.55 0.18 ${(hue + 60) % 360}))` }}
    >{initials}</div>
  );
}

const tooltipStyle: React.CSSProperties = {
  background: "oklch(0.20 0.018 265 / 95%)",
  border: "1px solid oklch(1 0 0 / 12%)",
  borderRadius: 12, fontSize: 12, color: "oklch(0.97 0.005 260)",
  boxShadow: "0 10px 30px -10px oklch(0 0 0 / 60%)",
};

/* ============================================================
   Mock data
   ============================================================ */

interface EvaluacionMock {
  id: string; nombre: string; tipo: string; momento: string; campo: string;
  fecha: string; capturado: number; total: number; promedio: number;
}
const mockEvaluaciones: EvaluacionMock[] = [
  { id: "e1", nombre: "Fracciones equivalentes", tipo: "Rúbrica", momento: "Formativa", campo: "Saberes y pensamiento científico", fecha: "12 Ene", capturado: 24, total: 28, promedio: 8.7 },
  { id: "e2", nombre: "Proyecto: Mi comunidad", tipo: "Proyecto", momento: "Sumativa", campo: "Ética, Naturaleza y Sociedades", fecha: "10 Ene", capturado: 28, total: 28, promedio: 9.1 },
  { id: "e3", nombre: "Comprensión lectora — Cuento", tipo: "Lista de cotejo", momento: "Formativa", campo: "Lenguajes", fecha: "8 Ene", capturado: 28, total: 28, promedio: 8.4 },
  { id: "e4", nombre: "Autoevaluación del bimestre", tipo: "Autoevaluación", momento: "Formativa", campo: "De lo humano y lo comunitario", fecha: "5 Ene", capturado: 22, total: 28, promedio: 8.9 },
  { id: "e5", nombre: "Examen diagnóstico", tipo: "Examen", momento: "Diagnóstica", campo: "Saberes y pensamiento científico", fecha: "3 Sep", capturado: 28, total: 28, promedio: 7.4 },
];

const mockAlumnos = [
  "María F. Ramos", "Luis A. Cortés", "Sofía Mendoza", "Diego Pérez", "Camila Ruiz",
  "Iván Torres", "Renata López", "Julián Vega", "Emma Ortega", "Mateo Silva",
  "Valentina Cruz", "Santiago Ríos", "Isabella Nava", "Andrés Morales", "Ximena Paz",
  "Leonardo Vidal", "Regina Soto", "Bruno Herrera", "Paula Delgado", "Tomás Castro",
  "Aitana Reyes", "Emiliano Luna", "Daniela Rico", "Sebastián Peña", "Fernanda Ávila",
  "Rodrigo Márquez", "Antonella Ibarra", "Óscar Domínguez",
];

/* ============================================================
   Evaluaciones list
   ============================================================ */
function EvaluacionesList({ onNav }: { onNav: (s: SectionKey) => void }) {
  const [q, setQ] = useState("");
  const [filtro, setFiltro] = useState<string>("todas");
  const filtered = mockEvaluaciones.filter((e) =>
    (filtro === "todas" || e.momento.toLowerCase() === filtro) &&
    (q.trim() === "" || [e.nombre, e.tipo, e.campo].join(" ").toLowerCase().includes(q.toLowerCase()))
  );
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 items-center justify-between">
        <div className="flex items-center gap-2 glass rounded-xl border border-white/10 px-3 py-2 flex-1 max-w-md">
          <Search className="h-4 w-4 text-ink-soft" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar evaluación, tipo, campo…"
                 className="bg-transparent outline-none text-sm flex-1 text-ink placeholder:text-ink-soft/70" />
        </div>
        <div className="flex items-center gap-1 glass rounded-xl border border-white/10 p-1">
          {["todas", "diagnóstica", "formativa", "sumativa", "final"].map((m) => (
            <button key={m} onClick={() => setFiltro(m)}
                    className={`text-xs px-3 py-1.5 rounded-lg capitalize transition ${filtro === m ? "pill-active" : "text-ink-soft hover:text-ink"}`}>
              {m}
            </button>
          ))}
        </div>
        <button onClick={() => onNav("nueva")} className="btn-3d inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium text-white"
                style={{ background: "linear-gradient(135deg, oklch(0.72 0.19 25), oklch(0.68 0.24 340))" }}>
          <Plus className="h-4 w-4" /> Nueva
        </button>
      </div>

      <Panel title="Evaluaciones del ciclo" icon={ClipboardCheck}>
        <div className="divide-y divide-white/5">
          {filtered.map((e) => <EvalRow key={e.id} e={e} onOpen={() => onNav("captura")} />)}
        </div>
      </Panel>
    </div>
  );
}

function EvalRow({ e, onOpen }: { e: EvaluacionMock; onOpen: () => void }) {
  const pct = Math.round((e.capturado / e.total) * 100);
  const momColor = e.momento === "Diagnóstica" ? "oklch(0.78 0.15 200)" :
                   e.momento === "Sumativa" ? "oklch(0.68 0.24 340)" :
                   e.momento === "Final" ? "oklch(0.62 0.20 295)" : "oklch(0.78 0.17 65)";
  return (
    <button onClick={onOpen} className="w-full grid grid-cols-12 items-center gap-3 py-3 px-1 hover:bg-white/[0.03] rounded-lg text-left">
      <div className="col-span-12 md:col-span-5 min-w-0">
        <div className="text-sm text-ink truncate">{e.nombre}</div>
        <div className="text-[11px] text-ink-soft truncate">{e.campo}</div>
      </div>
      <div className="col-span-4 md:col-span-2">
        <span className="text-[10px] uppercase tracking-wider px-2 py-1 rounded-full ring-1 ring-white/10"
              style={{ color: momColor, background: `color-mix(in oklch, ${momColor} 12%, transparent)` }}>
          {e.momento}
        </span>
      </div>
      <div className="col-span-4 md:col-span-2 text-[12px] text-ink-soft">{e.tipo}</div>
      <div className="col-span-4 md:col-span-1 text-[12px] text-ink-soft">{e.fecha}</div>
      <div className="col-span-8 md:col-span-1">
        <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
          <div className="h-full rounded-full" style={{ width: `${pct}%`, background: "var(--gradient-neon)" }} />
        </div>
        <div className="text-[10px] text-ink-soft mt-1">{e.capturado}/{e.total}</div>
      </div>
      <div className="col-span-4 md:col-span-1 text-right font-serif text-lg text-ink">{e.promedio.toFixed(1)}</div>
    </button>
  );
}

/* ============================================================
   Nueva evaluación
   ============================================================ */
function NuevaEvaluacion({ onAskAI, onCreated }: { onAskAI: () => void; onCreated: () => void }) {
  const tipos = ["Lista de cotejo", "Escala estimativa", "Rúbrica", "Examen", "Proyecto", "Observación", "Portafolio", "Participación", "Exposición", "Producto final", "Autoevaluación", "Coevaluación", "Heteroevaluación"];
  const momentos = ["Diagnóstica", "Formativa", "Sumativa", "Final"];
  const campos = ["Lenguajes", "Saberes y pensamiento científico", "Ética, Naturaleza y Sociedades", "De lo humano y lo comunitario"];
  const [tipo, setTipo] = useState("Rúbrica");
  const [mom, setMom] = useState("Formativa");
  const [campo, setCampo] = useState(campos[0]);
  const [nombre, setNombre] = useState("");

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="lg:col-span-2 space-y-4">
        <Panel title="Datos de la evaluación" icon={ClipboardCheck}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Field label="Nombre">
              <input value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Ej. Proyecto: Los seres vivos"
                     className="w-full bg-transparent outline-none text-sm text-ink" />
            </Field>
            <Field label="Materia / Contenido">
              <input placeholder="Ej. Ciencias Naturales — Ecosistemas" className="w-full bg-transparent outline-none text-sm text-ink" />
            </Field>
            <Select label="Campo formativo" value={campo} onChange={setCampo} options={campos} />
            <Select label="Momento" value={mom} onChange={setMom} options={momentos} />
            <Field label="PDA (Proceso de desarrollo)">
              <input placeholder="Selecciona o describe el PDA" className="w-full bg-transparent outline-none text-sm text-ink" />
            </Field>
            <Field label="Proyecto vinculado">
              <input placeholder="Ninguno" className="w-full bg-transparent outline-none text-sm text-ink" />
            </Field>
            <Field label="Fecha de aplicación">
              <input type="date" className="w-full bg-transparent outline-none text-sm text-ink" />
            </Field>
            <Field label="Periodo">
              <input placeholder="2° trimestre" className="w-full bg-transparent outline-none text-sm text-ink" />
            </Field>
          </div>
        </Panel>

        <Panel title="Tipo de instrumento" icon={Layers} subtitle="Elige el que mejor se adapte a la evidencia esperada">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {tipos.map((t) => {
              const active = tipo === t;
              return (
                <button key={t} onClick={() => setTipo(t)}
                        className={`btn-3d rounded-xl px-3 py-3 text-[12.5px] text-left border transition ${
                          active ? "border-[var(--neon-coral)]/60 text-ink"
                                 : "border-white/10 text-ink-soft hover:text-ink hover:border-white/20"
                        }`}
                        style={active ? { background: "color-mix(in oklch, var(--neon-coral) 12%, transparent)" } : {}}>
                  {t}
                </button>
              );
            })}
          </div>
        </Panel>

        <Panel title="Escala de valoración" icon={Target}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {["Excelente", "Satisfactorio", "En proceso", "Requiere apoyo"].map((n, i) => {
              const colors = ["oklch(0.82 0.18 145)", "oklch(0.78 0.17 65)", "oklch(0.68 0.24 340)", "oklch(0.72 0.19 25)"];
              return (
                <div key={n} className="rounded-xl glass border border-white/10 p-3">
                  <span className="h-2 w-8 rounded-full block" style={{ background: colors[i] }} />
                  <div className="text-sm text-ink mt-2">{n}</div>
                  <div className="text-[11px] text-ink-soft">Nivel {4 - i}</div>
                </div>
              );
            })}
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-ink-soft">
            <span>o usar escala numérica</span>
            <span className="inline-flex items-center gap-1 rounded-full glass border border-white/10 px-2.5 py-1 text-ink">5 – 10</span>
            <button className="text-[var(--neon-coral)] hover:underline">Configurar…</button>
          </div>
        </Panel>
      </div>

      <div className="space-y-4">
        <Panel title="Asistente pedagógico IA" icon={Sparkles} tone="coral">
          <p className="text-[13px] text-ink-soft">
            SIED IA puede generar el instrumento completo para <b>{tipo}</b>, alineado a la Nueva Escuela Mexicana,
            para <b>{campo}</b> — momento <b>{mom}</b>.
          </p>
          <button onClick={onAskAI} className="btn-3d mt-3 w-full inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-white"
                  style={{ background: "linear-gradient(135deg, oklch(0.72 0.19 25), oklch(0.68 0.24 340))" }}>
            <Sparkles className="h-4 w-4" /> Generar con IA
          </button>
          <div className="mt-3 space-y-1.5 text-[12px] text-ink-soft">
            <div className="flex gap-2"><Check className="h-3.5 w-3.5 text-[var(--neon-cyan)]" /> Rúbrica con 4 criterios y 4 niveles</div>
            <div className="flex gap-2"><Check className="h-3.5 w-3.5 text-[var(--neon-cyan)]" /> Reactivos con clave y retroalimentación</div>
            <div className="flex gap-2"><Check className="h-3.5 w-3.5 text-[var(--neon-cyan)]" /> Indicadores observables por PDA</div>
          </div>
        </Panel>

        <Panel title="Vista previa" icon={Eye}>
          <div className="text-sm text-ink">{nombre || "Sin título aún"}</div>
          <div className="text-[11px] text-ink-soft mt-0.5">{tipo} · {mom} · {campo}</div>
          <button onClick={onCreated} className="btn-3d mt-4 w-full inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium glass border border-white/10 text-ink">
            <Save className="h-4 w-4" /> Guardar y capturar
          </button>
        </Panel>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="text-[10px] uppercase tracking-[0.15em] text-ink-soft mb-1.5">{label}</div>
      <div className="rounded-xl glass border border-white/10 px-3 py-2.5">{children}</div>
    </label>
  );
}
function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <label className="block">
      <div className="text-[10px] uppercase tracking-[0.15em] text-ink-soft mb-1.5">{label}</div>
      <div className="rounded-xl glass border border-white/10 px-3 py-2.5">
        <select value={value} onChange={(e) => onChange(e.target.value)}
                className="w-full bg-transparent outline-none text-sm text-ink appearance-none">
          {options.map((o) => <option key={o} value={o} className="bg-[oklch(0.20_0.018_265)]">{o}</option>)}
        </select>
      </div>
    </label>
  );
}

/* ============================================================
   Captura de calificaciones
   ============================================================ */
function Captura() {
  const niveles = ["Excelente", "Satisfactorio", "En proceso", "Requiere apoyo"];
  const [values, setValues] = useState<Record<string, { n?: number; nivel?: string; obs?: string }>>({});
  const [saved, setSaved] = useState(false);
  const set = (name: string, patch: Partial<{ n: number; nivel: string; obs: string }>) => {
    setValues((v) => ({ ...v, [name]: { ...v[name], ...patch } }));
    setSaved(true);
    setTimeout(() => setSaved(false), 900);
  };
  const capturados = Object.values(values).filter((v) => v.n !== undefined || v.nivel !== undefined).length;

  return (
    <div className="space-y-4">
      <Panel title="Fracciones equivalentes" subtitle="Rúbrica · Formativa · Saberes y pensamiento científico" icon={PenLine}
             action={
               <div className="flex items-center gap-2 text-[11px] text-ink-soft">
                 {saved && <span className="inline-flex items-center gap-1 text-[var(--neon-cyan)]"><Check className="h-3 w-3" /> Guardado</span>}
                 <span>{capturados}/{mockAlumnos.length} capturados</span>
               </div>
             }>
        <div className="overflow-x-auto -mx-5 px-5">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-wider text-ink-soft">
                <th className="py-2 font-normal">Alumno</th>
                <th className="py-2 font-normal w-24">Calif.</th>
                <th className="py-2 font-normal">Nivel de desempeño</th>
                <th className="py-2 font-normal">Observaciones</th>
                <th className="py-2 font-normal w-16 text-center">Evid.</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {mockAlumnos.map((n) => {
                const v = values[n] ?? {};
                return (
                  <tr key={n} className="hover:bg-white/[0.03]">
                    <td className="py-2.5">
                      <div className="flex items-center gap-2.5">
                        <Avatar name={n} />
                        <span className="text-ink">{n}</span>
                      </div>
                    </td>
                    <td className="py-2.5">
                      <input
                        type="number" min={5} max={10} step={0.1}
                        value={v.n ?? ""} onChange={(e) => set(n, { n: parseFloat(e.target.value) })}
                        placeholder="—"
                        className="w-20 bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 text-ink outline-none focus:border-[var(--neon-coral)]/50"
                      />
                    </td>
                    <td className="py-2.5">
                      <div className="flex flex-wrap gap-1">
                        {niveles.map((nl, i) => {
                          const active = v.nivel === nl;
                          const colors = ["oklch(0.82 0.18 145)", "oklch(0.78 0.17 65)", "oklch(0.68 0.24 340)", "oklch(0.72 0.19 25)"];
                          return (
                            <button key={nl} onClick={() => set(n, { nivel: nl })}
                                    className={`text-[11px] px-2 py-1 rounded-full border transition ${active ? "text-ink" : "text-ink-soft hover:text-ink border-white/10"}`}
                                    style={active ? { background: `color-mix(in oklch, ${colors[i]} 18%, transparent)`, borderColor: `color-mix(in oklch, ${colors[i]} 50%, transparent)` } : {}}>
                              {nl}
                            </button>
                          );
                        })}
                      </div>
                    </td>
                    <td className="py-2.5">
                      <input value={v.obs ?? ""} onChange={(e) => set(n, { obs: e.target.value })}
                             placeholder="Comentario breve…"
                             className="w-full bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 text-ink outline-none focus:border-[var(--neon-coral)]/50 text-[13px]" />
                    </td>
                    <td className="py-2.5">
                      <div className="flex items-center justify-center gap-1 text-ink-soft">
                        <button className="h-7 w-7 grid place-items-center rounded-md hover:bg-white/10 hover:text-[var(--neon-cyan)]"><Camera className="h-3.5 w-3.5" /></button>
                        <button className="h-7 w-7 grid place-items-center rounded-md hover:bg-white/10 hover:text-[var(--neon-pink)]"><Paperclip className="h-3.5 w-3.5" /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}

/* ============================================================
   Rúbricas — constructor visual
   ============================================================ */
interface RubricaCriterio { id: string; nombre: string; niveles: string[] }
function Rubricas({ onAskAI }: { onAskAI: () => void }) {
  const [criterios, setCriterios] = useState<RubricaCriterio[]>([
    { id: "c1", nombre: "Comprensión del contenido", niveles: ["Domina y explica con ejemplos", "Comprende con apoyos", "Comprende parcialmente", "Requiere apoyo constante"] },
    { id: "c2", nombre: "Aplicación en situaciones", niveles: ["Aplica en contextos nuevos", "Aplica en contextos similares", "Aplica con guía", "Aún no aplica"] },
    { id: "c3", nombre: "Comunicación de ideas", niveles: ["Comunica con claridad y evidencia", "Comunica con precisión", "Comunica con dificultad", "Requiere modelar"] },
  ]);
  const puntajes = [4, 3, 2, 1];
  const addCriterio = () => setCriterios((cs) => [...cs, { id: `c${cs.length + 1}`, nombre: "Nuevo criterio", niveles: ["", "", "", ""] }]);
  const setNombre = (id: string, nombre: string) => setCriterios((cs) => cs.map((c) => c.id === id ? { ...c, nombre } : c));
  const setNivel = (id: string, i: number, txt: string) => setCriterios((cs) => cs.map((c) => c.id === id ? { ...c, niveles: c.niveles.map((n, j) => j === i ? txt : n) } : c));
  const removeCriterio = (id: string) => setCriterios((cs) => cs.filter((c) => c.id !== id));

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-serif text-2xl text-ink">Constructor de rúbricas</h2>
          <p className="text-sm text-ink-soft">Diseña criterios y niveles. Guarda plantillas para reutilizar.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={onAskAI} className="btn-3d inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm text-white"
                  style={{ background: "linear-gradient(135deg, oklch(0.72 0.19 25), oklch(0.68 0.24 340))" }}>
            <Sparkles className="h-4 w-4" /> Generar con IA
          </button>
          <button className="btn-3d inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm glass border border-white/10 text-ink"><Copy className="h-4 w-4" /> Duplicar</button>
          <button className="btn-3d inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm glass border border-white/10 text-ink"><Share2 className="h-4 w-4" /> Compartir</button>
          <button className="btn-3d inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm glass border border-white/10 text-ink"><Save className="h-4 w-4" /> Guardar plantilla</button>
        </div>
      </div>

      <Panel title="Rúbrica: Proyecto — Mi comunidad" icon={Grid3x3} subtitle="4 niveles · puntaje 1–4">
        <div className="overflow-x-auto -mx-5 px-5">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-wider text-ink-soft">
                <th className="py-2 w-56 font-normal">Criterio</th>
                {puntajes.map((p, i) => (
                  <th key={p} className="py-2 font-normal">
                    <div className="text-ink">Nivel {p}</div>
                    <div className="text-[10px]">{["Excelente", "Satisfactorio", "En proceso", "Requiere apoyo"][i]} · {p} pts</div>
                  </th>
                ))}
                <th className="py-2 w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {criterios.map((c) => (
                <tr key={c.id} className="align-top">
                  <td className="py-3 pr-3">
                    <input value={c.nombre} onChange={(e) => setNombre(c.id, e.target.value)}
                           className="w-full bg-white/5 border border-white/10 rounded-lg px-2.5 py-2 text-ink outline-none focus:border-[var(--neon-coral)]/50" />
                  </td>
                  {c.niveles.map((n, i) => (
                    <td key={i} className="py-3 pr-3">
                      <textarea value={n} onChange={(e) => setNivel(c.id, i, e.target.value)} rows={2}
                                className="w-full min-w-40 bg-white/5 border border-white/10 rounded-lg px-2.5 py-2 text-ink outline-none focus:border-[var(--neon-coral)]/50 text-[12.5px] resize-none" />
                    </td>
                  ))}
                  <td className="py-3">
                    <button onClick={() => removeCriterio(c.id)} className="h-7 w-7 grid place-items-center rounded-md text-ink-soft hover:text-[var(--neon-coral)] hover:bg-white/10">
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button onClick={addCriterio} className="mt-4 inline-flex items-center gap-2 text-sm text-[var(--neon-coral)] hover:underline">
          <Plus className="h-4 w-4" /> Agregar criterio
        </button>
      </Panel>
    </div>
  );
}

/* ============================================================
   Listas de cotejo
   ============================================================ */
function ListasCotejo({ onAskAI }: { onAskAI: () => void }) {
  const [indicadores, setIndicadores] = useState<string[]>([
    "Identifica ideas principales del texto",
    "Formula preguntas sobre lo leído",
    "Relaciona el texto con su contexto",
    "Expresa conclusiones con claridad",
    "Colabora con respeto en el equipo",
  ]);
  const [datos, setDatos] = useState<Record<string, Record<number, "cumple" | "no" | "parcial">>>({});
  const set = (a: string, i: number, v: "cumple" | "no" | "parcial") =>
    setDatos((d) => ({ ...d, [a]: { ...d[a], [i]: v } }));

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-serif text-2xl text-ink">Listas de cotejo</h2>
          <p className="text-sm text-ink-soft">Indicadores observables. Cumple / Parcial / No cumple.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={onAskAI} className="btn-3d inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm text-white"
                  style={{ background: "linear-gradient(135deg, oklch(0.72 0.19 25), oklch(0.68 0.24 340))" }}>
            <Sparkles className="h-4 w-4" /> Generar con IA
          </button>
          <button onClick={() => setIndicadores((is) => [...is, "Nuevo indicador"])}
                  className="btn-3d inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm glass border border-white/10 text-ink">
            <Plus className="h-4 w-4" /> Indicador
          </button>
        </div>
      </div>

      <Panel title="Comprensión lectora — El cuento" icon={ListChecks}>
        <div className="overflow-x-auto -mx-5 px-5">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-wider text-ink-soft">
                <th className="py-2 font-normal w-56">Alumno</th>
                {indicadores.map((ind, i) => (
                  <th key={i} className="py-2 font-normal min-w-32">
                    <input value={ind} onChange={(e) => setIndicadores((is) => is.map((x, j) => j === i ? e.target.value : x))}
                           className="w-full bg-transparent outline-none text-ink text-[12px] font-medium" />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {mockAlumnos.slice(0, 12).map((a) => (
                <tr key={a} className="hover:bg-white/[0.03]">
                  <td className="py-2.5">
                    <div className="flex items-center gap-2.5">
                      <Avatar name={a} /> <span className="text-ink">{a}</span>
                    </div>
                  </td>
                  {indicadores.map((_, i) => {
                    const v = datos[a]?.[i];
                    return (
                      <td key={i} className="py-2.5">
                        <div className="inline-flex items-center gap-1 rounded-lg glass border border-white/10 p-0.5">
                          <TriBtn active={v === "cumple"} onClick={() => set(a, i, "cumple")} color="oklch(0.82 0.18 145)" icon={Check} />
                          <TriBtn active={v === "parcial"} onClick={() => set(a, i, "parcial")} color="oklch(0.78 0.17 65)" icon={Minus} />
                          <TriBtn active={v === "no"} onClick={() => set(a, i, "no")} color="oklch(0.72 0.19 25)" icon={X} />
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}

function TriBtn({ active, onClick, color, icon: Icon }: { active: boolean; onClick: () => void; color: string; icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }> }) {
  return (
    <button onClick={onClick} className="h-6 w-6 grid place-items-center rounded-md transition"
            style={active ? { background: color, color: "white" } : { color: "var(--ink-soft)" }}>
      <Icon className="h-3 w-3" />
    </button>
  );
}

/* ============================================================
   Análisis IA
   ============================================================ */
function AnalisisIA({ onAskAI }: { onAskAI: () => void }) {
  const radar = [
    { s: "Comprensión", A: 8.5, B: 7.2 },
    { s: "Aplicación", A: 8.1, B: 6.8 },
    { s: "Comunicación", A: 8.9, B: 7.5 },
    { s: "Colaboración", A: 9.2, B: 7.9 },
    { s: "Creatividad", A: 8.3, B: 7.1 },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <Panel title="Fortalezas del grupo" icon={Award} className="lg:col-span-1" tone="coral">
        <ul className="space-y-2.5 text-[13px] text-ink">
          <li className="flex gap-2"><Check className="h-4 w-4 text-[var(--neon-lime,oklch(0.82_0.18_145))] mt-0.5" /> Alta participación oral en Lenguajes (92%).</li>
          <li className="flex gap-2"><Check className="h-4 w-4 text-[var(--neon-lime,oklch(0.82_0.18_145))] mt-0.5" /> Excelente trabajo colaborativo en proyectos.</li>
          <li className="flex gap-2"><Check className="h-4 w-4 text-[var(--neon-lime,oklch(0.82_0.18_145))] mt-0.5" /> Autonomía en resolución de retos matemáticos.</li>
        </ul>
      </Panel>

      <Panel title="Áreas de oportunidad" icon={Target}>
        <ul className="space-y-2.5 text-[13px] text-ink">
          <li className="flex gap-2"><AlertTriangle className="h-4 w-4 text-[var(--neon-coral)] mt-0.5" /> Comprensión lectora inferencial (2.5 pts abajo).</li>
          <li className="flex gap-2"><AlertTriangle className="h-4 w-4 text-[var(--neon-coral)] mt-0.5" /> Fracciones equivalentes: 40% en nivel "En proceso".</li>
          <li className="flex gap-2"><AlertTriangle className="h-4 w-4 text-[var(--neon-coral)] mt-0.5" /> Argumentación escrita — necesita modelado.</li>
        </ul>
      </Panel>

      <Panel title="Alumnos en riesgo" icon={Users}>
        <ul className="space-y-2 text-[13px]">
          {["Iván Torres · Matemáticas", "Renata López · Ausentismo", "Julián Vega · Entregas"].map((r) => (
            <li key={r} className="flex items-center gap-2 rounded-lg px-2 py-1.5 bg-white/[0.03]">
              <span className="h-2 w-2 rounded-full bg-[var(--neon-coral)]" />
              <span className="text-ink">{r}</span>
            </li>
          ))}
        </ul>
      </Panel>

      <Panel title="Radar de desempeño" icon={RadarIcon} className="lg:col-span-2">
        <div className="h-72">
          <ResponsiveContainer>
            <RadarChart data={radar}>
              <PolarGrid stroke="oklch(1 0 0 / 10%)" />
              <PolarAngleAxis dataKey="s" tick={{ fill: "oklch(0.72 0.015 260)", fontSize: 11 }} />
              <PolarRadiusAxis domain={[0, 10]} tick={{ fill: "oklch(0.72 0.015 260)", fontSize: 10 }} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 11, color: "var(--ink-soft)" }} />
              <Radar name="Actual" dataKey="A" stroke="oklch(0.68 0.24 340)" fill="oklch(0.68 0.24 340)" fillOpacity={0.35} />
              <Radar name="Diagnóstico" dataKey="B" stroke="oklch(0.78 0.15 200)" fill="oklch(0.78 0.15 200)" fillOpacity={0.2} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </Panel>

      <Panel title="Recomendaciones IA" icon={Sparkles} tone="coral">
        <div className="text-[13px] text-ink space-y-2">
          <p>· Modela lectura inferencial con protocolo <b>"pregunto-predigo-verifico"</b>.</p>
          <p>· Introduce fracciones con material concreto (tiras y regletas) 3 sesiones.</p>
          <p>· Diseña tutoría entre pares: alumnos 9+ acompañan a alumnos en riesgo.</p>
          <p>· Retroalimenta con audios personalizados de 60 s.</p>
        </div>
        <button onClick={onAskAI} className="btn-3d mt-3 w-full inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-white"
                style={{ background: "linear-gradient(135deg, oklch(0.72 0.19 25), oklch(0.68 0.24 340))" }}>
          <Sparkles className="h-4 w-4" /> Diseñar intervención completa
        </button>
      </Panel>
    </div>
  );
}

/* ============================================================
   Comparativos
   ============================================================ */
function Comparativos() {
  const data = [
    { m: "Diagnóstica", grupo: 7.2, meta: 8 },
    { m: "1er momento", grupo: 7.9, meta: 8 },
    { m: "2do momento", grupo: 8.4, meta: 8 },
    { m: "3er momento", grupo: 8.6, meta: 8 },
    { m: "Final", grupo: 8.9, meta: 8 },
  ];
  const crecimiento = mockAlumnos.slice(0, 8).map((n, i) => ({
    n, diag: 6 + (i % 3) * 0.5, final: 7 + (i % 4) * 0.6 + 1.2,
  }));

  return (
    <div className="space-y-4">
      <Panel title="Trayectoria del grupo" icon={TrendingUp} subtitle="Diagnóstica → Final vs. meta pedagógica">
        <div className="h-72">
          <ResponsiveContainer>
            <LineChart data={data}>
              <CartesianGrid stroke="oklch(1 0 0 / 6%)" vertical={false} />
              <XAxis dataKey="m" stroke="oklch(0.72 0.015 260)" tick={{ fontSize: 12 }} />
              <YAxis domain={[6, 10]} stroke="oklch(0.72 0.015 260)" tick={{ fontSize: 12 }} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line type="monotone" dataKey="grupo" stroke="oklch(0.72 0.19 25)" strokeWidth={3} dot={{ r: 5 }} />
              <Line type="monotone" dataKey="meta" stroke="oklch(0.78 0.15 200)" strokeWidth={2} strokeDasharray="5 5" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Panel>

      <Panel title="Crecimiento por alumno" icon={BarChart3} subtitle="Diagnóstica vs. evaluación final">
        <div className="h-80">
          <ResponsiveContainer>
            <BarChart data={crecimiento}>
              <CartesianGrid stroke="oklch(1 0 0 / 6%)" vertical={false} />
              <XAxis dataKey="n" stroke="oklch(0.72 0.015 260)" tick={{ fontSize: 10 }} interval={0} angle={-20} textAnchor="end" height={70} />
              <YAxis domain={[5, 10]} stroke="oklch(0.72 0.015 260)" tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="diag" name="Diagnóstica" fill="oklch(0.78 0.15 200)" radius={[6, 6, 0, 0]} />
              <Bar dataKey="final" name="Final" fill="oklch(0.72 0.19 25)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Panel>
    </div>
  );
}

/* ============================================================
   Expediente del alumno
   ============================================================ */
function Expediente() {
  const [selected, setSelected] = useState(mockAlumnos[0]);
  const historial = [
    { m: "Ago", g: 7.2 }, { m: "Sep", g: 7.6 }, { m: "Oct", g: 8.0 },
    { m: "Nov", g: 8.4 }, { m: "Dic", g: 8.6 }, { m: "Ene", g: 8.9 },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
      <Panel title="Alumnos" icon={Users} className="lg:col-span-1">
        <div className="max-h-[520px] overflow-y-auto scrollbar-hide pr-1 -mr-1 space-y-0.5">
          {mockAlumnos.map((n) => (
            <button key={n} onClick={() => setSelected(n)}
                    className={`w-full flex items-center gap-2.5 rounded-lg px-2 py-2 text-left transition ${selected === n ? "bg-white/[0.06] text-ink" : "text-ink-soft hover:text-ink hover:bg-white/[0.03]"}`}>
              <Avatar name={n} /> <span className="text-sm truncate flex-1">{n}</span>
            </button>
          ))}
        </div>
      </Panel>

      <div className="lg:col-span-3 space-y-4">
        <Panel title={selected} subtitle="Segundo C · Ciclo 2025–2026" icon={GraduationCap}
               action={<button className="text-xs inline-flex items-center gap-1 text-ink-soft hover:text-ink"><FileText className="h-3.5 w-3.5" /> Exportar expediente</button>}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-1">
            <MiniStat label="Promedio general" value="8.7" />
            <MiniStat label="Evaluaciones" value="12" />
            <MiniStat label="Asistencia" value="96%" />
            <MiniStat label="Nivel" value="Satisfactorio" small />
          </div>
        </Panel>

        <Panel title="Trayectoria" icon={LineIcon}>
          <div className="h-56">
            <ResponsiveContainer>
              <AreaChart data={historial}>
                <defs>
                  <linearGradient id="stG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.68 0.24 340)" stopOpacity={0.55} />
                    <stop offset="100%" stopColor="oklch(0.68 0.24 340)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="oklch(1 0 0 / 6%)" vertical={false} />
                <XAxis dataKey="m" stroke="oklch(0.72 0.015 260)" tick={{ fontSize: 12 }} />
                <YAxis domain={[6, 10]} stroke="oklch(0.72 0.015 260)" tick={{ fontSize: 12 }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Area type="monotone" dataKey="g" stroke="oklch(0.68 0.24 340)" strokeWidth={2.5} fill="url(#stG)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Panel title="Historial de evaluaciones" icon={ClipboardCheck}>
            <ul className="divide-y divide-white/5 text-sm">
              {mockEvaluaciones.map((e) => (
                <li key={e.id} className="py-2 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-ink truncate">{e.nombre}</div>
                    <div className="text-[11px] text-ink-soft">{e.tipo} · {e.fecha}</div>
                  </div>
                  <span className="font-serif text-lg text-ink">{(e.promedio + (Math.random() - 0.5)).toFixed(1)}</span>
                </li>
              ))}
            </ul>
          </Panel>

          <Panel title="Evidencias" icon={Camera}>
            <div className="grid grid-cols-3 gap-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="aspect-square rounded-xl relative overflow-hidden ring-1 ring-white/10"
                     style={{ background: `linear-gradient(135deg, oklch(0.5 0.15 ${i * 55}), oklch(0.35 0.12 ${(i * 55 + 40) % 360}))` }}>
                  <div className="absolute bottom-1 left-1 flex items-center gap-1 text-[10px] text-white/90">
                    {i % 3 === 0 ? <Camera className="h-3 w-3" /> : i % 3 === 1 ? <Video className="h-3 w-3" /> : <Mic className="h-3 w-3" />}
                  </div>
                </div>
              ))}
            </div>
            <button className="mt-3 w-full text-xs inline-flex items-center justify-center gap-1.5 rounded-lg glass border border-white/10 py-2 text-ink">
              <Paperclip className="h-3.5 w-3.5" /> Adjuntar evidencia
            </button>
          </Panel>
        </div>

        <Panel title="Retroalimentación docente" icon={MessageSquare} tone="coral">
          <p className="text-[13px] text-ink">
            Excelente progreso en comunicación de ideas. Se sugiere reforzar razonamiento matemático mediante retos semanales
            y continuar la lectura autónoma tres veces por semana. Su participación en el proyecto <em>Mi comunidad</em> fue destacable.
          </p>
        </Panel>
      </div>
    </div>
  );
}
function MiniStat({ label, value, small }: { label: string; value: string; small?: boolean }) {
  return (
    <div className="glass border border-white/10 rounded-2xl p-3">
      <div className={`font-serif text-ink leading-none ${small ? "text-lg" : "text-2xl"}`}>{value}</div>
      <div className="text-[11px] text-ink-soft mt-1.5">{label}</div>
    </div>
  );
}

/* ============================================================
   Reportes
   ============================================================ */
function Reportes() {
  const items = [
    { icon: Users, title: "Reporte grupal", desc: "Panorama completo del grupo, gráficas y recomendaciones." },
    { icon: GraduationCap, title: "Reporte individual", desc: "Trayectoria, evaluaciones y evidencias del alumno." },
    { icon: BookOpen, title: "Reporte para padres", desc: "Lenguaje cercano y logros por campo formativo." },
    { icon: Layers, title: "Reporte por Campo Formativo", desc: "Análisis por área y PDA alcanzados." },
    { icon: TrendingUp, title: "Reporte comparativo", desc: "Diagnóstica, momentos y evaluación final." },
    { icon: AlertTriangle, title: "Reporte de alumnos en riesgo", desc: "Diagnóstico y plan de intervención." },
  ];
  return (
    <div className="space-y-4">
      <Panel title="Generar reportes" icon={FileText} subtitle="PDF · Excel · Word · Imprimir">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {items.map((it) => (
            <div key={it.title} className="rounded-2xl glass border border-white/10 p-4 card-lift card-lift-hover">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-xl grid place-items-center ring-1 ring-white/10"
                     style={{ background: "color-mix(in oklch, var(--neon-cyan) 15%, transparent)" }}>
                  <it.icon className="h-5 w-5 text-[var(--neon-cyan)]" />
                </div>
                <div className="min-w-0">
                  <div className="text-sm text-ink font-medium">{it.title}</div>
                  <div className="text-[11.5px] text-ink-soft mt-0.5 leading-snug">{it.desc}</div>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-1.5">
                <BtnMini icon={FileText} label="PDF" />
                <BtnMini icon={FileSpreadsheet} label="Excel" />
                <BtnMini icon={FileText} label="Word" />
                <BtnMini icon={Printer} label="Imprimir" />
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}
function BtnMini({ icon: Icon, label }: { icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>; label: string }) {
  return (
    <button className="inline-flex items-center gap-1.5 text-[11px] rounded-lg glass border border-white/10 px-2.5 py-1.5 text-ink hover:text-[var(--neon-coral)] hover:border-[var(--neon-coral)]/40 transition">
      <Icon className="h-3.5 w-3.5" /> {label}
    </button>
  );
}
