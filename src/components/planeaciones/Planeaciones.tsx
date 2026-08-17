import { useState } from "react";
import { toast } from "sonner";
import {
  planeaciones,
  distribucionCampos,
  type PlaneacionRegistro,
} from "./planData";
import {
  CompartirPlaneacion,
  copiarAlPortapapeles,
  enlaceDePlaneacion,
} from "./CompartirPlaneacion";
import {
  Sparkles, Plus, ClipboardList, Clock, Layers, BookOpen, Target, TrendingUp,
  Calendar as CalendarIcon, Search, Filter, FileText, Video, Music, Image as ImageIcon,
  Link as LinkIcon, Gamepad2, Wand2, Copy, Share2, Download, Printer, QrCode,
  CheckCircle2, Circle, GripVertical, ChevronRight, Star, Users, Puzzle,
  Lightbulb, Accessibility, ListChecks, Trophy, Repeat, ArrowRight, X, Play,
  MessageSquare, Zap,
} from "lucide-react";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid,
  BarChart, Bar, Cell, LabelList, LineChart, Line, RadarChart, Radar,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis,
} from "recharts";

type SectionKey =
  | "dashboard" | "nueva" | "banco" | "recursos" | "secuencia"
  | "adecuaciones" | "calendario" | "repositorio" | "estadisticas";

const sections: { key: SectionKey; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { key: "dashboard", label: "Panorama", icon: TrendingUp },
  { key: "nueva", label: "Nueva planeación", icon: Plus },
  { key: "banco", label: "Banco de actividades", icon: Layers },
  { key: "recursos", label: "Recursos", icon: FolderIcon },
  { key: "secuencia", label: "Secuencia didáctica", icon: ListChecks },
  { key: "adecuaciones", label: "Adecuaciones", icon: Accessibility },
  { key: "calendario", label: "Calendario", icon: CalendarIcon },
  { key: "repositorio", label: "Repositorio", icon: BookOpen },
  { key: "estadisticas", label: "Estadísticas", icon: TrendingUp },
];

function FolderIcon({ className }: { className?: string }) {
  return <Layers className={className} />;
}

export function Planeaciones({ onAskAI }: { onAskAI: () => void }) {
  const [active, setActive] = useState<SectionKey>("dashboard");

  return (
    <div className="px-5 lg:px-10 py-8 space-y-8">
      <Header onAskAI={onAskAI} onNew={() => setActive("nueva")} />
      <SectionNav active={active} onSelect={setActive} />

      {active === "dashboard" && <Dashboard onNew={() => setActive("nueva")} onOpen={setActive} />}
      {active === "nueva" && <NuevaPlaneacion onAskAI={onAskAI} />}
      {active === "banco" && <BancoActividades />}
      {active === "recursos" && <RecursosDidacticos />}
      {active === "secuencia" && <SecuenciaDidactica onAskAI={onAskAI} />}
      {active === "adecuaciones" && <Adecuaciones onAskAI={onAskAI} />}
      {active === "calendario" && <Calendario />}
      {active === "repositorio" && <Repositorio />}
      {active === "estadisticas" && <Estadisticas />}
    </div>
  );
}

/* ---------- Header ---------- */
function Header({ onAskAI, onNew }: { onAskAI: () => void; onNew: () => void }) {
  return (
    <header className="relative overflow-hidden rounded-3xl glass-strong glow-rainbow led-strip p-6 lg:p-8">
      <div className="flex flex-wrap items-center justify-between gap-6">
        <div className="min-w-0">
          <div className="text-[10px] uppercase tracking-[0.2em] text-ink-soft">Módulo · SIED MX</div>
          <h1 className="font-serif text-3xl lg:text-4xl text-ink mt-1.5">Planeaciones Inteligentes</h1>
          <p className="text-sm text-ink-soft mt-2 max-w-2xl">
            Diseña, genera y mejora tus planeaciones con IA alineada al Plan 2022 y la Nueva Escuela Mexicana.
            Reutiliza actividades exitosas y ahorra horas cada semana.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-2 text-[11px]">
            <span className="glass px-2.5 py-1 rounded-full text-ink-soft">Ciclo 2025–2026</span>
            <span className="glass px-2.5 py-1 rounded-full text-ink-soft">Grado 4° · Grupo B</span>
            <span className="glass px-2.5 py-1 rounded-full text-ink-soft">Turno matutino</span>
            <span className="glass px-2.5 py-1 rounded-full text-[var(--neon-cyan)]">Plan 2022 · NEM</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onAskAI}
            className="btn-3d h-11 px-4 rounded-xl glass-strong border border-white/10 text-sm text-ink inline-flex items-center gap-2"
          >
            <Sparkles className="h-4 w-4 text-[var(--neon-pink)]" />
            Asistente pedagógico
          </button>
          <button
            onClick={onNew}
            className="btn-3d h-11 px-5 rounded-xl text-sm font-medium text-white inline-flex items-center gap-2"
            style={{ background: "var(--gradient-neon)", boxShadow: "var(--glow-coral)" }}
          >
            <Plus className="h-4 w-4" />
            Nueva planeación
          </button>
        </div>
      </div>
    </header>
  );
}

function SectionNav({ active, onSelect }: { active: SectionKey; onSelect: (k: SectionKey) => void }) {
  return (
    <div className="glass rounded-2xl p-1.5 flex gap-1 overflow-x-auto scrollbar-hide">
      {sections.map(({ key, label, icon: Icon }) => {
        const on = active === key;
        return (
          <button
            key={key}
            onClick={() => onSelect(key)}
            className={`shrink-0 inline-flex items-center gap-2 h-10 px-3.5 rounded-xl text-[13px] transition ${
              on ? "pill-active text-ink font-medium" : "text-ink-soft hover:text-ink hover:bg-white/[0.04]"
            }`}
          >
            <Icon className={`h-4 w-4 ${on ? "text-[var(--neon-coral)]" : ""}`} />
            {label}
          </button>
        );
      })}
    </div>
  );
}

/* ---------- Dashboard ---------- */
const kpi = [
  { label: "Planeaciones del ciclo", value: "142", delta: "+12", icon: ClipboardList, color: "var(--neon-cyan)" },
  { label: "De esta semana", value: "8", delta: "5 listas", icon: CalendarIcon, color: "var(--neon-coral)" },
  { label: "Pendientes", value: "3", delta: "cierre viernes", icon: Circle, color: "var(--neon-amber)" },
  { label: "Proyectos en curso", value: "4", delta: "2 interdisciplinares", icon: Puzzle, color: "var(--neon-violet)" },
  { label: "Horas planeadas", value: "312 h", delta: "en 24 semanas", icon: Clock, color: "var(--neon-pink)" },
  { label: "Actividades creadas", value: "586", delta: "+42 este mes", icon: Zap, color: "var(--neon-lime)" },
];

const weeklyData = [
  { s: "S1", h: 12 }, { s: "S2", h: 14 }, { s: "S3", h: 11 }, { s: "S4", h: 15 },
  { s: "S5", h: 13 }, { s: "S6", h: 16 }, { s: "S7", h: 14 }, { s: "S8", h: 18 },
];
const metodologias = [
  { m: "ABP", n: 42 }, { m: "STEAM", n: 28 }, { m: "Servicio", n: 19 },
  { m: "Indagación", n: 33 }, { m: "Diálogo", n: 20 },
];

/* Últimas planeaciones y distribución de campos: derivadas del registro real. */
const ultimas = planeaciones.slice(0, 4);

function Dashboard({ onNew, onOpen }: { onNew: () => void; onOpen: (k: SectionKey) => void }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
        {kpi.map((k) => (
          <div key={k.label} className="glass rounded-2xl p-4 card-lift card-lift-hover">
            <div className="flex items-center justify-between">
              <div className="h-9 w-9 rounded-xl grid place-items-center" style={{ background: `color-mix(in oklch, ${k.color} 20%, transparent)` }}>
                <k.icon className="h-4 w-4" style={{ color: k.color }} />
              </div>
              <div className="text-[10px] text-ink-soft">{k.delta}</div>
            </div>
            <div className="font-serif text-[26px] text-ink mt-3 leading-none">{k.value}</div>
            <div className="text-[11px] text-ink-soft mt-1.5">{k.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 glass rounded-2xl p-5">
          <div className="flex items-baseline justify-between">
            <div>
              <div className="font-serif text-xl text-ink">Horas planeadas por semana</div>
              <div className="text-xs text-ink-soft mt-0.5">Últimas 8 semanas</div>
            </div>
            <div className="text-[11px] text-ink-soft">Promedio 14.1 h</div>
          </div>
          <div className="h-56 mt-4">
            <ResponsiveContainer>
              <AreaChart data={weeklyData}>
                <defs>
                  <linearGradient id="hg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.72 0.19 25)" stopOpacity={0.6} />
                    <stop offset="100%" stopColor="oklch(0.72 0.19 25)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="oklch(1 0 0 / 6%)" vertical={false} />
                <XAxis dataKey="s" stroke="oklch(1 0 0 / 40%)" fontSize={11} />
                <YAxis stroke="oklch(1 0 0 / 40%)" fontSize={11} />
                <Tooltip contentStyle={{ background: "oklch(0.2 0.02 265)", border: "1px solid oklch(1 0 0 / 10%)", borderRadius: 12 }} />
                <Area type="monotone" dataKey="h" stroke="oklch(0.72 0.19 25)" fill="url(#hg)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <CampoFormativoPanel />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="glass rounded-2xl p-5">
          <div className="font-serif text-xl text-ink">Metodologías utilizadas</div>
          <div className="text-xs text-ink-soft mt-0.5">Frecuencia por proyecto</div>
          <div className="h-48 mt-3">
            <ResponsiveContainer>
              <BarChart data={metodologias}>
                <CartesianGrid stroke="oklch(1 0 0 / 6%)" vertical={false} />
                <XAxis dataKey="m" stroke="oklch(1 0 0 / 40%)" fontSize={11} />
                <YAxis stroke="oklch(1 0 0 / 40%)" fontSize={11} />
                <Tooltip contentStyle={{ background: "oklch(0.2 0.02 265)", border: "1px solid oklch(1 0 0 / 10%)", borderRadius: 12 }} />
                <Bar dataKey="n" fill="oklch(0.78 0.15 200)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-2 glass rounded-2xl p-5">
          <div className="flex items-baseline justify-between">
            <div>
              <div className="font-serif text-xl text-ink">Últimas planeaciones</div>
              <div className="text-xs text-ink-soft mt-0.5">Acceso rápido</div>
            </div>
            <button onClick={() => onOpen("repositorio")} className="text-[11px] text-[var(--neon-cyan)] inline-flex items-center gap-1">
              Ver repositorio <ArrowRight className="h-3 w-3" />
            </button>
          </div>
          <div className="mt-4 space-y-2">
            {ultimas.map((p, i) => (
              <button
                key={i}
                onClick={() => onOpen("repositorio")}
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/[0.04] transition text-left group"
              >
                <div className="h-10 w-10 rounded-xl grid place-items-center shrink-0" style={{ background: `color-mix(in oklch, ${p.color} 22%, transparent)` }}>
                  <ClipboardList className="h-4 w-4" style={{ color: p.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-ink truncate">{p.titulo}</div>
                  <div className="text-[11px] text-ink-soft truncate">{p.campo} · {p.fecha}</div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full glass text-ink-soft">{p.estado}</span>
                <ChevronRight className="h-4 w-4 text-ink-soft opacity-0 group-hover:opacity-100 transition" />
              </button>
            ))}
          </div>
          <button
            onClick={onNew}
            className="btn-3d mt-4 w-full h-11 rounded-xl text-sm font-medium text-white inline-flex items-center justify-center gap-2"
            style={{ background: "var(--gradient-neon)", boxShadow: "var(--glow-coral)" }}
          >
            <Plus className="h-4 w-4" /> Crear nueva planeación
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------- Campo formativo mÃ¡s trabajado ---------- */
function CampoFormativoPanel() {
  const datos = distribucionCampos();
  const total = planeaciones.length;

  return (
    <div className="glass rounded-2xl p-5 flex flex-col">
      <div className="font-serif text-xl text-ink">Campo formativo más trabajado</div>
      <div className="text-xs text-ink-soft mt-0.5">
        {total > 0
          ? `Sobre ${total} planeaciones registradas del ciclo`
          : "Distribución del ciclo"}
      </div>

      {datos.length === 0 ? (
        <div className="flex-1 min-h-[190px] mt-4 rounded-xl border border-dashed border-white/10 grid place-items-center text-center px-4">
          <div>
            <div className="text-sm text-ink">Sin datos suficientes</div>
            <p className="text-[12px] text-ink-soft mt-1.5 max-w-[240px]">
              Aún no hay planeaciones registradas en el ciclo, por lo que no puede calcularse la
              distribución por campo formativo. Crea tu primera planeación para ver esta gráfica.
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className="h-52 mt-3">
            <ResponsiveContainer>
              <BarChart data={datos} layout="vertical" margin={{ left: 0, right: 34, top: 4, bottom: 4 }}>
                <CartesianGrid stroke="oklch(1 0 0 / 6%)" horizontal={false} />
                <XAxis type="number" domain={[0, 100]} unit="%" stroke="oklch(1 0 0 / 40%)" fontSize={10} />
                <YAxis type="category" dataKey="name" width={104} stroke="oklch(1 0 0 / 55%)" fontSize={10} tickFormatter={(v: string) => (v.length > 18 ? `${v.slice(0, 17)}…` : v)} />
                <Tooltip
                  cursor={{ fill: "oklch(1 0 0 / 4%)" }}
                  contentStyle={{ background: "oklch(0.2 0.02 265)", border: "1px solid oklch(1 0 0 / 10%)", borderRadius: 12 }}
                  formatter={(value: number, _n: string, item: { payload?: { count?: number } }) => [
                    `${value}% · ${item?.payload?.count ?? 0} planeaciones`,
                    "Participación",
                  ]}
                />
                <Bar dataKey="value" radius={[0, 8, 8, 0]} barSize={18} isAnimationActive>
                  {datos.map((d) => (
                    <Cell key={d.name} fill={d.color} />
                  ))}
                  <LabelList dataKey="value" position="right" formatter={(v: number) => `${v}%`} fill="oklch(1 0 0 / 75%)" fontSize={11} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-1 gap-1.5 text-[11px] mt-2">
            {datos.map((d) => (
              <div key={d.name} className="flex items-center gap-1.5 text-ink-soft">
                <span className="h-2 w-2 rounded-full shrink-0" style={{ background: d.color }} />
                <span className="truncate flex-1">{d.name}</span>
                <span className="text-ink">{d.value}%</span>
                <span className="text-ink-soft/70">({d.count})</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* ---------- Nueva Planeación ---------- */
const contextFields = [
  ["Ciclo escolar", "2025 – 2026"],
  ["Escuela", "Esc. Prim. Benito Juárez"],
  ["CCT", "21DPR1234K"],
  ["Zona escolar", "045"],
  ["Sector", "12"],
  ["Docente", "Docente (demo)"],
  ["Grado", "4°"],
  ["Grupo", "B"],
  ["Turno", "Matutino"],
  ["Fecha", "24 · Jul · 2026"],
  ["Semana", "24"],
  ["Periodo", "Segundo"],
];

const pedagogico = [
  { label: "Campo formativo", value: "Saberes y Pensamiento Científico" },
  { label: "Contenido", value: "Fracciones equivalentes y comparación" },
  { label: "PDA", value: "Compara fracciones usando representaciones concretas y gráficas." },
  { label: "Ejes articuladores", value: "Pensamiento crítico · Inclusión" },
  { label: "Proyecto", value: "La tienda de la comunidad" },
  { label: "Metodología", value: "Aprendizaje Basado en Problemas (ABP)" },
  { label: "Temporalidad", value: "1 semana" },
  { label: "Sesiones", value: "5 sesiones · 50 min" },
];

function NuevaPlaneacion({ onAskAI }: { onAskAI: () => void }) {
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);

  const generar = () => {
    setGenerating(true);
    setTimeout(() => { setGenerating(false); setGenerated(true); }, 1400);
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      <div className="xl:col-span-2 space-y-6">
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-8 w-8 rounded-lg grid place-items-center" style={{ background: "color-mix(in oklch, var(--neon-cyan) 22%, transparent)" }}>
              <FileText className="h-4 w-4 text-[var(--neon-cyan)]" />
            </div>
            <div>
              <div className="font-serif text-lg text-ink">Contexto administrativo</div>
              <div className="text-[11px] text-ink-soft">Se autocompleta con tus datos de perfil</div>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {contextFields.map(([label, val]) => (
              <div key={label} className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-3">
                <div className="text-[10px] uppercase tracking-[0.15em] text-ink-soft">{label}</div>
                <div className="text-sm text-ink mt-1 truncate">{val}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-8 w-8 rounded-lg grid place-items-center" style={{ background: "color-mix(in oklch, var(--neon-pink) 22%, transparent)" }}>
              <Target className="h-4 w-4 text-[var(--neon-pink)]" />
            </div>
            <div>
              <div className="font-serif text-lg text-ink">Estructura pedagógica</div>
              <div className="text-[11px] text-ink-soft">Alineada al Plan 2022 · Nueva Escuela Mexicana</div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {pedagogico.map((p) => (
              <div key={p.label} className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-3.5">
                <div className="text-[10px] uppercase tracking-[0.15em] text-ink-soft">{p.label}</div>
                <div className="text-sm text-ink mt-1">{p.value}</div>
              </div>
            ))}
          </div>
        </div>

        {generated && (
          <div className="glass rounded-2xl p-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-[var(--neon-coral)]" />
                <div className="font-serif text-lg text-ink">Planeación generada por IA</div>
              </div>
              <div className="flex gap-2">
                <button className="btn-3d h-9 px-3 rounded-lg glass border border-white/10 text-[12px] text-ink-soft inline-flex items-center gap-1.5">
                  <Wand2 className="h-3.5 w-3.5" /> Mejorar
                </button>
                <button className="btn-3d h-9 px-3 rounded-lg glass border border-white/10 text-[12px] text-ink-soft inline-flex items-center gap-1.5">
                  <Download className="h-3.5 w-3.5" /> Exportar
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                { t: "Inicio", d: "Presentación del problema: repartir pizzas en la tienda de la comunidad. Pregunta detonadora: ¿cuándo dos fracciones representan lo mismo?", c: "var(--neon-lime)" },
                { t: "Desarrollo", d: "Trabajo en equipos con tiras de fracciones. Comparación gráfica y numérica. Registro en cuaderno con evidencias.", c: "var(--neon-cyan)" },
                { t: "Cierre", d: "Puesta en común y elaboración de un cartel colectivo. Autoevaluación con lista de cotejo.", c: "var(--neon-pink)" },
              ].map((s) => (
                <div key={s.t} className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-4">
                  <div className="text-[10px] uppercase tracking-[0.15em]" style={{ color: s.c }}>{s.t}</div>
                  <div className="text-[13px] text-ink mt-1.5 leading-relaxed">{s.d}</div>
                </div>
              ))}
            </div>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 text-[13px]">
              {[
                ["Propósito", "Que los estudiantes comparen y ordenen fracciones a partir de situaciones reales."],
                ["Intención didáctica", "Movilizar el sentido numérico mediante representaciones múltiples."],
                ["Materiales", "Tiras de fracciones, tijeras, cartulinas, marcadores."],
                ["Organización", "Equipos heterogéneos de 4 integrantes."],
                ["Evaluación", "Lista de cotejo y rúbrica de 4 niveles."],
                ["Adecuaciones", "Material concreto para BAP, tiempo extendido, apoyo visual."],
              ].map(([t, d]) => (
                <div key={t} className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-3.5">
                  <div className="text-[10px] uppercase tracking-[0.15em] text-ink-soft">{t}</div>
                  <div className="text-ink mt-1">{d}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <aside className="space-y-4">
        <div className="glass-strong rounded-2xl p-5 glow-coral">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-4 w-4 text-[var(--neon-coral)]" />
            <div className="font-serif text-lg text-ink">Generador con IA</div>
          </div>
          <p className="text-[12px] text-ink-soft leading-relaxed">
            La IA generará inicio, desarrollo, cierre, propósito, intención didáctica, actividades, preguntas detonadoras, materiales, evaluación e inclusión.
          </p>
          <button
            onClick={generar}
            disabled={generating}
            className="btn-3d mt-4 w-full h-11 rounded-xl text-sm font-medium text-white inline-flex items-center justify-center gap-2 disabled:opacity-60"
            style={{ background: "var(--gradient-neon)", boxShadow: "var(--glow-coral)" }}
          >
            {generating ? (<><Sparkles className="h-4 w-4 animate-pulse" /> Generando…</>) : (<><Sparkles className="h-4 w-4" /> Crear planeación con IA</>)}
          </button>
          <button onClick={onAskAI} className="mt-2 w-full h-10 rounded-xl glass border border-white/10 text-[12px] text-ink-soft inline-flex items-center justify-center gap-1.5">
            <MessageSquare className="h-3.5 w-3.5" /> Conversar con IAsistente
          </button>
        </div>

        <div className="glass rounded-2xl p-5">
          <div className="font-serif text-base text-ink mb-3">Integración automática</div>
          <div className="space-y-2 text-[12px] text-ink-soft">
            {[
              ["Mi Aula", "var(--neon-cyan)"],
              ["Centro de Evaluación", "var(--neon-pink)"],
              ["Evidencias", "var(--neon-lime)"],
              ["Diario del docente", "var(--neon-amber)"],
              ["Calendario escolar", "var(--neon-violet)"],
              ["Repositorio digital", "var(--neon-coral)"],
            ].map(([t, c]) => (
              <div key={t} className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5" style={{ color: c }} />
                <span className="text-ink">{t}</span>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}

/* ---------- Banco de actividades ---------- */
const actividades = [
  { t: "Dominó de fracciones", grado: "4°", campo: "Saberes y P.C.", tiempo: "30 min", dif: "Media", fav: true },
  { t: "Diario del explorador", grado: "3° – 5°", campo: "Lenguajes", tiempo: "45 min", dif: "Baja", fav: false },
  { t: "Asamblea de aula", grado: "1° – 6°", campo: "Ética N. y S.", tiempo: "40 min", dif: "Baja", fav: true },
  { t: "Mapa de emociones", grado: "2°", campo: "De lo Humano", tiempo: "25 min", dif: "Baja", fav: false },
  { t: "Laboratorio de germinación", grado: "5°", campo: "Saberes y P.C.", tiempo: "60 min", dif: "Alta", fav: false },
  { t: "Radio escolar 5 min", grado: "6°", campo: "Lenguajes", tiempo: "50 min", dif: "Media", fav: true },
];

function BancoActividades() {
  return (
    <div className="space-y-5">
      <div className="glass rounded-2xl p-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft" />
          <input
            placeholder="Buscar actividad, contenido, PDA…"
            className="w-full h-11 pl-10 pr-4 rounded-xl bg-white/[0.04] border border-white/10 text-sm text-ink placeholder:text-ink-soft/60 focus:outline-none focus:border-primary/40"
          />
        </div>
        {["Grado", "Campo", "PDA", "Proyecto", "Metodología", "Tiempo", "Dificultad"].map((f) => (
          <button key={f} className="h-11 px-3 rounded-xl glass border border-white/10 text-[12px] text-ink-soft inline-flex items-center gap-1.5">
            <Filter className="h-3.5 w-3.5" /> {f}
          </button>
        ))}
        <button className="btn-3d h-11 px-4 rounded-xl text-sm text-white inline-flex items-center gap-1.5" style={{ background: "var(--gradient-neon)" }}>
          <Plus className="h-4 w-4" /> Añadir
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {actividades.map((a, i) => (
          <div key={i} className="glass rounded-2xl p-5 card-lift card-lift-hover">
            <div className="flex items-start justify-between">
              <div className="h-10 w-10 rounded-xl grid place-items-center" style={{ background: "color-mix(in oklch, var(--neon-cyan) 20%, transparent)" }}>
                <Lightbulb className="h-4 w-4 text-[var(--neon-cyan)]" />
              </div>
              <button><Star className={`h-4 w-4 ${a.fav ? "fill-[var(--neon-amber)] text-[var(--neon-amber)]" : "text-ink-soft"}`} /></button>
            </div>
            <div className="font-serif text-lg text-ink mt-3">{a.t}</div>
            <div className="text-[11px] text-ink-soft mt-1">{a.campo} · {a.grado}</div>
            <div className="mt-4 flex flex-wrap gap-1.5">
              <span className="text-[10px] px-2 py-1 rounded-full glass text-ink-soft inline-flex items-center gap-1"><Clock className="h-3 w-3" /> {a.tiempo}</span>
              <span className="text-[10px] px-2 py-1 rounded-full glass text-ink-soft">Dificultad {a.dif}</span>
            </div>
            <div className="mt-4 flex gap-2">
              <button className="btn-3d flex-1 h-9 rounded-lg glass border border-white/10 text-[12px] text-ink inline-flex items-center justify-center gap-1.5">
                <Plus className="h-3.5 w-3.5" /> Agregar
              </button>
              <button className="btn-3d h-9 w-9 rounded-lg glass border border-white/10 grid place-items-center">
                <Play className="h-3.5 w-3.5 text-ink-soft" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- Recursos ---------- */
const tiposRecurso = [
  { t: "PDF", icon: FileText, c: "var(--neon-coral)" },
  { t: "PowerPoint", icon: FileText, c: "var(--neon-amber)" },
  { t: "Videos", icon: Video, c: "var(--neon-pink)" },
  { t: "Audios", icon: Music, c: "var(--neon-violet)" },
  { t: "Imágenes", icon: ImageIcon, c: "var(--neon-cyan)" },
  { t: "Enlaces", icon: LinkIcon, c: "var(--neon-lime)" },
  { t: "Libros SEP", icon: BookOpen, c: "var(--neon-coral)" },
  { t: "Juegos", icon: Gamepad2, c: "var(--neon-pink)" },
];

function RecursosDidacticos() {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-3">
        {tiposRecurso.map((r) => (
          <button key={r.t} className="glass rounded-2xl p-4 card-lift card-lift-hover text-center">
            <div className="h-10 w-10 mx-auto rounded-xl grid place-items-center" style={{ background: `color-mix(in oklch, ${r.c} 22%, transparent)` }}>
              <r.icon className="h-4 w-4" style={{ color: r.c }} />
            </div>
            <div className="text-[13px] text-ink mt-2.5">{r.t}</div>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {[
          { t: "Libro SEP · Nuestros saberes 4°", tipo: "PDF · 128 pág", c: "var(--neon-coral)" },
          { t: "Video: fracciones en la cocina", tipo: "Video · 6:12", c: "var(--neon-pink)" },
          { t: "Cuadernillo — proyectos comunitarios", tipo: "PDF · 42 pág", c: "var(--neon-cyan)" },
          { t: "Presentación: valores en la escuela", tipo: "PPTX · 18 diapositivas", c: "var(--neon-amber)" },
          { t: "Podcast: leer para crecer", tipo: "Audio · 12:30", c: "var(--neon-violet)" },
          { t: "Juego: memorama de multiplicaciones", tipo: "Interactivo", c: "var(--neon-lime)" },
        ].map((r, i) => (
          <div key={i} className="glass rounded-2xl overflow-hidden card-lift card-lift-hover">
            <div className="h-28 relative" style={{ background: `linear-gradient(135deg, ${r.c}, oklch(0.25 0.02 265))` }}>
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <button className="absolute top-2 right-2 h-8 w-8 rounded-full grid place-items-center glass border border-white/20">
                <Play className="h-3.5 w-3.5 text-ink" />
              </button>
            </div>
            <div className="p-4">
              <div className="font-serif text-[15px] text-ink line-clamp-2">{r.t}</div>
              <div className="text-[11px] text-ink-soft mt-1">{r.tipo}</div>
              <div className="mt-3 flex gap-2">
                <button className="btn-3d flex-1 h-9 rounded-lg glass border border-white/10 text-[11px] text-ink">Vista previa</button>
                <button className="btn-3d h-9 w-9 rounded-lg glass border border-white/10 grid place-items-center"><Plus className="h-3.5 w-3.5 text-ink-soft" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- Secuencia didáctica (drag & drop visual) ---------- */
function SecuenciaDidactica({ onAskAI }: { onAskAI: () => void }) {
  const bloques = [
    { fase: "Inicio", tiempo: "10 min", c: "var(--neon-lime)", cards: ["Pregunta detonadora", "Recuperación de saberes previos"] },
    { fase: "Desarrollo", tiempo: "30 min", c: "var(--neon-cyan)", cards: ["Trabajo en equipos con material concreto", "Registro y comparación de resultados", "Puesta en común intermedia"] },
    { fase: "Cierre", tiempo: "10 min", c: "var(--neon-pink)", cards: ["Cartel colectivo", "Autoevaluación con lista de cotejo"] },
  ];
  return (
    <div className="space-y-5">
      <div className="glass rounded-2xl p-5 flex items-center justify-between">
        <div>
          <div className="font-serif text-xl text-ink">Constructor visual</div>
          <div className="text-xs text-ink-soft mt-0.5">Arrastra los bloques para reordenar tu secuencia</div>
        </div>
        <button onClick={onAskAI} className="btn-3d h-10 px-3 rounded-xl glass border border-white/10 text-[12px] text-ink inline-flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5 text-[var(--neon-coral)]" /> Sugerir con IA
        </button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {bloques.map((b) => (
          <div key={b.fase} className="glass rounded-2xl p-5">
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-2">
                <span className="h-2 w-2 rounded-full" style={{ background: b.c }} />
                <span className="font-serif text-lg text-ink">{b.fase}</span>
              </div>
              <span className="text-[10px] text-ink-soft">{b.tiempo}</span>
            </div>
            <div className="mt-4 space-y-2">
              {b.cards.map((c, i) => (
                <div key={i} className="rounded-xl bg-white/[0.04] border border-white/[0.08] p-3 flex items-center gap-2 group cursor-grab">
                  <GripVertical className="h-4 w-4 text-ink-soft/60" />
                  <span className="text-[13px] text-ink flex-1">{c}</span>
                  <button className="opacity-0 group-hover:opacity-100 text-ink-soft"><X className="h-3.5 w-3.5" /></button>
                </div>
              ))}
              <button className="w-full rounded-xl border border-dashed border-white/10 py-2.5 text-[12px] text-ink-soft hover:bg-white/[0.03] inline-flex items-center justify-center gap-1.5">
                <Plus className="h-3.5 w-3.5" /> Añadir tarjeta
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="glass rounded-2xl p-5">
        <div className="flex items-baseline justify-between mb-3">
          <div>
            <div className="font-serif text-lg text-ink">Línea del tiempo de la sesión</div>
            <div className="text-xs text-ink-soft">Progreso de ejecución en el aula</div>
          </div>
          <span className="text-[11px] text-ink-soft">68% cumplido</span>
        </div>
        <div className="h-3 rounded-full bg-white/[0.04] overflow-hidden">
          <div className="h-full rounded-full" style={{ width: "68%", background: "var(--gradient-neon)" }} />
        </div>
        <div className="mt-3 grid grid-cols-3 text-[11px] text-ink-soft">
          <span>Inicio ✓</span><span>Desarrollo · en curso</span><span className="text-right">Cierre</span>
        </div>
      </div>
    </div>
  );
}

/* ---------- Adecuaciones ---------- */
function Adecuaciones({ onAskAI }: { onAskAI: () => void }) {
  const bloques = [
    { t: "Barreras para el aprendizaje", d: "3 estudiantes requieren apoyo visual y tiempo extendido.", c: "var(--neon-coral)" },
    { t: "Ajustes razonables", d: "Instrucciones simplificadas, uso de pictogramas, tutoría entre pares.", c: "var(--neon-cyan)" },
    { t: "Adecuaciones curriculares", d: "Fracciones hasta medios y cuartos con material concreto para 1 estudiante.", c: "var(--neon-pink)" },
    { t: "Material adaptado", d: "Tarjetas de alto contraste, audio-lectura de instrucciones.", c: "var(--neon-amber)" },
    { t: "Apoyos específicos", d: "Acompañamiento de USAER en la sesión del miércoles.", c: "var(--neon-violet)" },
  ];
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
        {bloques.map((b) => (
          <div key={b.t} className="glass rounded-2xl p-5 card-lift card-lift-hover">
            <div className="h-10 w-10 rounded-xl grid place-items-center" style={{ background: `color-mix(in oklch, ${b.c} 22%, transparent)` }}>
              <Accessibility className="h-4 w-4" style={{ color: b.c }} />
            </div>
            <div className="font-serif text-lg text-ink mt-3">{b.t}</div>
            <p className="text-[13px] text-ink-soft mt-1.5 leading-relaxed">{b.d}</p>
          </div>
        ))}
      </div>
      <div className="glass-strong rounded-2xl p-5 glow-coral h-fit">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-[var(--neon-coral)]" />
          <div className="font-serif text-lg text-ink">Sugerencias IA</div>
        </div>
        <p className="text-[12px] text-ink-soft mt-2 leading-relaxed">
          La IA analizó tu grupo y propone adecuaciones para 5 estudiantes con BAP y 2 con aptitudes sobresalientes.
        </p>
        <button onClick={onAskAI} className="btn-3d mt-4 w-full h-10 rounded-xl text-sm font-medium text-white inline-flex items-center justify-center gap-2" style={{ background: "var(--gradient-neon)" }}>
          <Wand2 className="h-4 w-4" /> Generar adecuaciones
        </button>
      </div>
    </div>
  );
}

/* ---------- Calendario ---------- */
function Calendario() {
  const days = Array.from({ length: 35 }, (_, i) => i - 2);
  const eventos: Record<number, { t: string; c: string }[]> = {
    3: [{ t: "Fracciones", c: "var(--neon-cyan)" }],
    5: [{ t: "Asamblea", c: "var(--neon-pink)" }],
    9: [{ t: "Diario explorador", c: "var(--neon-coral)" }],
    12: [{ t: "Proyecto tienda", c: "var(--neon-violet)" }, { t: "Ed. Física", c: "var(--neon-lime)" }],
    15: [{ t: "Evaluación", c: "var(--neon-amber)" }],
    22: [{ t: "Cartel colectivo", c: "var(--neon-cyan)" }],
  };
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      <div className="lg:col-span-2 glass rounded-2xl p-5">
        <div className="flex items-baseline justify-between mb-4">
          <div>
            <div className="font-serif text-xl text-ink">Julio 2026</div>
            <div className="text-xs text-ink-soft mt-0.5">Vista mensual — arrastra planeaciones para reprogramar</div>
          </div>
          <div className="flex gap-1 glass rounded-lg p-1 text-[11px]">
            {["Día", "Semana", "Mes"].map((v, i) => (
              <button key={v} className={`px-3 h-7 rounded-md ${i === 2 ? "bg-white/10 text-ink" : "text-ink-soft"}`}>{v}</button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-7 gap-1 text-[10px] text-ink-soft mb-2">
          {["Lu", "Ma", "Mi", "Ju", "Vi", "Sa", "Do"].map((d) => <div key={d} className="text-center">{d}</div>)}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {days.map((d) => {
            const inMonth = d > 0 && d <= 31;
            const evs = eventos[d] ?? [];
            return (
              <div key={d} className={`aspect-square rounded-lg p-1.5 text-[10px] flex flex-col ${inMonth ? "bg-white/[0.03] border border-white/[0.05]" : "opacity-30"}`}>
                <div className={`text-ink-soft ${d === 24 ? "font-semibold text-[var(--neon-coral)]" : ""}`}>{inMonth ? d : ""}</div>
                <div className="mt-auto space-y-0.5">
                  {evs.slice(0, 2).map((e, i) => (
                    <div key={i} className="truncate rounded px-1 py-0.5 text-[9px] text-ink" style={{ background: `color-mix(in oklch, ${e.c} 25%, transparent)` }}>
                      {e.t}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="glass rounded-2xl p-5">
        <div className="font-serif text-lg text-ink">Semana en curso</div>
        <div className="text-xs text-ink-soft mt-0.5">Semana 24 · 5 planeaciones</div>
        <div className="mt-4 space-y-2">
          {[
            ["Lun", "Fracciones equivalentes", "var(--neon-cyan)"],
            ["Mar", "Diario del explorador", "var(--neon-coral)"],
            ["Mié", "Asamblea de aula", "var(--neon-pink)"],
            ["Jue", "Laboratorio de germinación", "var(--neon-lime)"],
            ["Vie", "Cierre proyecto — tienda", "var(--neon-violet)"],
          ].map(([d, t, c]) => (
            <div key={d} className="flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.05]">
              <div className="h-9 w-9 rounded-lg grid place-items-center" style={{ background: `color-mix(in oklch, ${c} 22%, transparent)` }}>
                <span className="text-[10px] font-medium" style={{ color: c }}>{d}</span>
              </div>
              <div className="text-[13px] text-ink flex-1">{t}</div>
              <button className="text-ink-soft"><ChevronRight className="h-4 w-4" /></button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------- Repositorio ---------- */
function Repositorio() {
  const [busqueda, setBusqueda] = useState("");
  const [compartir, setCompartir] = useState<PlaneacionRegistro | null>(null);

  const q = busqueda.trim().toLowerCase();
  const rows = q
    ? planeaciones.filter((p) =>
        [p.titulo, p.campo, p.proyecto, p.grado, p.semana].join(" ").toLowerCase().includes(q),
      )
    : planeaciones;

  const copiarEnlace = async (p: PlaneacionRegistro) => {
    const ok = await copiarAlPortapapeles(enlaceDePlaneacion(p));
    if (ok) toast.success("Enlace copiado al portapapeles");
    else toast.error("No se pudo copiar el enlace en este navegador.");
  };

  return (
    <div className="space-y-4">
      <div className="glass rounded-2xl p-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft" />
          <input
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            aria-label="Buscar planeación"
            placeholder="Buscar planeación por título, PDA, proyecto…"
            className="w-full h-11 pl-10 pr-4 rounded-xl bg-white/[0.04] border border-white/10 text-sm text-ink placeholder:text-ink-soft/60 focus:outline-none"
          />
        </div>
        {["Año", "Campo", "Proyecto", "Grado", "Semana", "Materia", "Etiquetas"].map((f) => (
          <button key={f} className="h-11 px-3 rounded-xl glass border border-white/10 text-[12px] text-ink-soft inline-flex items-center gap-1.5">
            <Filter className="h-3.5 w-3.5" /> {f}
          </button>
        ))}
      </div>

      <div className="glass rounded-2xl overflow-hidden">
        <div className="grid grid-cols-12 px-5 py-3 text-[10px] uppercase tracking-[0.15em] text-ink-soft border-b border-white/[0.06]">
          <div className="col-span-5">Planeación</div>
          <div className="col-span-2">Campo</div>
          <div className="col-span-2">Proyecto</div>
          <div className="col-span-1">Sem</div>
          <div className="col-span-1">Cumpl.</div>
          <div className="col-span-1 text-right">Acciones</div>
        </div>
        {rows.map((r, i) => (
          <div key={i} className="grid grid-cols-12 items-center px-5 py-3.5 border-b border-white/[0.04] hover:bg-white/[0.03] transition text-[13px]">
            <div className="col-span-5 flex items-center gap-3 min-w-0">
              <div className="h-8 w-8 rounded-lg grid place-items-center shrink-0" style={{ background: "color-mix(in oklch, var(--neon-cyan) 20%, transparent)" }}>
                <ClipboardList className="h-4 w-4 text-[var(--neon-cyan)]" />
              </div>
              <span className="text-ink truncate">{r.titulo}</span>
            </div>
            <div className="col-span-2 text-ink-soft truncate">{r.campo}</div>
            <div className="col-span-2 text-ink-soft truncate">{r.proyecto}</div>
            <div className="col-span-1 text-ink-soft">{r.semana}</div>
            <div className="col-span-1">
              <div className="flex items-center gap-1.5">
                <div className="h-1.5 flex-1 rounded-full bg-white/[0.06] overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${r.cumplimiento}%`, background: "var(--gradient-neon)" }} />
                </div>
                <span className="text-[10px] text-ink-soft">{r.cumplimiento}%</span>
              </div>
            </div>
            <div className="col-span-1 flex justify-end gap-1">
              <button
                onClick={() => copiarEnlace(r)}
                className="h-7 w-7 grid place-items-center rounded-md hover:bg-white/[0.06]"
                title="Copiar enlace"
                aria-label={`Copiar enlace de ${r.titulo}`}
              >
                <LinkIcon className="h-3.5 w-3.5 text-ink-soft" aria-hidden="true" />
              </button>
              <button
                onClick={() => setCompartir(r)}
                className="h-7 w-7 grid place-items-center rounded-md hover:bg-white/[0.06]"
                title="Compartir"
                aria-label={`Compartir ${r.titulo}`}
              >
                <Share2 className="h-3.5 w-3.5 text-ink-soft" aria-hidden="true" />
              </button>
            </div>
          </div>
        ))}
        {rows.length === 0 && (
          <div className="px-5 py-10 text-center text-[13px] text-ink-soft">
            Ninguna planeación coincide con “{busqueda}”.
          </div>
        )}
      </div>

      <div className="glass rounded-2xl p-4 flex flex-wrap items-center gap-2">
        <span className="text-[12px] text-ink-soft mr-2">Exportar selección:</span>
        {[
          [FileText, "PDF"], [FileText, "Word"], [FileText, "Excel"], [Printer, "Imprimir"], [Share2, "Correo"], [Share2, "WhatsApp"], [QrCode, "QR"],
        ].map(([Icon, label], i) => (
          <button key={i} className="btn-3d h-9 px-3 rounded-lg glass border border-white/10 text-[12px] text-ink inline-flex items-center gap-1.5">
            {/* @ts-expect-error dynamic icon */}
            <Icon className="h-3.5 w-3.5 text-ink-soft" /> {label}
          </button>
        ))}
      </div>

      <CompartirPlaneacion plan={compartir} onClose={() => setCompartir(null)} />
    </div>
  );
}

/* ---------- Estadísticas ---------- */
const radarData = [
  { m: "Lenguajes", v: 85 }, { m: "Saberes", v: 92 }, { m: "Ética", v: 74 },
  { m: "Humano", v: 68 }, { m: "Inclusión", v: 80 }, { m: "Evaluación", v: 88 },
];
const lineData = weeklyData.map((d) => ({ s: d.s, actual: d.h, meta: 14 }));

function Estadisticas() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      <div className="glass rounded-2xl p-5">
        <div className="font-serif text-lg text-ink">Equilibrio pedagógico</div>
        <div className="text-xs text-ink-soft mt-0.5">Cobertura por dimensión</div>
        <div className="h-64 mt-2">
          <ResponsiveContainer>
            <RadarChart data={radarData}>
              <PolarGrid stroke="oklch(1 0 0 / 8%)" />
              <PolarAngleAxis dataKey="m" stroke="oklch(1 0 0 / 60%)" fontSize={10} />
              <PolarRadiusAxis stroke="oklch(1 0 0 / 20%)" tick={false} />
              <Radar dataKey="v" stroke="oklch(0.72 0.19 25)" fill="oklch(0.72 0.19 25)" fillOpacity={0.35} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="lg:col-span-2 glass rounded-2xl p-5">
        <div className="font-serif text-lg text-ink">Horas planeadas vs meta</div>
        <div className="text-xs text-ink-soft mt-0.5">Meta semanal: 14 h</div>
        <div className="h-64 mt-3">
          <ResponsiveContainer>
            <LineChart data={lineData}>
              <CartesianGrid stroke="oklch(1 0 0 / 6%)" vertical={false} />
              <XAxis dataKey="s" stroke="oklch(1 0 0 / 40%)" fontSize={11} />
              <YAxis stroke="oklch(1 0 0 / 40%)" fontSize={11} />
              <Tooltip contentStyle={{ background: "oklch(0.2 0.02 265)", border: "1px solid oklch(1 0 0 / 10%)", borderRadius: 12 }} />
              <Line type="monotone" dataKey="actual" stroke="oklch(0.68 0.24 340)" strokeWidth={2.5} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="meta" stroke="oklch(0.78 0.15 200)" strokeDasharray="5 5" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { t: "Actividades favoritas", v: "48", i: Star, c: "var(--neon-amber)" },
          { t: "Evaluaciones realizadas", v: "36", i: CheckCircle2, c: "var(--neon-lime)" },
          { t: "Proyectos concluidos", v: "12", i: Trophy, c: "var(--neon-coral)" },
          { t: "Estrategias reutilizadas", v: "21", i: Repeat, c: "var(--neon-cyan)" },
        ].map((k) => (
          <div key={k.t} className="glass rounded-2xl p-5">
            <div className="h-10 w-10 rounded-xl grid place-items-center" style={{ background: `color-mix(in oklch, ${k.c} 22%, transparent)` }}>
              <k.i className="h-4 w-4" style={{ color: k.c }} />
            </div>
            <div className="font-serif text-2xl text-ink mt-3">{k.v}</div>
            <div className="text-[11px] text-ink-soft mt-1">{k.t}</div>
          </div>
        ))}
      </div>

      <div className="lg:col-span-3 glass rounded-2xl p-5">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-[var(--neon-cyan)]" />
          <div className="font-serif text-lg text-ink">Biblioteca personal de estrategias exitosas</div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
          {[
            ["Dominó de fracciones", "Aumentó 18% el logro en comparación numérica."],
            ["Asamblea semanal", "Redujo incidentes de convivencia en 42%."],
            ["Diario del explorador", "Elevó la producción escrita a 2 párrafos por sesión."],
          ].map(([t, d]) => (
            <div key={t} className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-4">
              <div className="text-[13px] text-ink font-medium">{t}</div>
              <div className="text-[12px] text-ink-soft mt-1 leading-relaxed">{d}</div>
              <button className="btn-3d mt-3 h-8 px-3 rounded-lg glass border border-white/10 text-[11px] text-ink inline-flex items-center gap-1.5">
                <Repeat className="h-3 w-3" /> Reutilizar
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
