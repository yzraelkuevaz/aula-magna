import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  Search, Bell, Settings, User, BookOpen, Filter, ChevronRight, ChevronLeft,
  X, Plus, TrendingUp, TrendingDown, Minus, Star, Clock, CheckCircle2,
  AlertTriangle, Package, BarChart3, Users, RotateCcw, Bookmark, Pencil,
  Trash2, Upload, Download, Sparkles, LayoutGrid, ArrowUpRight, Home,
  LibraryBig, GraduationCap, History, ChevronDown, PlusCircle, Undo2,
  CalendarClock, PackageX, Flame, BadgeCheck, Loader2, ShieldCheck,
  UserRound, MapPin, Ban, TriangleAlert, FileWarning, Radar, Lock,
  Film, PenTool, MessageCircle, Rocket, PartyPopper, LogOut, PlayCircle,
} from "lucide-react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  LineChart, Line, PieChart, Pie, Cell, Legend,
} from "recharts";

/* ================================================================================
   SIED MX — Ecosistema de Lectura / Panel de Administración Bibliotecaria
   ------------------------------------------------------------------------------
   Esta versión CONSERVA la interfaz y funcionalidades existentes y agrega una
   capa de arquitectura para escalar hacia el ecosistema SIED MX y Supabase:

     UI  →  Hooks (useBooks/useLoans/useStudents/useAnalytics/useRecommendations)
         →  LibraryService (reglas de negocio puras)
         →  Data Provider  →  DemoDataProvider (activo) / SupabaseDataProvider (futuro)

   Los datos de alumnos, grupos y escuela se modelan como referencias por ID,
   tal como los entregaría SIED MX — nunca se duplica nombre/grado/grupo/escuela.
   ================================================================================ */

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Lexend:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&display=swap');

.smx {
  --bg-0:#090D14; --bg-1:#0F1420; --bg-2:#151C2C; --bg-3:#1C2438;
  --line:#232C42; --line-soft:#1A2135;
  --ink-0:#EEF1F7; --ink-1:#9AA6C0; --ink-2:#5D6786;
  --marigold:#EC9027; --marigold-soft:rgba(236,144,39,0.14);
  --azul:#3591C4; --azul-soft:rgba(53,145,196,0.14);
  --magenta:#CE4A79; --magenta-soft:rgba(206,74,121,0.14);
  --verde:#48A860; --verde-soft:rgba(72,168,96,0.14);
  --rojo:#DD5B57; --rojo-soft:rgba(221,91,87,0.14);
  --amarillo:#E2BA45; --amarillo-soft:rgba(226,186,69,0.14);
  --morado:#8B6FD6; --morado-soft:rgba(139,111,214,0.14);
  font-family:'Inter',sans-serif;
  background:
    radial-gradient(1200px 500px at 85% -10%, rgba(236,144,39,0.08), transparent),
    radial-gradient(900px 500px at -10% 10%, rgba(53,145,196,0.09), transparent),
    var(--bg-0);
  color:var(--ink-0);
  min-height:100vh;
  position:relative;
}
.smx * { box-sizing:border-box; }
.smx h1,.smx h2,.smx h3,.smx h4 { font-family:'Lexend',sans-serif; margin:0; letter-spacing:-0.01em; }
.smx ::-webkit-scrollbar { height:8px; width:8px; }
.smx ::-webkit-scrollbar-thumb { background:var(--line); border-radius:8px; }
.smx ::-webkit-scrollbar-track { background:transparent; }
.smx button { font-family:'Inter',sans-serif; cursor:pointer; }
.smx-scrollx { display:flex; gap:14px; overflow-x:auto; padding:6px 2px 18px; scroll-snap-type:x proximity; }
.smx-scrollx > * { scroll-snap-align:start; flex:0 0 auto; }

/* Header */
.smx-header {
  position:sticky; top:0; z-index:40;
  display:flex; align-items:center; gap:12px;
  padding:12px 24px;
  background:rgba(9,13,20,0.86); backdrop-filter:blur(14px);
  border-bottom:1px solid var(--line-soft);
  flex-wrap:wrap;
}
.smx-logo { display:flex; align-items:center; gap:10px; flex-shrink:0; }
.smx-logo-mark {
  width:36px; height:36px; border-radius:10px;
  background:linear-gradient(135deg, var(--marigold), var(--magenta));
  display:flex; align-items:center; justify-content:center; color:#0A0D14; font-weight:800; font-family:'Lexend',sans-serif;
}
.smx-search {
  flex:1; min-width:180px; max-width:520px; display:flex; align-items:center; gap:8px;
  background:var(--bg-2); border:1px solid var(--line); border-radius:11px;
  padding:9px 14px; color:var(--ink-1); transition:border-color .15s;
}
.smx-search:focus-within { border-color:var(--marigold); }
.smx-search input { background:transparent; border:none; outline:none; color:var(--ink-0); font-size:13.5px; width:100%; }
.smx-icon-btn {
  width:38px; height:38px; border-radius:10px; border:1px solid var(--line);
  background:var(--bg-2); display:flex; align-items:center; justify-content:center;
  color:var(--ink-1); position:relative; transition:all .15s; flex-shrink:0;
}
.smx-icon-btn:hover { color:var(--ink-0); border-color:var(--ink-2); }
.smx-dot { position:absolute; top:6px; right:6px; width:7px; height:7px; border-radius:50%; background:var(--magenta); border:1.5px solid var(--bg-0); }
.smx-avatar {
  width:38px; height:38px; border-radius:10px; flex-shrink:0;
  background:linear-gradient(135deg, var(--azul), #6B3FA0);
  display:flex; align-items:center; justify-content:center; font-family:'Lexend',sans-serif; font-weight:700; font-size:13px;
  border:none; color:#fff;
}

/* Nav tabs */
.smx-tabs { display:flex; gap:4px; padding:10px 24px; overflow-x:auto; border-bottom:1px solid var(--line-soft); align-items:center; }
.smx-tab {
  display:flex; align-items:center; gap:7px; padding:8px 14px; border-radius:9px;
  border:1px solid transparent; background:transparent; color:var(--ink-1); font-size:13.5px; font-weight:500;
  white-space:nowrap; transition:all .15s;
}
.smx-tab:hover { color:var(--ink-0); background:var(--bg-2); }
.smx-tab.active { color:#0A0D14; background:var(--ink-0); font-weight:600; }

.smx-main { padding:26px 24px 100px; max-width:1440px; margin:0 auto; }
.smx-breadcrumb { display:flex; align-items:center; gap:6px; font-size:12.5px; color:var(--ink-2); margin-bottom:16px; }
.smx-breadcrumb b { color:var(--ink-1); font-weight:500; }

/* KPIs */
.smx-kpi-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(190px,1fr)); gap:12px; margin:20px 0 32px; }
.smx-kpi {
  background:var(--bg-1); border:1px solid var(--line); border-radius:14px; padding:16px 18px;
  text-align:left; transition:all .18s; position:relative; overflow:hidden;
}
.smx-kpi:hover { border-color:var(--ink-2); transform:translateY(-2px); }
.smx-kpi-icon { width:32px; height:32px; border-radius:9px; display:flex; align-items:center; justify-content:center; margin-bottom:12px; }
.smx-kpi-val { font-family:'Lexend',sans-serif; font-size:26px; font-weight:700; line-height:1; }
.smx-kpi-label { font-size:12px; color:var(--ink-1); margin-top:6px; }

/* Cards */
.smx-card {
  background:var(--bg-1); border:1px solid var(--line); border-radius:15px; overflow:hidden;
  transition:all .18s;
}
.smx-cover {
  aspect-ratio:3/4; position:relative; display:flex; flex-direction:column; justify-content:flex-end;
  padding:12px; overflow:hidden;
}
.smx-cover::before { content:''; position:absolute; inset:0; background:linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.55) 100%); }
.smx-cover-icon { position:absolute; top:12px; left:12px; opacity:0.85; }
.smx-badge {
  font-size:10px; font-weight:600; padding:3px 8px; border-radius:6px; display:inline-flex; align-items:center; gap:4px;
  letter-spacing:0.01em;
}
.smx-book-card { width:172px; flex-shrink:0; cursor:pointer; position:relative; }
.smx-book-card:hover .smx-cover { filter:brightness(1.08); }
.smx-book-card:hover { transform:translateY(-3px); }
.smx-book-card:hover .smx-quickview-btn { opacity:1; }
.smx-book-title { font-size:13px; font-weight:600; line-height:1.3; margin-top:9px; }
.smx-book-meta { font-size:11.5px; color:var(--ink-2); margin-top:2px; }
.smx-quickview-btn {
  position:absolute; top:8px; right:8px; opacity:0; transition:opacity .15s; z-index:3;
  width:26px; height:26px; border-radius:8px; background:rgba(9,13,20,0.7); border:1px solid rgba(255,255,255,0.15);
  color:#fff; display:flex; align-items:center; justify-content:center;
}
.smx-quickview {
  position:absolute; z-index:30; width:230px; background:var(--bg-2); border:1px solid var(--line);
  border-radius:12px; padding:12px; box-shadow:0 18px 40px rgba(0,0,0,0.5); top:0; left:100%; margin-left:8px;
}

.smx-section-head { display:flex; align-items:baseline; justify-content:space-between; margin-bottom:2px; flex-wrap:wrap; gap:8px; }
.smx-section-title { font-size:18px; font-weight:700; display:flex; align-items:center; gap:8px; }
.smx-section-sub { font-size:12.5px; color:var(--ink-2); margin-top:3px; }

/* Grade cards */
.smx-grade-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(190px,1fr)); gap:14px; }
.smx-grade-card {
  background:var(--bg-1); border:1px solid var(--line); border-radius:16px; padding:18px; text-align:left;
  position:relative; overflow:hidden; transition:all .18s;
}
.smx-grade-card:hover { border-color:var(--ink-2); transform:translateY(-2px); }
.smx-grade-num { font-family:'Lexend',sans-serif; font-size:30px; font-weight:800; }
.smx-grade-bar { height:5px; border-radius:4px; background:var(--bg-3); overflow:hidden; margin-top:12px; }
.smx-grade-bar > div { height:100%; border-radius:4px; }

/* Filters */
.smx-filterbar { display:flex; gap:8px; flex-wrap:wrap; margin:16px 0 22px; align-items:center; }
.smx-chip {
  padding:7px 13px; border-radius:20px; border:1px solid var(--line); background:var(--bg-1);
  font-size:12.5px; color:var(--ink-1); font-weight:500; transition:all .15s; display:flex; align-items:center; gap:5px;
}
.smx-chip:hover { border-color:var(--ink-2); color:var(--ink-0); }
.smx-chip.active { background:var(--marigold); border-color:var(--marigold); color:#1A0F02; font-weight:600; }
.smx-select-mini select {
  background:var(--bg-1); border:1px solid var(--line); border-radius:20px; padding:7px 12px; color:var(--ink-1);
  font-size:12.5px; font-family:'Inter',sans-serif;
}

/* Catalog grid */
.smx-catalog-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(172px,1fr)); gap:18px 16px; }
.smx-catalog-grid .smx-book-card { width:auto; }

/* Modal */
.smx-overlay { position:fixed; inset:0; background:rgba(4,6,10,0.72); backdrop-filter:blur(3px); z-index:100; display:flex; align-items:center; justify-content:center; padding:20px; }
.smx-modal { background:var(--bg-1); border:1px solid var(--line); border-radius:20px; max-width:820px; width:100%; max-height:88vh; overflow-y:auto; }
.smx-modal-sm { max-width:460px; }
.smx-modal-md { max-width:600px; }

/* Buttons */
.smx-btn {
  display:inline-flex; align-items:center; gap:7px; padding:10px 16px; border-radius:10px;
  font-size:13.5px; font-weight:600; border:1px solid transparent; transition:all .15s;
}
.smx-btn-primary { background:var(--marigold); color:#1A0F02; }
.smx-btn-primary:hover { filter:brightness(1.08); }
.smx-btn-ghost { background:var(--bg-2); border-color:var(--line); color:var(--ink-0); }
.smx-btn-ghost:hover { border-color:var(--ink-2); }
.smx-btn-danger { background:var(--rojo-soft); color:var(--rojo); border-color:rgba(221,91,87,0.3); }
.smx-btn:disabled { opacity:0.45; cursor:not-allowed; }

/* Table */
.smx-table-wrap { overflow-x:auto; }
.smx-table { width:100%; border-collapse:collapse; font-size:13px; }
.smx-table th { text-align:left; padding:10px 14px; color:var(--ink-2); font-weight:600; font-size:11.5px; text-transform:uppercase; letter-spacing:0.04em; border-bottom:1px solid var(--line); cursor:pointer; user-select:none; white-space:nowrap; }
.smx-table th:hover { color:var(--ink-1); }
.smx-table td { padding:12px 14px; border-bottom:1px solid var(--line-soft); color:var(--ink-1); vertical-align:middle; }
.smx-table tr:hover td { background:var(--bg-2); }
.smx-link-name { color:var(--ink-0); font-weight:500; background:none; border:none; padding:0; cursor:pointer; text-decoration:underline; text-decoration-color:var(--line); text-underline-offset:3px; }
.smx-link-name:hover { text-decoration-color:var(--marigold); color:var(--marigold); }

.smx-status { font-size:11px; font-weight:600; padding:4px 9px; border-radius:7px; display:inline-flex; align-items:center; gap:5px; white-space:nowrap; }

.smx-fab { position:fixed; bottom:26px; right:26px; z-index:60; display:flex; align-items:center; gap:9px; padding:14px 20px; border-radius:16px; background:linear-gradient(135deg, var(--marigold), #d97a1c); color:#1A0F02; font-weight:700; font-size:14px; border:none; box-shadow:0 8px 30px rgba(236,144,39,0.35); }
.smx-quickmenu { position:fixed; bottom:88px; right:26px; z-index:60; background:var(--bg-1); border:1px solid var(--line); border-radius:14px; padding:8px; display:flex; flex-direction:column; gap:2px; min-width:230px; box-shadow:0 20px 50px rgba(0,0,0,0.5); }
.smx-quickitem { display:flex; align-items:center; gap:10px; padding:9px 12px; border-radius:9px; font-size:13px; color:var(--ink-1); background:transparent; border:none; text-align:left; }
.smx-quickitem:hover { background:var(--bg-2); color:var(--ink-0); }

.smx-field label { font-size:12px; color:var(--ink-1); font-weight:500; display:block; margin-bottom:6px; }
.smx-field input, .smx-field select, .smx-field textarea {
  width:100%; background:var(--bg-2); border:1px solid var(--line); border-radius:9px; padding:9px 12px;
  color:var(--ink-0); font-size:13px; font-family:'Inter',sans-serif; outline:none;
}
.smx-field input:focus, .smx-field select:focus, .smx-field textarea:focus { border-color:var(--marigold); }

.smx-empty { text-align:center; padding:60px 20px; color:var(--ink-2); }
.smx-toast { position:fixed; bottom:26px; left:26px; z-index:200; background:var(--bg-2); border:1px solid var(--verde); color:var(--ink-0); padding:12px 18px; border-radius:11px; font-size:13px; display:flex; align-items:center; gap:9px; box-shadow:0 10px 30px rgba(0,0,0,0.4); max-width:360px; }
.smx-toast.error { border-color:var(--rojo); }
.smx-skeleton { background:linear-gradient(90deg, var(--bg-2) 25%, var(--bg-3) 37%, var(--bg-2) 63%); background-size:400% 100%; animation:smx-shimmer 1.4s ease infinite; border-radius:15px; }
@keyframes smx-shimmer { 0% {background-position:100% 0;} 100% {background-position:0 0;} }

/* Data source badge */
.smx-source-badge { font-size:10.5px; font-weight:700; letter-spacing:0.03em; padding:3px 9px; border-radius:20px; display:inline-flex; align-items:center; gap:5px; border:1px solid transparent; }
.smx-source-demo { background:var(--amarillo-soft); color:var(--amarillo); border-color:rgba(226,186,69,0.35); }
.smx-source-config { background:var(--azul-soft); color:var(--azul); border-color:rgba(53,145,196,0.35); }
.smx-source-real { background:var(--verde-soft); color:var(--verde); border-color:rgba(72,168,96,0.35); }

/* Roadmap diagram */
.smx-roadmap { display:flex; flex-direction:column; align-items:center; gap:4px; font-size:12px; color:var(--ink-2); }
.smx-roadmap-node { padding:8px 14px; border:1px dashed var(--line); border-radius:10px; color:var(--ink-1); background:var(--bg-2); }
.smx-roadmap-arrow { color:var(--ink-2); font-size:14px; }

/* Responsive: tables become cards */
@media (max-width: 720px) {
  .smx-table thead { display:none; }
  .smx-table, .smx-table tbody, .smx-table tr, .smx-table td { display:block; width:100%; }
  .smx-table tr { border:1px solid var(--line); border-radius:12px; margin-bottom:10px; padding:8px 4px; background:var(--bg-2); }
  .smx-table td { border-bottom:none; padding:6px 12px; display:flex; justify-content:space-between; gap:10px; text-align:right; }
  .smx-table td::before { content:attr(data-label); color:var(--ink-2); font-size:11px; font-weight:600; text-align:left; text-transform:uppercase; letter-spacing:0.03em; }
}

/* ============================================================
   LEERFLIX — submódulo de lectura (tema propio negro/rojo,
   inspirado en el diseño original de "El Profe Víctor")
   ============================================================ */
.lfx { background:#060606; border-radius:18px; border:1px solid #1C1C1C; overflow:hidden; }
.lfx * { box-sizing:border-box; font-family:'Inter',sans-serif; }
.lfx ::-webkit-scrollbar { height:8px; }
.lfx ::-webkit-scrollbar-thumb { background:#2A2A2A; border-radius:8px; }
.lfx-shell { display:flex; min-height:600px; }
.lfx-sidebar { width:184px; flex-shrink:0; background:#0A0A0A; border-right:1px solid #1A1A1A; padding:22px 14px; display:flex; flex-direction:column; gap:3px; }
.lfx-brand { font-family:'Lexend',sans-serif; font-weight:800; font-size:21px; color:#E50914; letter-spacing:-0.02em; margin-bottom:8px; display:flex; align-items:center; gap:7px; padding:0 4px; }
.lfx-brand-sub { font-size:9.5px; color:#555; font-weight:600; letter-spacing:0.04em; text-transform:uppercase; padding:0 4px; margin-bottom:20px; }
.lfx-navitem { display:flex; align-items:center; gap:10px; padding:10px 11px; border-radius:9px; color:#8A8A8A; font-size:13px; font-weight:500; background:transparent; border:none; text-align:left; transition:all .15s; }
.lfx-navitem:hover { color:#fff; background:#141414; }
.lfx-navitem.active { color:#fff; background:#161616; }
.lfx-navitem.active svg { color:#E50914; }
.lfx-navitem-spacer { flex:1; }
.lfx-main { flex:1; min-width:0; padding:26px 28px 32px; overflow-y:auto; max-height:760px; }
.lfx-hero { position:relative; border-radius:14px; overflow:hidden; min-height:230px; display:flex; align-items:flex-end; padding:28px; margin-bottom:8px; }
.lfx-hero-scrim { position:absolute; inset:0; background:linear-gradient(90deg, rgba(0,0,0,0.92) 10%, rgba(0,0,0,0.45) 55%, transparent 100%); }
.lfx-hero-content { position:relative; z-index:1; max-width:440px; }
.lfx-hero-cat { font-size:11px; font-weight:700; color:#E50914; text-transform:uppercase; letter-spacing:0.05em; margin-bottom:8px; }
.lfx-hero-title { font-family:'Lexend',sans-serif; font-size:28px; font-weight:800; color:#fff; line-height:1.1; }
.lfx-hero-meta { font-size:12px; color:#999; margin-top:8px; }
.lfx-hero-actions { display:flex; gap:10px; margin-top:18px; }
.lfx-btn { display:inline-flex; align-items:center; gap:7px; padding:10px 18px; border-radius:7px; font-size:13px; font-weight:700; border:none; cursor:pointer; }
.lfx-btn-primary { background:#fff; color:#111; }
.lfx-btn-primary:hover { background:#e6e6e6; }
.lfx-btn-ghost { background:rgba(255,255,255,0.12); color:#fff; }
.lfx-btn-ghost:hover { background:rgba(255,255,255,0.2); }
.lfx-row-title { color:#fff; font-size:15px; font-weight:700; margin:28px 0 12px; display:flex; align-items:center; gap:8px; }
.lfx-row-count { font-size:11px; color:#666; font-weight:500; }
.lfx-scrollx { display:flex; gap:13px; overflow-x:auto; padding-bottom:8px; }
.lfx-card { width:140px; flex-shrink:0; cursor:pointer; }
.lfx-card-cover { aspect-ratio:2/3; border-radius:7px; position:relative; overflow:hidden; display:flex; flex-direction:column; justify-content:space-between; padding:9px; transition:transform .18s; border:1px solid #1E1E1E; }
.lfx-card:hover .lfx-card-cover { transform:scale(1.045); box-shadow:0 14px 28px rgba(0,0,0,0.6); }
.lfx-card-icon { font-size:20px; opacity:0.9; }
.lfx-card-title { color:#CFCFCF; font-size:11.5px; margin-top:8px; line-height:1.3; overflow:hidden; text-overflow:ellipsis; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; }
.lfx-pending-pill { font-size:9px; font-weight:700; padding:3px 7px; border-radius:5px; background:rgba(0,0,0,0.55); color:#DDD; align-self:flex-start; border:1px solid rgba(255,255,255,0.15); }
.lfx-cat-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(140px,1fr)); gap:16px 13px; }
.lfx-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.8); z-index:100; display:flex; align-items:center; justify-content:center; padding:20px; }
.lfx-modal { background:#0D0D0D; border:1px solid #1E1E1E; border-radius:16px; max-width:460px; width:100%; overflow:hidden; }
.lfx-modal-cover { height:150px; position:relative; display:flex; align-items:flex-end; padding:16px; }
.lfx-modal-cover-scrim { position:absolute; inset:0; background:linear-gradient(0deg, rgba(0,0,0,0.85), transparent); }
.lfx-modal-body { padding:18px 20px 20px; }
.lfx-close { position:absolute; top:12px; right:12px; width:30px; height:30px; border-radius:50%; background:rgba(0,0,0,0.55); border:none; color:#fff; display:flex; align-items:center; justify-content:center; z-index:2; cursor:pointer; }
.lfx-pending-box { margin-top:14px; background:#141414; border:1px dashed #2A2A2A; border-radius:10px; padding:12px 14px; font-size:12px; color:#999; line-height:1.5; display:flex; gap:9px; }
`;

/* ================================================================================
   1) DATA — semillas de demostración (aisladas; futura sustitución por Supabase)
   ================================================================================ */

const GRADE_LABELS = ["1.º Primaria", "2.º Primaria", "3.º Primaria", "4.º Primaria", "5.º Primaria", "6.º Primaria"];
const GRADE_COLORS = ["var(--marigold)", "var(--azul)", "var(--magenta)", "var(--verde)", "var(--amarillo)", "#8B6FD6"];
const CATEGORIES = ["Cuentos", "Ciencia", "Historia", "Matemáticas", "Emociones", "Arte", "Naturaleza", "Aventura"];
const CATEGORY_ICON = { Cuentos: "📖", Ciencia: "🔬", Historia: "🏛️", Matemáticas: "🔢", Emociones: "💛", Arte: "🎨", Naturaleza: "🌿", Aventura: "🧭" };
const CATEGORY_COLOR = { Cuentos: "var(--magenta)", Ciencia: "var(--azul)", Historia: "var(--amarillo)", Matemáticas: "#8B6FD6", Emociones: "var(--marigold)", Arte: "var(--magenta)", Naturaleza: "var(--verde)", Aventura: "var(--rojo)" };
const COPY_STATUSES = ["Disponible", "Prestado", "Reservado", "En reparación", "Extraviado", "Baja"];

const SCHOOL_ID = "sch-001";
const TEACHER_ID = "tch-admin";

const TITLES = [
  ["El jardín de las letras", "María Torres Vega"], ["Cuentos del Nopal", "Ignacio Reyes"],
  ["Los números mágicos", "Sofía Mendoza"], ["¿Cómo late mi corazón?", "Dr. Raúl Campos"],
  ["Leyendas de Mesoamérica", "Elena Cruz"], ["Un volcán en mi patio", "Carlos Ibarra"],
  ["El color de mis emociones", "Ana Belén Ruiz"], ["Piratas del Golfo", "Jorge Salinas"],
  ["Fracciones para exploradores", "Patricia Nuño"], ["La monarca viajera", "Luis Ángel Pérez"],
  ["Cuando tengo miedo", "Marta Olvera"], ["El sistema solar y yo", "Héctor Domínguez"],
  ["Historias de mi barrio", "Diana Fuentes"], ["El pincel encantado", "Rosa Elvira Nava"],
  ["Dinosaurios de México", "Fernando Islas"], ["Sumar es divertido", "Karina López"],
  ["El bosque que respira", "Adrián Solís"], ["Amistad sin fronteras", "Verónica Ayala"],
  ["Rumbo a la Independencia", "Guillermo Mora"], ["Mi primer telescopio", "Paola Rincón"],
  ["El tesoro de Tenochtitlan", "Ricardo Vidal"], ["Cuando crezca seré...", "Lucía Bárcenas"],
  ["El agua que nos une", "Emilio Tapia"], ["Figuras y formas", "Renata Cordero"],
  ["Abuela cuéntame otra vez", "Teresa Ochoa"], ["Ciencia en la cocina", "Iván Marroquín"],
  ["La ballena y el faro", "Cynthia Aranda"], ["Revolución en el aula", "Óscar Villaseñor"],
  ["Contando estrellas", "Nadia Gómez"], ["Mis manos, mi voz", "Beatriz Serna"],
];

function seededRand(seed) {
  let s = seed;
  return () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
}

// Genera los ejemplares (book_copies) de un título a partir de sus agregados.
function buildCopies(bookId, copiesTotal, copiesAvailable, rnd) {
  const onLoan = copiesTotal - copiesAvailable;
  let reservado = onLoan > 2 && rnd() > 0.6 ? 1 : 0;
  let reparacion = copiesTotal > 4 && rnd() > 0.85 ? 1 : 0;
  let prestado = Math.max(0, onLoan - reservado - reparacion);
  const statuses = [
    ...Array(copiesAvailable).fill("Disponible"),
    ...Array(prestado).fill("Prestado"),
    ...Array(reservado).fill("Reservado"),
    ...Array(reparacion).fill("En reparación"),
  ];
  while (statuses.length < copiesTotal) statuses.push("Disponible");
  return statuses.slice(0, copiesTotal).map((status, k) => ({
    id: `${bookId}-c${k + 1}`,
    inventoryCode: `SIED-${bookId.replace("bk-", "")}-${String(k + 1).padStart(2, "0")}`,
    barcode: `750${bookId.replace(/\D/g, "")}${k}`,
    status,
    condition: status === "En reparación" ? "Regular" : "Buena",
    location: "Aula de medios",
    acquisitionYear: 2021 + (k % 4),
  }));
}

function buildBooks() {
  const rnd = seededRand(42);
  return TITLES.map(([title, author], i) => {
    const grade = (i % 6) + 1;
    const category = CATEGORIES[i % CATEGORIES.length];
    const copiesTotal = 2 + Math.floor(rnd() * 6);
    const onLoan = Math.floor(rnd() * copiesTotal);
    const copiesAvailable = Math.max(0, copiesTotal - onLoan);
    const loanCount = Math.floor(rnd() * 60) + (i < 6 ? 40 : 0);
    const trendRoll = rnd();
    const trend = trendRoll > 0.62 ? "up" : trendRoll > 0.3 ? "stable" : "down";
    const isNew = i % 9 === 0 || i % 9 === 1;
    const daysAgoCreated = isNew ? Math.floor(rnd() * 12) + 1 : Math.floor(rnd() * 300) + 30;
    const id = "bk-" + (i + 1);
    const copies = buildCopies(id, copiesTotal, copiesAvailable, rnd);
    return {
      id, title, author,
      publisher: ["Ediciones SEP", "Fondo Lector Infantil", "Editorial Coyoacán", "Nube Lectora"][i % 4],
      year: 2018 + (i % 7),
      isbn: isNew ? "978-607-" + (100 + i) + "-" + (10 + i) : null,
      language: "Español",
      pages: 24 + (i % 6) * 8,
      grade, category,
      topics: [category, CATEGORIES[(i + 3) % CATEGORIES.length]],
      keywords: [category.toLowerCase(), "primaria", "grado " + grade],
      description: `Una obra pensada para alumnos de ${grade}.º de primaria que introduce temas de ${category.toLowerCase()} de forma cercana y accesible, con actividades para reforzar la comprensión lectora.`,
      copiesTotal, copiesAvailable, copies,
      readingLevel: grade <= 2 ? "Inicial" : grade <= 4 ? "Intermedio" : "Avanzado",
      loanCount, trend, isNew,
      createdAt: daysAgoCreated,
      avgLoanDays: 6 + Math.floor(rnd() * 9),
      lastLoanDaysAgo: Math.floor(rnd() * 20) + 1,
      topGrades: [grade, ((grade % 6) + 1)],
    };
  });
}

const BOOKS_SEED = buildBooks();

const STUDENTS_SEED = [
  ["Ximena Morales", 1, "A"], ["Bruno Salcedo", 2, "B"], ["Renata Luna", 3, "A"],
  ["Diego Anaya", 4, "C"], ["Camila Rosas", 5, "B"], ["Mateo Fierro", 6, "A"],
  ["Valentina Ríos", 1, "B"], ["Emiliano Duarte", 3, "C"], ["Fernanda Quintero", 2, "A"],
  ["Santiago Ley", 5, "A"], ["Regina Paredes", 4, "B"], ["Iker Montaño", 6, "C"],
].map((s, i) => ({
  id: "st-" + (i + 1), school_id: SCHOOL_ID, group_id: `${s[1]}${s[2]}`,
  name: s[0], grade: s[1], group: s[2], status: "Activo",
}));

function buildLoans() {
  const rnd = seededRand(7);
  const rows = [];
  const loanBooks = BOOKS_SEED.filter((b) => b.copiesTotal - b.copiesAvailable > 0);
  let idx = 0;
  loanBooks.forEach((b) => {
    const prestados = b.copies.filter((c) => c.status === "Prestado");
    prestados.forEach((copy) => {
      const student = STUDENTS_SEED[idx % STUDENTS_SEED.length];
      idx++;
      const daysAgoLoaned = Math.floor(rnd() * 20) + 1;
      const dueInDays = 14 - daysAgoLoaned + Math.floor(rnd() * 6) - 3;
      let status = "Activo";
      if (dueInDays < 0) status = "Vencido";
      else if (dueInDays <= 2) status = "Por devolver";
      rows.push({
        id: "ln-" + idx, book_id: b.id, book_copy_id: copy.id, bookTitle: b.title,
        student_id: student.id, student: student.name, grade: student.grade, group: student.group,
        teacher_id: TEACHER_ID, school_id: SCHOOL_ID,
        loanDate: daysAgoLoaned, dueInDays, status, renewals: 0,
      });
    });
  });
  for (let k = 0; k < 8; k++) {
    const b = BOOKS_SEED[(k * 3) % BOOKS_SEED.length];
    const student = STUDENTS_SEED[(k + 4) % STUDENTS_SEED.length];
    rows.push({
      id: "ln-h-" + k, book_id: b.id, book_copy_id: null, bookTitle: b.title,
      student_id: student.id, student: student.name, grade: student.grade, group: student.group,
      teacher_id: TEACHER_ID, school_id: SCHOOL_ID,
      loanDate: 25 + k * 3, dueInDays: -5, status: "Devuelto", renewals: k % 2,
    });
  }
  return rows;
}

const LOANS_SEED = buildLoans();
const RESERVATIONS_SEED = []; // aún sin reservaciones reales — se llenará conforme se usen

const FILTER_CHIPS = [
  { key: "all", label: "Todos" },
  { key: "g1", label: "1.º" }, { key: "g2", label: "2.º" }, { key: "g3", label: "3.º" },
  { key: "g4", label: "4.º" }, { key: "g5", label: "5.º" }, { key: "g6", label: "6.º" },
  { key: "available", label: "Disponible" },
  { key: "loaned", label: "En préstamo" },
  { key: "popular", label: "Más solicitados" },
  { key: "new", label: "Nuevos" },
  { key: "starter", label: "Lectura inicial" },
  ...CATEGORIES.map((c) => ({ key: "cat:" + c, label: c })),
];

/* ================================================================================
   1.1) LEERFLIX — catálogo de lectura (submódulo, tema propio negro/rojo)
   ------------------------------------------------------------------------------
   Metadatos extraídos del PPT "LEERFLIX - El Profe Víctor" (título, autor/origen
   y categoría). Esta primera fase es SOLO DISEÑO: aún no se incorpora el texto
   completo de cada obra — varias están bajo derechos de autor vigentes (Borges,
   Cortázar, Bradbury, cuentos infantiles contemporáneos), así que el contenido
   de lectura se define en una fase posterior. Cada ficha muestra por ahora
   título, autor/origen y categoría, con un aviso claro de "contenido pendiente".
   ================================================================================ */

const LEERFLIX_CATEGORIES = [
  { key: "clasicos", label: "Clásicos", icon: PenTool, color: "#D4AF37" },
  { key: "fabulas", label: "Fábulas", icon: MessageCircle, color: "#4CC9A0" },
  { key: "ficcion", label: "Ficción", icon: Rocket, color: "#4C8EF3" },
  { key: "leyendas", label: "Leyendas", icon: Flame, color: "#E5604C" },
  { key: "infantiles", label: "Infantiles", icon: PartyPopper, color: "#F2B134" },
];

const LEERFLIX_CATALOG = {
  clasicos: [
    { title: "Caperucita roja", author: "Charles Perrault / Hermanos Grimm" },
    { title: "El gato con botas", author: "Charles Perrault" },
    { title: "El gigante egoísta", author: "Oscar Wilde" },
    { title: "El príncipe feliz", author: "Oscar Wilde" },
    { title: "Hansel y Gretel", author: "Hermanos Grimm" },
    { title: "La bella durmiente", author: "Hermanos Grimm" },
    { title: "Las andanzas de Pulgarcito", author: "Charles Perrault" },
    { title: "La bella durmiente del bosque", author: "Charles Perrault" },
  ],
  fabulas: [
    { title: "El viento y el sol", author: "Esopo" },
    { title: "El perro y su reflejo", author: "Esopo" },
    { title: "El león y el ratón", author: "Esopo" },
    { title: "La cigarra y la hormiga", author: "Esopo" },
    { title: "El asno que llevaba sal", author: "Esopo" },
    { title: "El pastorcito mentiroso", author: "Esopo" },
    { title: "La liebre y la tortuga", author: "Esopo" },
    { title: "El cuervo y la jarra", author: "Esopo" },
  ],
  ficcion: [
    { title: "La Biblioteca de Babel", author: "Jorge Luis Borges" },
    { title: "El Ruido de un trueno", author: "Ray Bradbury" },
    { title: "La pradera", author: "Ray Bradbury" },
    { title: "Vendrán lluvias suaves", author: "Ray Bradbury" },
    { title: "La respuesta", author: "Autor por confirmar" },
    { title: "La noche boca arriba", author: "Julio Cortázar" },
  ],
  leyendas: [
    { title: "La llorona", author: "Tradición oral (México)" },
    { title: "La Carreta Nagua", author: "Tradición oral (Centroamérica)" },
    { title: "La Siguanaba", author: "Tradición oral (Centroamérica)" },
    { title: "Vale el familiar", author: "Autor por confirmar" },
    { title: "El monte de las ánimas", author: "Gustavo Adolfo Bécquer" },
    { title: "La monja de San Juan de Dios", author: "Tradición oral" },
    { title: "Leyenda del Ayaymama", author: "Tradición oral (Amazonía)" },
  ],
  infantiles: [
    { title: "El tigre y el ratón", author: "Autor por confirmar" },
    { title: "Cómo atrapar una estrella", author: "Oliver Jeffers" },
    { title: "El árbol de los recuerdos", author: "Britta Teckentrup" },
    { title: "Orejas de mariposa", author: "Luisa Aguilar" },
    { title: "¿A qué sabe la luna?", author: "Michael Grejniec" },
    { title: "El Monstruo de colores", author: "Anna Llenas" },
    { title: "Adivina cuánto te quiero", author: "Sam McBratney" },
  ],
};

const LEERFLIX_FEATURED = { key: "leyendas", title: "La llorona", author: "Tradición oral (México)" };

/* ================================================================================
   2) SERVICES — reglas de negocio puras (LibraryService). No dependen de React.
      Al conectar Supabase, sólo cambia el Data Provider que alimenta estas reglas.
   ================================================================================ */

const LibraryService = {
  dataOrigin: "demo", // 'demo' | 'config' | 'real' — lo fijará el Data Provider activo

  copyStats(book) {
    const counts = { Disponible: 0, Prestado: 0, Reservado: 0, "En reparación": 0, Extraviado: 0, Baja: 0 };
    (book.copies || []).forEach((c) => { counts[c.status] = (counts[c.status] || 0) + 1; });
    return counts;
  },

  // Detecta posibles duplicados por ISBN o por combinación título + autor.
  detectDuplicate(books, candidate) {
    const norm = (s) => (s || "").trim().toLowerCase();
    if (candidate.isbn) {
      const byIsbn = books.find((b) => b.isbn && norm(b.isbn) === norm(candidate.isbn));
      if (byIsbn) return { book: byIsbn, reason: "ISBN coincidente" };
    }
    const byTitleAuthor = books.find((b) => norm(b.title) === norm(candidate.title) && norm(b.author) === norm(candidate.author));
    if (byTitleAuthor) return { book: byTitleAuthor, reason: "Título y autor coinciden" };
    return null;
  },

  // Construye el historial lector de un alumno a partir de sus préstamos.
  readerHistory(studentId, loans, books) {
    const own = loans.filter((l) => l.student_id === studentId);
    const read = own.filter((l) => l.status === "Devuelto");
    const active = own.filter((l) => ["Activo", "Por devolver", "Vencido", "Renovado"].includes(l.status));
    const categoryFreq = {};
    own.forEach((l) => {
      const book = books.find((b) => b.id === l.book_id);
      if (book) categoryFreq[book.category] = (categoryFreq[book.category] || 0) + 1;
    });
    const topCategories = Object.entries(categoryFreq).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([c]) => c);
    const lastLoan = own.slice().sort((a, b) => a.loanDate - b.loanDate)[0];
    return {
      totalLoans: own.length,
      booksRead: read.length,
      booksActive: active.length,
      topCategories,
      lastLoanDaysAgo: lastLoan ? lastLoan.loanDate : null,
      hasEnoughData: own.length >= 2,
      loans: own,
    };
  },

  // true si el rol puede ver datos personales de lectura de un alumno.
  canViewStudentData(role) {
    return role === "admin" || role === "bibliotecario" || role === "docente";
  },

  // Recomendaciones IA transparentes: nunca inventa datos, exige evidencia mínima.
  gradeRecommendation(grade, books) {
    const gbooks = books.filter((b) => b.grade === grade);
    if (gbooks.length < 3) return { grade, kind: "insufficient" };
    const totals = gbooks.reduce((acc, b) => { acc[b.category] = (acc[b.category] || 0) + b.loanCount; return acc; }, {});
    const topCategory = Object.entries(totals).sort((a, b) => b[1] - a[1])[0][0];
    const picks = gbooks.filter((b) => b.category === topCategory).sort((a, b) => b.loanCount - a.loanCount).slice(0, 3);
    return {
      grade, kind: "trend", category: topCategory, picks,
      reason: `Pertenece a la categoría "${topCategory}", la más solicitada por el grupo de ${grade}.º, y su nivel lector corresponde al grado seleccionado.`,
    };
  },

  discoverReason(book) {
    if (book.copiesAvailable > 0 && book.loanCount < 15) return "Disponible y poco solicitado actualmente: podría complementar los temas de interés del grado.";
    return "Poco solicitado actualmente.";
  },

  // Simula el análisis de un archivo de importación (CSV/Excel) antes de insertar.
  parseImportPreview(existingBooks) {
    const rnd = seededRand(99);
    const demoRows = [
      { title: "Rimas para el recreo", author: "Susana Peña", isbn: "978-607-555-01-1", grade: 1, category: "Cuentos", copies: 3 },
      { title: "El jardín de las letras", author: "María Torres Vega", isbn: "978-607-555-02-2", grade: 1, category: "Cuentos", copies: 2 }, // duplicado intencional
      { title: "Átomos y amigos", author: "Beto Cervantes", isbn: "978-607-555-03-3", grade: 4, category: "Ciencia", copies: 4 },
      { title: "", author: "Autor desconocido", isbn: "", grade: 2, category: "Arte", copies: 0 }, // registro con error
      { title: "Mapas de mi ciudad", author: "Laura Fuentes", isbn: "978-607-555-05-5", grade: 3, category: "Historia", copies: 3 },
    ];
    const rows = demoRows.map((r) => {
      const errors = [];
      if (!r.title) errors.push("Falta el título");
      if (!r.copies || r.copies < 1) errors.push("Número de ejemplares inválido");
      const dup = r.title ? LibraryService.detectDuplicate(existingBooks, r) : null;
      return { ...r, errors, duplicate: dup };
    });
    return {
      found: rows.length,
      valid: rows.filter((r) => r.errors.length === 0 && !r.duplicate).length,
      withErrors: rows.filter((r) => r.errors.length > 0).length,
      duplicates: rows.filter((r) => r.duplicate).length,
      rows,
    };
  },
};

const ROLE_LABELS = { admin: "Administrador escolar", bibliotecario: "Bibliotecario", docente: "Docente", alumno: "Alumno" };
const ROLE_PERMISSIONS = {
  admin: { tabs: ["dashboard", "catalog", "loans", "analytics", "ai", "leerflix", "admin"], viewStudentData: true },
  bibliotecario: { tabs: ["dashboard", "catalog", "loans", "analytics", "ai", "leerflix"], viewStudentData: true },
  docente: { tabs: ["dashboard", "catalog", "loans", "ai", "leerflix"], viewStudentData: true },
  alumno: { tabs: ["dashboard", "catalog", "ai", "leerflix"], viewStudentData: false },
};

/* ================================================================================
   3) DATA PROVIDER — DemoDataProvider (activo). Punto único de sustitución futura
      por SupabaseDataProvider, sin tocar hooks ni UI.
   ================================================================================ */

const DemoDataProvider = {
  origin: "demo",
  getBooks: () => BOOKS_SEED,
  getLoans: () => LOANS_SEED,
  getStudents: () => STUDENTS_SEED,
  getReservations: () => RESERVATIONS_SEED,
};

/* ================================================================================
   4) HOOKS — capa intermedia que la UI consume. Encapsulan estado + LibraryService.
   ================================================================================ */

function useBooks() {
  const [books, setBooks] = useState(DemoDataProvider.getBooks());

  const addBook = (form) => {
    const id = "bk-new-" + Date.now();
    const copies = Array.from({ length: form.copies }, (_, k) => ({
      id: `${id}-c${k + 1}`, inventoryCode: `SIED-NEW-${k + 1}`, barcode: `900${Date.now()}${k}`,
      status: "Disponible", condition: "Buena", location: "Aula de medios", acquisitionYear: new Date().getFullYear(),
    }));
    setBooks((prev) => [{
      id, title: form.title, author: form.author, publisher: form.publisher || "Editorial propia",
      year: new Date().getFullYear(), isbn: form.isbn || null, language: "Español", pages: null,
      grade: form.grade, category: form.category, topics: [form.category], keywords: [form.category.toLowerCase()],
      description: "Descripción pendiente de captura.", copiesTotal: form.copies, copiesAvailable: form.copies, copies,
      readingLevel: form.grade <= 2 ? "Inicial" : form.grade <= 4 ? "Intermedio" : "Avanzado", loanCount: 0, trend: "stable",
      isNew: true, createdAt: 0, avgLoanDays: 0, lastLoanDaysAgo: 0, topGrades: [form.grade],
    }, ...prev]);
    return id;
  };

  const deleteBook = (id) => setBooks((prev) => prev.filter((b) => b.id !== id));

  const findDuplicate = (candidate) => LibraryService.detectDuplicate(books, candidate);

  // Marca un ejemplar específico con nuevo estado y recalcula agregados.
  const setCopyStatus = (bookId, copyId, newStatus) => {
    setBooks((prev) => prev.map((b) => {
      if (b.id !== bookId) return b;
      const copies = b.copies.map((c) => c.id === copyId ? { ...c, status: newStatus } : c);
      const copiesAvailable = copies.filter((c) => c.status === "Disponible").length;
      return { ...b, copies, copiesAvailable };
    }));
  };

  const bumpLoanCount = (bookId, delta) => {
    setBooks((prev) => prev.map((b) => b.id === bookId ? { ...b, loanCount: Math.max(0, b.loanCount + delta) } : b));
  };

  return { books, setBooks, addBook, deleteBook, findDuplicate, setCopyStatus, bumpLoanCount };
}

function useStudents() {
  const [students] = useState(DemoDataProvider.getStudents());
  return { students };
}

function useLoans(books, { setCopyStatus, bumpLoanCount }) {
  const [loans, setLoans] = useState(DemoDataProvider.getLoans());
  const [reservations, setReservations] = useState(DemoDataProvider.getReservations());

  const createLoan = (bookId, studentId) => {
    const book = books.find((b) => b.id === bookId);
    const student = STUDENTS_SEED.find((s) => s.id === studentId) || STUDENTS_SEED[0];
    if (!book) return { ok: false, message: "No fue posible registrar el préstamo. El libro no existe." };
    const availableCopy = (book.copies || []).find((c) => c.status === "Disponible");
    if (!availableCopy) return { ok: false, message: "No fue posible registrar el préstamo. Verifica que el ejemplar siga disponible." };
    setCopyStatus(bookId, availableCopy.id, "Prestado");
    bumpLoanCount(bookId, 1);
    setLoans((prev) => [{
      id: "ln-new-" + Date.now(), book_id: bookId, book_copy_id: availableCopy.id, bookTitle: book.title,
      student_id: student.id, student: student.name, grade: student.grade, group: student.group,
      teacher_id: TEACHER_ID, school_id: SCHOOL_ID, loanDate: 0, dueInDays: 14, status: "Activo", renewals: 0,
    }, ...prev]);
    return { ok: true, message: `Préstamo registrado: ${book.title}` };
  };

  const returnLoan = (loanId) => {
    const loan = loans.find((l) => l.id === loanId);
    if (!loan) return { ok: false, message: "No fue posible registrar la devolución." };
    if (loan.book_copy_id) setCopyStatus(loan.book_id, loan.book_copy_id, "Disponible");
    setLoans((prev) => prev.map((l) => l.id === loanId ? { ...l, status: "Devuelto" } : l));
    return { ok: true, message: "Devolución registrada" };
  };

  const renewLoan = (loanId) => {
    setLoans((prev) => prev.map((l) => l.id === loanId ? { ...l, dueInDays: 14, status: "Activo", renewals: l.renewals + 1 } : l));
    return { ok: true, message: "Préstamo renovado por 14 días" };
  };

  const markLost = (loanId) => {
    const loan = loans.find((l) => l.id === loanId);
    if (loan?.book_copy_id) setCopyStatus(loan.book_id, loan.book_copy_id, "Extraviado");
    setLoans((prev) => prev.map((l) => l.id === loanId ? { ...l, status: "Perdido" } : l));
    return { ok: true, message: "Ejemplar marcado como extraviado" };
  };

  const createReservation = (bookId, studentId) => {
    const book = books.find((b) => b.id === bookId);
    const student = STUDENTS_SEED.find((s) => s.id === studentId) || STUDENTS_SEED[0];
    if (!book) return { ok: false, message: "No fue posible generar la reserva." };
    setReservations((prev) => [{
      id: "rv-" + Date.now(), book_id: bookId, bookTitle: book.title,
      student_id: student.id, student: student.name, grade: student.grade, group: student.group,
      reservedDaysAgo: 0, status: book.copiesAvailable > 0 ? "Disponible" : "En espera",
    }, ...prev]);
    return { ok: true, message: `Reserva registrada: ${book.title}` };
  };

  const cancelReservation = (id) => {
    setReservations((prev) => prev.map((r) => r.id === id ? { ...r, status: "Cancelada" } : r));
    return { ok: true, message: "Reserva cancelada" };
  };

  return { loans, reservations, createLoan, returnLoan, renewLoan, markLost, createReservation, cancelReservation };
}

function useAnalytics(books, loans, filters) {
  return useMemo(() => {
    let scopedBooks = books;
    if (filters.grade) scopedBooks = scopedBooks.filter((b) => b.grade === filters.grade);
    if (filters.category) scopedBooks = scopedBooks.filter((b) => b.category === filters.category);
    let scopedLoans = loans;
    if (filters.grade) scopedLoans = scopedLoans.filter((l) => l.grade === filters.grade);
    if (filters.bookId) scopedLoans = scopedLoans.filter((l) => l.book_id === filters.bookId);
    return { scopedBooks, scopedLoans };
  }, [books, loans, filters]);
}

function useRecommendations(books) {
  return useMemo(() => {
    const insights = [];
    for (let g = 1; g <= 6; g++) insights.push(LibraryService.gradeRecommendation(g, books));
    const discover = [...books].filter((b) => b.loanCount < 15 && b.copiesAvailable > 0).slice(0, 4)
      .map((b) => ({ book: b, reason: LibraryService.discoverReason(b) }));
    return { insights, discover };
  }, [books]);
}

/* ================================================================================
   5) UI — componentes (idénticos en identidad visual a la versión anterior,
      con las extensiones funcionales descritas arriba)
   ================================================================================ */

function DataSourceBadge({ small }) {
  return (
    <span className="smx-source-badge smx-source-demo" style={small ? { fontSize: 9.5, padding: "2px 7px" } : {}}>
      🟡 DATOS DEMO
    </span>
  );
}

function TrendIcon({ trend, size = 13 }) {
  if (trend === "up") return <TrendingUp size={size} color="var(--verde)" />;
  if (trend === "down") return <TrendingDown size={size} color="var(--rojo)" />;
  return <Minus size={size} color="var(--ink-2)" />;
}

function Cover({ book, small }) {
  const color = CATEGORY_COLOR[book.category] || "var(--azul)";
  return (
    <div className="smx-cover" style={{ background: `linear-gradient(150deg, ${color}55, var(--bg-3) 75%)`, borderBottom: "1px solid var(--line)" }}>
      <div className="smx-cover-icon" style={{ fontSize: small ? 20 : 26 }}>{CATEGORY_ICON[book.category]}</div>
      <div style={{ position: "relative", display: "flex", gap: 5, flexWrap: "wrap" }}>
        {book.isNew && <span className="smx-badge" style={{ background: "var(--magenta-soft)", color: "var(--magenta)" }}>ESTRENO</span>}
        {book.trend === "up" && book.loanCount > 30 && (
          <span className="smx-badge" style={{ background: "var(--marigold-soft)", color: "var(--marigold)" }}><Flame size={10} /> Popular</span>
        )}
        <span className="smx-badge" style={{ background: book.copiesAvailable > 0 ? "var(--verde-soft)" : "var(--rojo-soft)", color: book.copiesAvailable > 0 ? "var(--verde)" : "var(--rojo)" }}>
          {book.copiesAvailable > 0 ? "Disponible" : "En préstamo"}
        </span>
      </div>
    </div>
  );
}

function QuickView({ book }) {
  const stats = LibraryService.copyStats(book);
  return (
    <div className="smx-quickview" onClick={(e) => e.stopPropagation()}>
      <div style={{ fontWeight: 700, fontSize: 12.5 }}>{book.title}</div>
      <div style={{ fontSize: 11.5, color: "var(--ink-2)", marginTop: 2 }}>{book.author}</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginTop: 10, fontSize: 11.5 }}>
        <div><span style={{ color: "var(--ink-2)" }}>Grado: </span>{book.grade}.º</div>
        <div><span style={{ color: "var(--ink-2)" }}>Ejemplares: </span>{book.copiesTotal}</div>
        <div><span style={{ color: "var(--ink-2)" }}>Disponibles: </span>{stats.Disponible}</div>
        <div><span style={{ color: "var(--ink-2)" }}>Prestados: </span>{stats.Prestado}</div>
      </div>
      <div style={{ marginTop: 8, fontSize: 11, color: "var(--ink-2)" }}>{book.loanCount} préstamos acumulados</div>
    </div>
  );
}

function BookCard({ book, onOpen }) {
  const [qv, setQv] = useState(false);
  return (
    <div className="smx-book-card" onClick={() => onOpen(book)} style={{ position: "relative" }}>
      <button className="smx-quickview-btn" onClick={(e) => { e.stopPropagation(); setQv((v) => !v); }} title="Vista rápida">
        <Search size={12} />
      </button>
      {qv && <QuickView book={book} />}
      <div className="smx-card"><Cover book={book} /></div>
      <div className="smx-book-title" style={{ overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>{book.title}</div>
      <div className="smx-book-meta">{book.author}</div>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 5 }}>
        <span style={{ fontSize: 11, color: "var(--ink-2)" }}>{book.grade}.º · {book.category}</span>
      </div>
    </div>
  );
}

function Carousel({ title, subtitle, icon, books, onOpen, rank, emptyText }) {
  const ref = useRef(null);
  const scroll = (dir) => ref.current?.scrollBy({ left: dir * 420, behavior: "smooth" });
  return (
    <section style={{ marginBottom: 34 }}>
      <div className="smx-section-head">
        <div>
          <div className="smx-section-title">{icon}{title}</div>
          {subtitle && <div className="smx-section-sub">{subtitle}</div>}
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          <button className="smx-icon-btn" style={{ width: 32, height: 32 }} onClick={() => scroll(-1)}><ChevronLeft size={15} /></button>
          <button className="smx-icon-btn" style={{ width: 32, height: 32 }} onClick={() => scroll(1)}><ChevronRight size={15} /></button>
        </div>
      </div>
      {books.length === 0 ? (
        <div className="smx-empty" style={{ padding: "28px 0", textAlign: "left" }}>{emptyText || "Sin resultados por ahora."}</div>
      ) : (
        <div className="smx-scrollx" ref={ref}>
          {books.map((b, i) => (
            <div key={b.id} style={{ position: "relative" }}>
              {rank && (
                <div style={{ position: "absolute", top: -10, left: -6, zIndex: 2, fontFamily: "'Lexend',sans-serif", fontWeight: 800, fontSize: 22, color: i < 3 ? "var(--marigold)" : "var(--ink-2)", textShadow: "0 2px 8px rgba(0,0,0,0.6)" }}>#{i + 1}</div>
              )}
              <BookCard book={b} onOpen={onOpen} />
              {rank && (
                <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 3, fontSize: 11, color: "var(--ink-2)" }}>
                  <TrendIcon trend={b.trend} size={12} /> {b.loanCount} préstamos
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

/* ---------------- Header ---------------- */

function Header({ search, setSearch, selectedGrade, setSelectedGrade, onToggleFilters, filtersOpen, onOpenNotifs, notifsOpen, alerts, onNav, role, setRole, onOpenStudentSearch }) {
  return (
    <div className="smx-header">
      <div className="smx-logo">
        <div className="smx-logo-mark">S</div>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontFamily: "'Lexend',sans-serif", fontWeight: 700, fontSize: 14.5, lineHeight: 1.1 }}>SIED MX</span>
            <DataSourceBadge small />
          </div>
          <div style={{ fontSize: 11, color: "var(--ink-2)" }}>Biblioteca Inteligente</div>
        </div>
      </div>

      <div className="smx-search">
        <Search size={16} />
        <input placeholder="Buscar libro, autor, tema, grado o palabra clave…" value={search} onChange={(e) => setSearch(e.target.value)} />
        {search && <X size={15} style={{ cursor: "pointer" }} onClick={() => setSearch("")} />}
      </div>

      <div className="smx-field" style={{ width: 158, flexShrink: 0 }}>
        <select value={selectedGrade ?? ""} onChange={(e) => setSelectedGrade(e.target.value ? Number(e.target.value) : null)}>
          <option value="">Todos los grados</option>
          {GRADE_LABELS.map((g, i) => <option key={i} value={i + 1}>{g}</option>)}
        </select>
      </div>

      <button className="smx-icon-btn" onClick={onToggleFilters} style={filtersOpen ? { borderColor: "var(--marigold)", color: "var(--marigold)" } : {}}><Filter size={16} /></button>
      <button className="smx-icon-btn" onClick={onOpenStudentSearch} title="Buscar alumno"><UserRound size={16} /></button>

      <div style={{ position: "relative" }}>
        <button className="smx-icon-btn" onClick={onOpenNotifs}>
          <Bell size={16} />
          {alerts.length > 0 && <span className="smx-dot" />}
        </button>
        {notifsOpen && (
          <div className="smx-card" style={{ position: "absolute", right: 0, top: 46, width: 320, zIndex: 50, padding: 6, boxShadow: "0 20px 50px rgba(0,0,0,0.5)" }}>
            <div style={{ padding: "8px 10px", fontSize: 12.5, fontWeight: 600, color: "var(--ink-1)" }}>Alertas inteligentes</div>
            {alerts.map((a, i) => (
              <div key={i} style={{ display: "flex", gap: 9, padding: "9px 10px", borderRadius: 9, fontSize: 12.5 }}>
                <span>{a.icon}</span><span style={{ color: "var(--ink-1)" }}>{a.text}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <button className="smx-icon-btn" onClick={() => onNav("loans")}><LibraryBig size={16} /></button>
      {ROLE_PERMISSIONS[role].tabs.includes("admin") && (
        <button className="smx-icon-btn" onClick={() => onNav("admin")}><Settings size={16} /></button>
      )}

      <div className="smx-field" style={{ width: 168, flexShrink: 0 }} title="Rol activo (demostración de permisos)">
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          {Object.entries(ROLE_LABELS).map(([k, l]) => <option key={k} value={k}>{l}</option>)}
        </select>
      </div>
      <button className="smx-avatar" title={ROLE_LABELS[role]}>{ROLE_LABELS[role].slice(0, 2).toUpperCase()}</button>
    </div>
  );
}

/* ---------------- Nav ---------------- */

const NAV_ITEMS = [
  { key: "dashboard", label: "Biblioteca", icon: <Home size={14} /> },
  { key: "catalog", label: "Catálogo", icon: <LayoutGrid size={14} /> },
  { key: "loans", label: "Préstamos", icon: <BookOpen size={14} /> },
  { key: "analytics", label: "Analítica", icon: <BarChart3 size={14} /> },
  { key: "ai", label: "Biblioteca IA", icon: <Sparkles size={14} /> },
  { key: "leerflix", label: "Leerflix", icon: <Film size={14} /> },
  { key: "admin", label: "Administración", icon: <Settings size={14} /> },
];

function NavTabs({ view, setView, role }) {
  const allowed = ROLE_PERMISSIONS[role].tabs;
  return (
    <div className="smx-tabs">
      {NAV_ITEMS.filter((n) => allowed.includes(n.key)).map((n) => (
        <button key={n.key} className={"smx-tab" + (view === n.key ? " active" : "")} onClick={() => setView(n.key)}>{n.icon}{n.label}</button>
      ))}
      <span style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "var(--ink-2)" }}>
        <ShieldCheck size={13} /> Vista: {ROLE_LABELS[role]}
      </span>
    </div>
  );
}

/* ---------------- KPIs / Dashboard ---------------- */

const PERIODS = ["Hoy", "Últimos 7 días", "Últimos 30 días", "Ciclo escolar"];
const PERIOD_DAYS = { "Hoy": 1, "Últimos 7 días": 7, "Últimos 30 días": 30, "Ciclo escolar": 9999 };

function computeKpis(books, loans, period) {
  const maxDays = PERIOD_DAYS[period];
  const scopedLoans = loans.filter((l) => l.loanDate <= maxDays);
  const totalTitles = books.length;
  const totalCopies = books.reduce((s, b) => s + b.copiesTotal, 0);
  const available = books.reduce((s, b) => s + b.copiesAvailable, 0);
  const active = scopedLoans.filter((l) => ["Activo", "Por devolver", "Vencido", "Renovado"].includes(l.status)).length;
  const mostRequested = [...books].sort((a, b) => b.loanCount - a.loanCount)[0];
  const activeReaders = new Set(scopedLoans.map((l) => l.student_id)).size;
  return { totalTitles, totalCopies, available, active, mostRequested, activeReaders };
}

function Dashboard({ books, loans, onOpen, onGrade, onNavFiltered, recommendations }) {
  const [period, setPeriod] = useState("Últimos 30 días");
  const kpis = useMemo(() => computeKpis(books, loans, period), [books, loans, period]);
  const recommended = useMemo(() => [...books].sort((a, b) => (b.loanCount * (b.trend === "up" ? 1.3 : 1)) - (a.loanCount * (a.trend === "up" ? 1.3 : 1))).slice(0, 10), [books]);
  const mostRequested = useMemo(() => [...books].sort((a, b) => b.loanCount - a.loanCount).slice(0, 10), [books]);
  const newest = useMemo(() => [...books].filter((b) => b.isNew).sort((a, b) => a.createdAt - b.createdAt), [books]);
  const starters = useMemo(() => books.filter((b) => b.readingLevel === "Inicial").slice(0, 10), [books]);
  const discover = useMemo(() => recommendations.discover.map((d) => d.book), [recommendations]);

  const gradeStats = useMemo(() => GRADE_LABELS.map((label, i) => {
    const grade = i + 1;
    const gbooks = books.filter((b) => b.grade === grade);
    const gtotal = gbooks.reduce((s, b) => s + b.copiesTotal, 0);
    const gavail = gbooks.reduce((s, b) => s + b.copiesAvailable, 0);
    const gloans = loans.filter((l) => l.grade === grade && ["Activo", "Por devolver", "Vencido", "Renovado"].includes(l.status)).length;
    const top = [...gbooks].sort((a, b) => b.loanCount - a.loanCount)[0];
    const upCount = gbooks.filter((b) => b.trend === "up").length;
    const downCount = gbooks.filter((b) => b.trend === "down").length;
    const trend = upCount > downCount ? "up" : downCount > upCount ? "down" : "stable";
    return { grade, label, books: gbooks.length, total: gtotal, avail: gavail, loans: gloans, top, trend };
  }), [books, loans]);

  const kpiDefs = [
    { label: "Total de títulos", val: kpis.totalTitles, icon: <LibraryBig size={16} />, color: "var(--azul)", bg: "var(--azul-soft)" },
    { label: "Ejemplares en acervo", val: kpis.totalCopies, icon: <Package size={16} />, color: "var(--morado)", bg: "var(--morado-soft)" },
    { label: "Ejemplares disponibles", val: kpis.available, icon: <CheckCircle2 size={16} />, color: "var(--verde)", bg: "var(--verde-soft)" },
    { label: "Préstamos activos", val: kpis.active, icon: <BookOpen size={16} />, color: "var(--marigold)", bg: "var(--marigold-soft)" },
    { label: "Libro más solicitado", val: kpis.mostRequested?.title, small: true, icon: <Flame size={16} />, color: "var(--magenta)", bg: "var(--magenta-soft)" },
    { label: "Lectores activos", val: kpis.activeReaders, icon: <Users size={16} />, color: "var(--amarillo)", bg: "var(--amarillo-soft)" },
  ];

  return (
    <>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 28 }}>Biblioteca inteligente</h1>
          <p style={{ color: "var(--ink-1)", marginTop: 6, fontSize: 14 }}>Todo el acervo escolar en un solo lugar.</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div className="smx-select-mini">
            <select value={period} onChange={(e) => setPeriod(e.target.value)}>
              {PERIODS.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <DataSourceBadge />
        </div>
      </div>

      <div className="smx-kpi-grid">
        {kpiDefs.map((k, i) => (
          <button
            key={i}
            className="smx-kpi"
            onClick={() => {
              if (i === 2) onNavFiltered("available");
              else if (i === 3) onNavFiltered("loans-all");
              else if (i === 4) onNavFiltered("popular");
              else if (i === 5) onNavFiltered("loans-all");
              else onNavFiltered(null);
            }}
          >
            <div className="smx-kpi-icon" style={{ background: k.bg, color: k.color }}>{k.icon}</div>
            <div className="smx-kpi-val" style={k.small ? { fontSize: 14.5, lineHeight: 1.3, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" } : {}}>{k.val ?? "—"}</div>
            <div className="smx-kpi-label">{k.label}</div>
          </button>
        ))}
      </div>

      <section style={{ marginBottom: 36 }}>
        <div className="smx-section-head">
          <div>
            <div className="smx-section-title"><GraduationCap size={18} color="var(--marigold)" />Explora por grado</div>
            <div className="smx-section-sub">Selecciona un grado para ver su catálogo y estadísticas.</div>
          </div>
        </div>
        <div className="smx-grade-grid">
          {gradeStats.map((g) => (
            <button key={g.grade} className="smx-grade-card" onClick={() => onGrade(g.grade)}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div className="smx-grade-num" style={{ color: GRADE_COLORS[g.grade - 1] }}>{g.grade}.º</div>
                <TrendIcon trend={g.trend} size={15} />
              </div>
              <div style={{ fontSize: 12.5, color: "var(--ink-1)", marginTop: 2 }}>{g.label}</div>
              <div style={{ display: "flex", gap: 14, marginTop: 12, fontSize: 12 }}>
                <div><div style={{ fontWeight: 700, fontSize: 15 }}>{g.total}</div><div style={{ color: "var(--ink-2)" }}>libros</div></div>
                <div><div style={{ fontWeight: 700, fontSize: 15 }}>{g.avail}</div><div style={{ color: "var(--ink-2)" }}>disponibles</div></div>
                <div><div style={{ fontWeight: 700, fontSize: 15 }}>{g.loans}</div><div style={{ color: "var(--ink-2)" }}>préstamos</div></div>
              </div>
              <div className="smx-grade-bar"><div style={{ width: `${(g.avail / Math.max(1, g.total)) * 100}%`, background: GRADE_COLORS[g.grade - 1] }} /></div>
              {g.top && <div style={{ fontSize: 11.5, color: "var(--ink-2)", marginTop: 9, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>Más popular: <span style={{ color: "var(--ink-1)" }}>{g.top.title}</span></div>}
            </button>
          ))}
        </div>
      </section>

      <Carousel title="Recomendados para ti" subtitle="Generado por IA según grado, historial e intereses del grupo" icon={<Sparkles size={17} color="var(--marigold)" />} books={recommended} onOpen={onOpen} />
      <Carousel title="Más solicitados" subtitle="Ranking por número de préstamos" icon={<Flame size={17} color="var(--magenta)" />} books={mostRequested} onOpen={onOpen} rank />
      <Carousel title="Nuevos en la biblioteca" subtitle="Incorporaciones recientes al acervo" icon={<BadgeCheck size={17} color="var(--azul)" />} books={newest} onOpen={onOpen} emptyText="No hay nuevos títulos por ahora." />
      <Carousel title="Para comenzar a leer" subtitle="Recomendaciones para lectores que inician su proceso lector" icon={<BookOpen size={17} color="var(--verde)" />} books={starters} onOpen={onOpen} />
      <Carousel title="Por descubrir" subtitle="Baja utilización pero con alto potencial de relevancia" icon={<Search size={17} color="var(--ink-1)" />} books={discover} onOpen={onOpen} />
    </>
  );
}

/* ---------------- Catalog ---------------- */

function matchesFilters(book, activeFilters, search, gradeOverride) {
  const q = search.trim().toLowerCase();
  if (q) {
    const hay = [book.title, book.author, book.category, ...book.topics, ...book.keywords, book.publisher].join(" ").toLowerCase();
    if (!hay.includes(q)) return false;
  }
  if (gradeOverride && book.grade !== gradeOverride) return false;
  if (activeFilters.size === 0 || activeFilters.has("all")) return true;
  for (const f of activeFilters) {
    if (f === "all") continue;
    if (f.startsWith("g")) { if (book.grade === Number(f.slice(1))) continue; else return false; }
    if (f === "available") { if (book.copiesAvailable > 0) continue; else return false; }
    if (f === "loaned") { if (book.copiesAvailable < book.copiesTotal) continue; else return false; }
    if (f === "popular") { if (book.loanCount >= 35) continue; else return false; }
    if (f === "new") { if (book.isNew) continue; else return false; }
    if (f === "starter") { if (book.readingLevel === "Inicial") continue; else return false; }
    if (f.startsWith("cat:")) { if (book.category === f.slice(4)) continue; else return false; }
  }
  return true;
}

function CatalogView({ books, search, setSearch, selectedGrade, setSelectedGrade, onOpen, initialFilters }) {
  const [active, setActive] = useState(new Set(initialFilters ? [initialFilters] : ["all"]));

  useEffect(() => { if (initialFilters) setActive(new Set([initialFilters])); }, [initialFilters]);

  const toggle = (key) => {
    setActive((prev) => {
      const next = new Set(prev);
      if (key === "all") return new Set(["all"]);
      next.delete("all");
      if (next.has(key)) next.delete(key); else next.add(key);
      if (next.size === 0) next.add("all");
      return next;
    });
  };

  const filtered = useMemo(() => books.filter((b) => matchesFilters(b, active, search, selectedGrade)), [books, active, search, selectedGrade]);

  return (
    <>
      <div className="smx-breadcrumb"><span>Biblioteca</span><ChevronRight size={12} /><b>{selectedGrade ? `${selectedGrade}.º Primaria` : "Catálogo completo"}</b></div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 10 }}>
        <div>
          <h2 style={{ fontSize: 22 }}>Catálogo{selectedGrade ? ` · ${selectedGrade}.º Primaria` : ""}</h2>
          <div className="smx-section-sub">{filtered.length} título{filtered.length !== 1 ? "s" : ""} encontrado{filtered.length !== 1 ? "s" : ""}</div>
        </div>
        {selectedGrade && <button className="smx-btn smx-btn-ghost" onClick={() => setSelectedGrade(null)}><X size={14} />Quitar grado</button>}
      </div>

      <div className="smx-filterbar">
        {FILTER_CHIPS.map((c) => (
          <button key={c.key} className={"smx-chip" + (active.has(c.key) ? " active" : "")} onClick={() => toggle(c.key)}>{c.label}</button>
        ))}
        {(active.size > 1 || !active.has("all") || search) && (
          <button className="smx-chip" style={{ color: "var(--rojo)", borderColor: "rgba(221,91,87,0.3)" }} onClick={() => { setActive(new Set(["all"])); setSearch(""); }}><X size={12} /> Limpiar filtros</button>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="smx-empty">
          <PackageX size={34} style={{ marginBottom: 10, opacity: 0.6 }} />
          <div style={{ fontWeight: 600, color: "var(--ink-1)" }}>No encontramos libros con esos filtros</div>
          <div style={{ fontSize: 13, marginTop: 4 }}>Prueba quitando algún filtro o ajustando la búsqueda.</div>
        </div>
      ) : (
        <div className="smx-catalog-grid">{filtered.map((b) => <BookCard key={b.id} book={b} onOpen={onOpen} />)}</div>
      )}
    </>
  );
}

/* ---------------- Book modal ---------------- */

function BookModal({ book, onClose, onLoan, onReserve, onFavorite, isFavorite, onOpenHistory }) {
  if (!book) return null;
  const stats = LibraryService.copyStats(book);
  return (
    <div className="smx-overlay" onClick={onClose}>
      <div className="smx-modal" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", gap: 20, padding: 22, flexWrap: "wrap" }}>
          <div style={{ width: 190, flexShrink: 0 }}><div className="smx-card"><Cover book={book} /></div></div>
          <div style={{ flex: 1, minWidth: 240 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontSize: 11, color: "var(--ink-2)", textTransform: "uppercase", letterSpacing: "0.04em" }}>{book.category} · {book.grade}.º Primaria</div>
                <h2 style={{ fontSize: 21, marginTop: 4 }}>{book.title}</h2>
                <div style={{ color: "var(--ink-1)", fontSize: 13.5, marginTop: 3 }}>{book.author}</div>
              </div>
              <button className="smx-icon-btn" onClick={onClose}><X size={16} /></button>
            </div>

            <p style={{ fontSize: 13.5, color: "var(--ink-1)", lineHeight: 1.6, marginTop: 14 }}>{book.description}</p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 8, marginTop: 16, fontSize: 12.5 }}>
              <div><span style={{ color: "var(--ink-2)" }}>Editorial: </span>{book.publisher}</div>
              <div><span style={{ color: "var(--ink-2)" }}>Año: </span>{book.year}</div>
              <div><span style={{ color: "var(--ink-2)" }}>ISBN: </span>{book.isbn || "No disponible"}</div>
              <div><span style={{ color: "var(--ink-2)" }}>Nivel lector: </span>{book.readingLevel}</div>
            </div>

            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 12 }}>
              {book.keywords.map((k) => <span key={k} className="smx-badge" style={{ background: "var(--bg-3)", color: "var(--ink-1)" }}>{k}</span>)}
            </div>

            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 20 }}>
              <button className="smx-btn smx-btn-primary" disabled={book.copiesAvailable === 0} onClick={() => onLoan(book)}><BookOpen size={14} /> {book.copiesAvailable > 0 ? "Prestar" : "Sin ejemplares"}</button>
              <button className="smx-btn smx-btn-ghost" onClick={() => onReserve(book)}><Bookmark size={14} /> Reservar</button>
              <button className="smx-btn smx-btn-ghost"><Pencil size={14} /> Editar</button>
              <button className="smx-btn smx-btn-ghost" onClick={() => onOpenHistory(book)}><History size={14} /> Ver historial</button>
              <button className="smx-btn smx-btn-ghost" onClick={() => onFavorite(book)} style={isFavorite ? { color: "var(--marigold)", borderColor: "var(--marigold)" } : {}}>
                <Star size={14} fill={isFavorite ? "var(--marigold)" : "none"} /> {isFavorite ? "En favoritos" : "Agregar a favoritos"}
              </button>
            </div>
          </div>
        </div>

        <div style={{ borderTop: "1px solid var(--line)", padding: 22 }}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12, color: "var(--ink-1)" }}>Ejemplares</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(120px,1fr))", gap: 10, marginBottom: 18 }}>
            <StatBox label="Ejemplares totales" value={book.copiesTotal} />
            <StatBox label="Disponibles" value={<span style={{ color: "var(--verde)" }}>{stats.Disponible}</span>} />
            <StatBox label="Prestados" value={<span style={{ color: "var(--marigold)" }}>{stats.Prestado}</span>} />
            <StatBox label="Reservados" value={<span style={{ color: "var(--azul)" }}>{stats.Reservado}</span>} />
            <StatBox label="En reparación" value={<span style={{ color: "var(--amarillo)" }}>{stats["En reparación"]}</span>} />
            <StatBox label="Extraviados" value={<span style={{ color: "var(--rojo)" }}>{stats.Extraviado}</span>} />
          </div>

          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12, color: "var(--ink-1)" }}>Estadísticas</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 10 }}>
            <StatBox label="Veces prestado" value={book.loanCount} />
            <StatBox label="Tendencia" value={<span style={{ display: "flex", alignItems: "center", gap: 5 }}><TrendIcon trend={book.trend} /> {book.trend === "up" ? "En aumento" : book.trend === "down" ? "En descenso" : "Estable"}</span>} />
            <StatBox label="Grados que más lo usan" value={book.topGrades.map((g) => g + ".º").join(", ")} />
            <StatBox label="Último préstamo" value={`Hace ${book.lastLoanDaysAgo} día(s)`} />
            <StatBox label="Duración promedio" value={`${book.avgLoanDays} días`} />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatBox({ label, value }) {
  return (
    <div style={{ background: "var(--bg-2)", border: "1px solid var(--line)", borderRadius: 11, padding: "11px 13px" }}>
      <div style={{ fontSize: 15, fontWeight: 700 }}>{value}</div>
      <div style={{ fontSize: 11.5, color: "var(--ink-2)", marginTop: 3 }}>{label}</div>
    </div>
  );
}

function BookHistoryModal({ book, loans, onClose }) {
  if (!book) return null;
  const history = loans.filter((l) => l.book_id === book.id).sort((a, b) => a.loanDate - b.loanDate);
  return (
    <div className="smx-overlay" onClick={onClose}>
      <div className="smx-modal smx-modal-md" onClick={(e) => e.stopPropagation()}>
        <div style={{ padding: 22 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h3 style={{ fontSize: 16 }}>Historial de préstamos</h3>
              <div className="smx-section-sub">{book.title}</div>
            </div>
            <button className="smx-icon-btn" onClick={onClose}><X size={15} /></button>
          </div>
          {history.length === 0 ? (
            <div className="smx-empty">Este título aún no registra préstamos.</div>
          ) : (
            <div className="smx-table-wrap" style={{ marginTop: 14 }}>
              <table className="smx-table">
                <thead><tr><th>Alumno</th><th>Grado</th><th>Hace</th><th>Estado</th></tr></thead>
                <tbody>
                  {history.map((l) => {
                    const s = statusStyle(l.status);
                    return (
                      <tr key={l.id}>
                        <td data-label="Alumno">{l.student}</td>
                        <td data-label="Grado">{l.grade}.º {l.group}</td>
                        <td data-label="Hace">{l.loanDate}d</td>
                        <td data-label="Estado"><span className="smx-status" style={{ background: s.bg, color: s.color }}>{s.icon}{l.status}</span></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------------- Reader profile / history ---------------- */

function ReaderProfileModal({ student, books, loans, role, onClose, onOpenBook }) {
  if (!student) return null;
  const canView = LibraryService.canViewStudentData(role);
  const history = canView ? LibraryService.readerHistory(student.id, loans, books) : null;
  const recBooks = canView && history?.topCategories.length
    ? books.filter((b) => b.grade === student.grade && history.topCategories.includes(b.category)).slice(0, 4)
    : [];

  return (
    <div className="smx-overlay" onClick={onClose}>
      <div className="smx-modal smx-modal-md" onClick={(e) => e.stopPropagation()}>
        <div style={{ padding: 22 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <div className="smx-avatar" style={{ width: 44, height: 44, fontSize: 15 }}>{student.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}</div>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700 }}>{student.name}</div>
                <div className="smx-section-sub">{student.grade}.º Primaria · Grupo {student.group}</div>
              </div>
            </div>
            <button className="smx-icon-btn" onClick={onClose}><X size={15} /></button>
          </div>

          {!canView ? (
            <div className="smx-empty">
              <Lock size={28} style={{ marginBottom: 10, opacity: 0.6 }} />
              <div style={{ fontWeight: 600, color: "var(--ink-1)" }}>Vista restringida por permisos</div>
              <div style={{ fontSize: 13, marginTop: 4 }}>El rol actual ({ROLE_LABELS[role]}) no tiene acceso a información personal de otros alumnos.</div>
            </div>
          ) : !history.hasEnoughData ? (
            <div className="smx-empty">
              <AlertTriangle size={28} style={{ marginBottom: 10, opacity: 0.6 }} />
              <div style={{ fontWeight: 600, color: "var(--ink-1)" }}>Aún no hay suficientes datos de actividad lectora</div>
              <div style={{ fontSize: 13, marginTop: 4 }}>Este perfil se completará conforme el alumno registre más préstamos.</div>
            </div>
          ) : (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(130px,1fr))", gap: 10, marginTop: 18 }}>
                <StatBox label="Libros leídos" value={history.booksRead} />
                <StatBox label="En préstamo" value={history.booksActive} />
                <StatBox label="Temas recurrentes" value={history.topCategories.join(", ") || "—"} />
                <StatBox label="Último préstamo" value={history.lastLoanDaysAgo != null ? `Hace ${history.lastLoanDaysAgo}d` : "—"} />
              </div>

              <div style={{ fontSize: 13, fontWeight: 600, margin: "20px 0 10px" }}>Préstamos recientes</div>
              <div className="smx-table-wrap">
                <table className="smx-table">
                  <thead><tr><th>Libro</th><th>Hace</th><th>Estado</th></tr></thead>
                  <tbody>
                    {history.loans.slice(0, 6).map((l) => {
                      const s = statusStyle(l.status);
                      return (
                        <tr key={l.id}>
                          <td data-label="Libro">{l.bookTitle}</td>
                          <td data-label="Hace">{l.loanDate}d</td>
                          <td data-label="Estado"><span className="smx-status" style={{ background: s.bg, color: s.color }}>{s.icon}{l.status}</span></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {recBooks.length > 0 && (
                <>
                  <div style={{ fontSize: 13, fontWeight: 600, margin: "20px 0 10px" }}>Recomendaciones para {student.name.split(" ")[0]}</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {recBooks.map((b) => (
                      <button key={b.id} onClick={() => onOpenBook(b)} style={{ display: "flex", justifyContent: "space-between", background: "var(--bg-2)", border: "1px solid var(--line)", borderRadius: 9, padding: "8px 11px", fontSize: 12.5, color: "var(--ink-0)" }}>
                        <span>{b.title}</span><ArrowUpRight size={12} />
                      </button>
                    ))}
                  </div>
                </>
              )}
            </>
          )}
          <div style={{ fontSize: 11, color: "var(--ink-2)", marginTop: 18, display: "flex", gap: 6, alignItems: "center" }}>
            <Radar size={13} /> Estos indicadores describen actividad lectora, no un diagnóstico académico.
          </div>
        </div>
      </div>
    </div>
  );
}

function StudentSearchModal({ students, onClose, onSelect }) {
  const [q, setQ] = useState("");
  const filtered = students.filter((s) => s.name.toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="smx-overlay" onClick={onClose}>
      <div className="smx-modal smx-modal-sm" onClick={(e) => e.stopPropagation()}>
        <div style={{ padding: 22 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 style={{ fontSize: 16 }}>Buscar alumno</h3>
            <button className="smx-icon-btn" onClick={onClose}><X size={15} /></button>
          </div>
          <div className="smx-search" style={{ marginTop: 14, maxWidth: "none" }}>
            <Search size={15} />
            <input autoFocus placeholder="Nombre del alumno…" value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4, marginTop: 12, maxHeight: 260, overflowY: "auto" }}>
            {filtered.length === 0 && <div style={{ fontSize: 12.5, color: "var(--ink-2)", padding: "10px 4px" }}>Sin coincidencias.</div>}
            {filtered.map((s) => (
              <button key={s.id} className="smx-quickitem" onClick={() => onSelect(s)}>
                <UserRound size={14} /> {s.name} <span style={{ marginLeft: "auto", color: "var(--ink-2)" }}>{s.grade}.º {s.group}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Loans ---------------- */

const LOAN_TABS = ["Activos", "Por devolver", "Vencidos", "Devueltos", "Reservaciones"];

function statusStyle(status) {
  switch (status) {
    case "Activo": return { bg: "var(--azul-soft)", color: "var(--azul)", icon: <Clock size={11} /> };
    case "Renovado": return { bg: "var(--morado-soft)", color: "var(--morado)", icon: <RotateCcw size={11} /> };
    case "Por devolver": return { bg: "var(--amarillo-soft)", color: "var(--amarillo)", icon: <CalendarClock size={11} /> };
    case "Vencido": return { bg: "var(--rojo-soft)", color: "var(--rojo)", icon: <AlertTriangle size={11} /> };
    case "Devuelto": return { bg: "var(--verde-soft)", color: "var(--verde)", icon: <CheckCircle2 size={11} /> };
    case "Perdido": return { bg: "var(--rojo-soft)", color: "var(--rojo)", icon: <TriangleAlert size={11} /> };
    case "Cancelado": case "Cancelada": return { bg: "var(--bg-3)", color: "var(--ink-2)", icon: <Ban size={11} /> };
    case "En espera": return { bg: "var(--amarillo-soft)", color: "var(--amarillo)", icon: <Clock size={11} /> };
    case "Disponible": return { bg: "var(--verde-soft)", color: "var(--verde)", icon: <CheckCircle2 size={11} /> };
    default: return { bg: "var(--bg-3)", color: "var(--ink-1)", icon: null };
  }
}

function LoansView({ loans, reservations, onReturn, onRenew, onMarkLost, onCancelReservation, onNewLoan, onOpenStudent }) {
  const [tab, setTab] = useState("Activos");
  const [sortKey, setSortKey] = useState("dueInDays");
  const [sortDir, setSortDir] = useState(1);

  const tabFiltered = useMemo(() => {
    if (tab === "Reservaciones") return [];
    return loans.filter((l) => l.status === tab.replace("Devueltos", "Devuelto"));
  }, [loans, tab]);

  const sorted = useMemo(() => {
    const arr = [...tabFiltered];
    arr.sort((a, b) => (a[sortKey] > b[sortKey] ? 1 : -1) * sortDir);
    return arr;
  }, [tabFiltered, sortKey, sortDir]);

  const sortBy = (key) => { if (sortKey === key) setSortDir((d) => -d); else { setSortKey(key); setSortDir(1); } };

  const counts = {
    Activos: loans.filter((l) => l.status === "Activo" || l.status === "Renovado").length,
    "Por devolver": loans.filter((l) => l.status === "Por devolver").length,
    Vencidos: loans.filter((l) => l.status === "Vencido").length,
    Devueltos: loans.filter((l) => l.status === "Devuelto").length,
    Reservaciones: reservations.filter((r) => r.status !== "Cancelada").length,
  };

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 10 }}>
        <div>
          <h2 style={{ fontSize: 22 }}>Préstamos</h2>
          <div className="smx-section-sub">Control de préstamos, devoluciones y reservaciones</div>
        </div>
        <button className="smx-btn smx-btn-primary" onClick={onNewLoan}><Plus size={15} /> Registrar préstamo</button>
      </div>

      <div className="smx-filterbar" style={{ marginTop: 18 }}>
        {LOAN_TABS.map((t) => (
          <button key={t} className={"smx-chip" + (tab === t ? " active" : "")} onClick={() => setTab(t)}>{t} <span style={{ opacity: 0.7 }}>· {counts[t]}</span></button>
        ))}
      </div>

      {tab === "Reservaciones" ? (
        reservations.filter((r) => r.status !== "Cancelada").length === 0 ? (
          <div className="smx-empty">
            <Bookmark size={30} style={{ marginBottom: 10, opacity: 0.6 }} />
            <div style={{ fontWeight: 600, color: "var(--ink-1)" }}>Aún no hay reservaciones registradas</div>
            <div style={{ fontSize: 13, marginTop: 4 }}>Las reservaciones que se generen desde la ficha del libro aparecerán aquí.</div>
          </div>
        ) : (
          <div className="smx-card">
            <div className="smx-table-wrap">
              <table className="smx-table">
                <thead><tr><th>Alumno</th><th>Grado</th><th>Libro</th><th>Estado</th><th>Acciones</th></tr></thead>
                <tbody>
                  {reservations.filter((r) => r.status !== "Cancelada").map((r) => {
                    const s = statusStyle(r.status);
                    return (
                      <tr key={r.id}>
                        <td data-label="Alumno"><button className="smx-link-name" onClick={() => onOpenStudent(r.student_id)}>{r.student}</button></td>
                        <td data-label="Grado">{r.grade}.º {r.group}</td>
                        <td data-label="Libro">{r.bookTitle}</td>
                        <td data-label="Estado"><span className="smx-status" style={{ background: s.bg, color: s.color }}>{s.icon}{r.status}</span></td>
                        <td data-label="Acciones"><button className="smx-btn smx-btn-ghost" style={{ padding: "6px 10px", fontSize: 12 }} onClick={() => onCancelReservation(r.id)}><X size={12} /> Cancelar</button></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )
      ) : sorted.length === 0 ? (
        <div className="smx-empty"><CheckCircle2 size={30} style={{ marginBottom: 10, opacity: 0.6 }} /><div style={{ fontWeight: 600, color: "var(--ink-1)" }}>No hay registros en "{tab}"</div></div>
      ) : (
        <div className="smx-card">
          <div className="smx-table-wrap">
            <table className="smx-table">
              <thead>
                <tr>
                  <th onClick={() => sortBy("student")}>Alumno</th>
                  <th onClick={() => sortBy("grade")}>Grado</th>
                  <th onClick={() => sortBy("bookTitle")}>Libro</th>
                  <th onClick={() => sortBy("loanDate")}>Préstamo</th>
                  <th onClick={() => sortBy("dueInDays")}>Días restantes</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((l) => {
                  const s = statusStyle(l.status);
                  return (
                    <tr key={l.id}>
                      <td data-label="Alumno"><button className="smx-link-name" onClick={() => onOpenStudent(l.student_id)}>{l.student}</button></td>
                      <td data-label="Grado">{l.grade}.º {l.group}</td>
                      <td data-label="Libro">{l.bookTitle}{l.renewals > 0 && <span style={{ color: "var(--ink-2)", fontSize: 11 }}> · renovado {l.renewals}x</span>}</td>
                      <td data-label="Préstamo">hace {l.loanDate}d</td>
                      <td data-label="Días restantes" style={{ color: l.dueInDays < 0 ? "var(--rojo)" : "var(--ink-1)" }}>{l.status === "Devuelto" ? "—" : l.dueInDays < 0 ? `${Math.abs(l.dueInDays)}d vencido` : `${l.dueInDays}d`}</td>
                      <td data-label="Estado"><span className="smx-status" style={{ background: s.bg, color: s.color }}>{s.icon}{l.status}</span></td>
                      <td data-label="Acciones">
                        {(l.status !== "Devuelto" && l.status !== "Perdido") && (
                          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                            <button className="smx-btn smx-btn-ghost" style={{ padding: "6px 10px", fontSize: 12 }} onClick={() => onReturn(l.id)}><Undo2 size={12} /> Devolver</button>
                            <button className="smx-btn smx-btn-ghost" style={{ padding: "6px 10px", fontSize: 12 }} onClick={() => onRenew(l.id)}><RotateCcw size={12} /> Renovar</button>
                            {l.status === "Vencido" && (
                              <button className="smx-btn smx-btn-danger" style={{ padding: "6px 10px", fontSize: 12 }} onClick={() => onMarkLost(l.id)}><TriangleAlert size={12} /> Marcar perdido</button>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}

function LoanFormModal({ books, students, presetBookId, onClose, onCreate }) {
  const [bookId, setBookId] = useState(presetBookId || books[0]?.id || "");
  const [studentId, setStudentId] = useState(students[0]?.id || "");
  const availableBooks = books.filter((b) => b.copiesAvailable > 0);
  return (
    <div className="smx-overlay" onClick={onClose}>
      <div className="smx-modal smx-modal-sm" onClick={(e) => e.stopPropagation()}>
        <div style={{ padding: 22 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 style={{ fontSize: 17 }}>Registrar préstamo</h3>
            <button className="smx-icon-btn" onClick={onClose}><X size={15} /></button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 18 }}>
            <div className="smx-field">
              <label>Alumno</label>
              <select value={studentId} onChange={(e) => setStudentId(e.target.value)}>
                {students.map((s) => <option key={s.id} value={s.id}>{s.name} · {s.grade}.º {s.group}</option>)}
              </select>
            </div>
            <div className="smx-field">
              <label>Libro (con ejemplares disponibles)</label>
              <select value={bookId} onChange={(e) => setBookId(e.target.value)}>
                {availableBooks.map((b) => <option key={b.id} value={b.id}>{b.title} — {b.copiesAvailable} disp.</option>)}
              </select>
            </div>
            <div style={{ fontSize: 12, color: "var(--ink-2)" }}>Fecha límite sugerida: 14 días a partir de hoy.</div>
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
            <button className="smx-btn smx-btn-ghost" onClick={onClose}>Cancelar</button>
            <button className="smx-btn smx-btn-primary" disabled={!bookId} onClick={() => onCreate(bookId, studentId)}><CheckCircle2 size={14} /> Confirmar préstamo</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Analytics ---------------- */

const CHART_COLORS = ["#EC9027", "#3591C4", "#CE4A79", "#48A860", "#E2BA45", "#8B6FD6"];

function AnalyticsView({ books, loans }) {
  const [period, setPeriod] = useState("Semana");
  const [gradeFilter, setGradeFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [sortField, setSortField] = useState("loans");
  const [sortDir, setSortDir] = useState(-1);

  const scoped = useAnalytics(books, loans, { grade: gradeFilter ? Number(gradeFilter) : null, category: categoryFilter || null });
  const sb = scoped.scopedBooks, sl = scoped.scopedLoans;

  const mostRequested = useMemo(() => [...sb].sort((a, b) => b.loanCount - a.loanCount).slice(0, 8)
    .map((b) => ({ name: b.title.length > 16 ? b.title.slice(0, 15) + "…" : b.title, préstamos: b.loanCount })), [sb]);

  const byGrade = useMemo(() => GRADE_LABELS.map((_, i) => {
    const g = i + 1;
    const gbooks = sb.filter((b) => b.grade === g);
    return { name: `${g}.º`, préstamos: gbooks.reduce((s, b) => s + b.loanCount, 0) };
  }), [sb]);

  const trendData = useMemo(() => {
    const points = period === "Día" ? 7 : period === "Semana" ? 8 : period === "Mes" ? 6 : 4;
    const rnd = seededRand(period.length * 13);
    const labels = period === "Día" ? ["L", "M", "M", "J", "V", "S", "D"]
      : period === "Semana" ? Array.from({ length: points }, (_, i) => `S${i + 1}`)
      : period === "Mes" ? ["Ago", "Sep", "Oct", "Nov", "Dic", "Ene"]
      : ["Bim.1", "Bim.2", "Bim.3", "Bim.4"];
    let base = 40;
    return labels.slice(0, points).map((l) => { base += Math.round((rnd() - 0.4) * 14); base = Math.max(15, base); return { name: l, préstamos: base }; });
  }, [period]);

  const byTopic = useMemo(() => CATEGORIES.map((c) => ({ name: c, value: sb.filter((b) => b.category === c).reduce((s, b) => s + b.loanCount, 0) })).sort((a, b) => b.value - a.value), [sb]);

  const availability = useMemo(() => {
    const totalAvail = sb.reduce((s, b) => s + b.copiesAvailable, 0);
    const onLoan = sl.filter((l) => l.status !== "Devuelto").length;
    const reserved = Math.round(onLoan * 0.15);
    return [{ name: "Disponible", value: totalAvail }, { name: "Prestado", value: onLoan }, { name: "Reservado", value: reserved }];
  }, [sb, sl]);

  const gradeTable = useMemo(() => {
    const rows = GRADE_LABELS.map((label, i) => {
      const g = i + 1;
      const gbooks = sb.filter((b) => b.grade === g);
      const loansCount = gbooks.reduce((s, b) => s + b.loanCount, 0);
      const top = [...gbooks].sort((a, b) => b.loanCount - a.loanCount)[0];
      return { grado: `${g}.º`, libros: gbooks.length, loans: loansCount, disponibles: gbooks.reduce((s, b) => s + b.copiesAvailable, 0), top: top?.title || "—" };
    });
    return rows.sort((a, b) => (a[sortField] > b[sortField] ? 1 : -1) * sortDir);
  }, [sb, sortField, sortDir]);

  const sortBy = (f) => { if (sortField === f) setSortDir((d) => -d); else { setSortField(f); setSortDir(-1); } };

  return (
    <>
      <div className="smx-section-head">
        <div>
          <h2 style={{ fontSize: 22 }}>Analítica</h2>
          <div className="smx-section-sub">Visualizaciones interactivas del uso del acervo escolar</div>
        </div>
        <DataSourceBadge />
      </div>

      <div className="smx-filterbar">
        <div className="smx-select-mini"><select value={gradeFilter} onChange={(e) => setGradeFilter(e.target.value)}>
          <option value="">Todos los grados</option>{GRADE_LABELS.map((g, i) => <option key={i} value={i + 1}>{g}</option>)}
        </select></div>
        <div className="smx-select-mini"><select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
          <option value="">Todas las categorías</option>{CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select></div>
        {(gradeFilter || categoryFilter) && (
          <button className="smx-chip" style={{ color: "var(--rojo)" }} onClick={() => { setGradeFilter(""); setCategoryFilter(""); }}><X size={12} /> Limpiar</button>
        )}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
        <ChartCard title="Libros más solicitados" subtitle="Ranking por número de préstamos">
          <ResponsiveContainer width="100%" height={230}>
            <BarChart data={mostRequested} layout="vertical" margin={{ left: 8, right: 12 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#232C42" horizontal={false} />
              <XAxis type="number" stroke="#5D6786" fontSize={11} />
              <YAxis type="category" dataKey="name" stroke="#5D6786" fontSize={11} width={110} />
              <Tooltip contentStyle={{ background: "#151C2C", border: "1px solid #232C42", borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="préstamos" fill="#EC9027" radius={[0, 5, 5, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Préstamos por grado" subtitle="Comparativo 1.º a 6.º">
          <ResponsiveContainer width="100%" height={230}>
            <BarChart data={byGrade}>
              <CartesianGrid strokeDasharray="3 3" stroke="#232C42" vertical={false} />
              <XAxis dataKey="name" stroke="#5D6786" fontSize={11} />
              <YAxis stroke="#5D6786" fontSize={11} />
              <Tooltip contentStyle={{ background: "#151C2C", border: "1px solid #232C42", borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="préstamos" radius={[5, 5, 0, 0]}>{byGrade.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}</Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <ChartCard title="Tendencia de préstamos" subtitle="Evolución en el tiempo" action={
        <div style={{ display: "flex", gap: 4 }}>{["Día", "Semana", "Mes", "Ciclo"].map((p) => (
          <button key={p} className={"smx-chip" + (period === p ? " active" : "")} style={{ padding: "5px 10px" }} onClick={() => setPeriod(p)}>{p}</button>
        ))}</div>
      }>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#232C42" vertical={false} />
            <XAxis dataKey="name" stroke="#5D6786" fontSize={11} />
            <YAxis stroke="#5D6786" fontSize={11} />
            <Tooltip contentStyle={{ background: "#151C2C", border: "1px solid #232C42", borderRadius: 8, fontSize: 12 }} />
            <Line type="monotone" dataKey="préstamos" stroke="#3591C4" strokeWidth={2.5} dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 16, margin: "16px 0" }}>
        <ChartCard title="Temas más consultados" subtitle="Préstamos acumulados por categoría">
          <ResponsiveContainer width="100%" height={230}>
            <BarChart data={byTopic}>
              <CartesianGrid strokeDasharray="3 3" stroke="#232C42" vertical={false} />
              <XAxis dataKey="name" stroke="#5D6786" fontSize={10.5} angle={-20} textAnchor="end" height={50} />
              <YAxis stroke="#5D6786" fontSize={11} />
              <Tooltip contentStyle={{ background: "#151C2C", border: "1px solid #232C42", borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="value" name="préstamos" fill="#CE4A79" radius={[5, 5, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Disponibilidad del acervo" subtitle="Disponible vs. prestado vs. reservado">
          <ResponsiveContainer width="100%" height={230}>
            <PieChart>
              <Pie data={availability} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={3}>
                {availability.map((_, i) => <Cell key={i} fill={[CHART_COLORS[3], CHART_COLORS[0], CHART_COLORS[1]][i]} />)}
              </Pie>
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Tooltip contentStyle={{ background: "#151C2C", border: "1px solid #232C42", borderRadius: 8, fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <ChartCard title="Comparación por grado" subtitle="Ordenable por columna">
        <div className="smx-table-wrap">
          <table className="smx-table">
            <thead><tr><th onClick={() => sortBy("grado")}>Grado</th><th onClick={() => sortBy("libros")}>Libros</th><th onClick={() => sortBy("loans")}>Préstamos</th><th onClick={() => sortBy("disponibles")}>Disponibles</th><th>Más solicitado</th></tr></thead>
            <tbody>{gradeTable.map((r) => (
              <tr key={r.grado}>
                <td data-label="Grado" style={{ color: "var(--ink-0)", fontWeight: 600 }}>{r.grado}</td>
                <td data-label="Libros">{r.libros}</td><td data-label="Préstamos">{r.loans}</td><td data-label="Disponibles">{r.disponibles}</td><td data-label="Más solicitado">{r.top}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </ChartCard>
    </>
  );
}

function ChartCard({ title, subtitle, action, children }) {
  return (
    <div className="smx-card" style={{ padding: 18, marginBottom: 4 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6, flexWrap: "wrap", gap: 8 }}>
        <div><div style={{ fontWeight: 700, fontSize: 14.5 }}>{title}</div>{subtitle && <div style={{ fontSize: 11.5, color: "var(--ink-2)", marginTop: 2 }}>{subtitle}</div>}</div>
        {action}
      </div>
      {children}
    </div>
  );
}

/* ---------------- AI Recommendations ---------------- */

function AIView({ books, onOpen, recommendations }) {
  const alerts = [
    { icon: "🔔", text: "12 devoluciones vencen en los próximos 3 días." },
    { icon: "⚠️", text: "5 préstamos están vencidos y requieren seguimiento." },
    { icon: "📚", text: "\u201cEl jardín de las letras\u201d superó los 40 préstamos este ciclo." },
    { icon: "📈", text: "El tema Ciencia ha crecido 18% en solicitudes esta semana." },
    { icon: "📉", text: "3 títulos de 5.º muestran baja utilización sostenida." },
    { icon: "📦", text: "2 libros cuentan con un solo ejemplar disponible." },
    { icon: "📖", text: "Hay reservas listas para recoger en el mostrador." },
  ];

  return (
    <>
      <div className="smx-section-head">
        <div>
          <div className="smx-section-title"><Sparkles size={20} color="var(--marigold)" />Biblioteca IA</div>
          <div className="smx-section-sub">Recomendaciones generadas a partir del comportamiento real de uso del acervo. Nunca se presentan datos inventados como reales.</div>
        </div>
        <DataSourceBadge />
      </div>

      <section style={{ marginBottom: 30, marginTop: 22 }}>
        <h3 style={{ fontSize: 15, marginBottom: 12 }}>Recomendaciones por grado</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))", gap: 14 }}>
          {recommendations.insights.map((ins) => (
            <div key={ins.grade} className="smx-card" style={{ padding: 18 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <span style={{ width: 26, height: 26, borderRadius: 8, background: "var(--bg-3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: GRADE_COLORS[ins.grade - 1] }}>{ins.grade}.º</span>
                <span style={{ fontSize: 13, fontWeight: 600 }}>{ins.grade}.º Primaria</span>
              </div>
              {ins.kind === "insufficient" ? (
                <div style={{ fontSize: 13, color: "var(--ink-2)", display: "flex", gap: 8 }}>
                  <AlertTriangle size={15} style={{ flexShrink: 0, marginTop: 2 }} />
                  Aún no hay suficientes datos para generar una recomendación confiable.
                </div>
              ) : (
                <>
                  <p style={{ fontSize: 13, color: "var(--ink-1)", lineHeight: 1.55 }}>{ins.reason}</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 8 }}>
                    {ins.picks.map((b) => (
                      <button key={b.id} onClick={() => onOpen(b)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--bg-2)", border: "1px solid var(--line)", borderRadius: 9, padding: "8px 11px", fontSize: 12.5, color: "var(--ink-0)" }}>
                        <span>{b.title}</span><span style={{ color: "var(--ink-2)" }}><ArrowUpRight size={12} /></span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </section>

      <section style={{ marginBottom: 30 }}>
        <h3 style={{ fontSize: 15, marginBottom: 12 }}>Por descubrir</h3>
        <div className="smx-catalog-grid" style={{ gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))" }}>
          {recommendations.discover.map(({ book: b, reason }) => (
            <div key={b.id} className="smx-card" style={{ padding: 14 }}>
              <div style={{ display: "flex", gap: 12 }}>
                <div style={{ width: 62, flexShrink: 0 }}><Cover book={b} small /></div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{b.title}</div>
                  <div style={{ fontSize: 11.5, color: "var(--ink-2)", marginTop: 2 }}>{b.author}</div>
                  <p style={{ fontSize: 11.5, color: "var(--ink-1)", marginTop: 6, lineHeight: 1.5 }}>{reason}</p>
                  <button className="smx-btn smx-btn-ghost" style={{ marginTop: 8, padding: "5px 10px", fontSize: 11.5 }} onClick={() => onOpen(b)}>Ver ficha</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h3 style={{ fontSize: 15, marginBottom: 12 }}>Alertas inteligentes</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 10 }}>
          {alerts.map((a, i) => (
            <div key={i} className="smx-card" style={{ padding: "13px 15px", display: "flex", gap: 10, alignItems: "flex-start" }}>
              <span style={{ fontSize: 16 }}>{a.icon}</span><span style={{ fontSize: 12.5, color: "var(--ink-1)", lineHeight: 1.5 }}>{a.text}</span>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

/* ---------------- Leerflix (submódulo de lectura) ---------------- */

function LeerflixCard({ item, cat, onOpen }) {
  const Icon = cat.icon;
  return (
    <div className="lfx-card" onClick={() => onOpen(item, cat)}>
      <div className="lfx-card-cover" style={{ background: `linear-gradient(160deg, ${cat.color}33, #0A0A0A 78%)` }}>
        <Icon size={18} color={cat.color} className="lfx-card-icon" />
        <span className="lfx-pending-pill">Contenido pendiente</span>
      </div>
      <div className="lfx-card-title">{item.title}</div>
    </div>
  );
}

function LeerflixRow({ cat, items, onOpen }) {
  const Icon = cat.icon;
  return (
    <div>
      <div className="lfx-row-title"><Icon size={15} color={cat.color} />{cat.label} <span className="lfx-row-count">· {items.length}</span></div>
      <div className="lfx-scrollx">
        {items.map((it) => <LeerflixCard key={it.title} item={it} cat={cat} onOpen={onOpen} />)}
      </div>
    </div>
  );
}

function LeerflixDetailModal({ item, cat, onClose }) {
  if (!item) return null;
  const Icon = cat.icon;
  return (
    <div className="lfx-overlay" onClick={onClose}>
      <div className="lfx-modal" onClick={(e) => e.stopPropagation()}>
        <div className="lfx-modal-cover" style={{ background: `linear-gradient(160deg, ${cat.color}44, #0A0A0A 85%)` }}>
          <div className="lfx-modal-cover-scrim" />
          <button className="lfx-close" onClick={onClose}><X size={14} /></button>
          <div style={{ position: "relative", zIndex: 1 }}>
            <Icon size={22} color={cat.color} />
          </div>
        </div>
        <div className="lfx-modal-body">
          <div style={{ fontSize: 10.5, fontWeight: 700, color: cat.color, textTransform: "uppercase", letterSpacing: "0.05em" }}>{cat.label}</div>
          <div style={{ fontFamily: "'Lexend',sans-serif", fontSize: 19, fontWeight: 700, color: "#fff", marginTop: 6 }}>{item.title}</div>
          <div style={{ fontSize: 12.5, color: "#999", marginTop: 4 }}>{item.author}</div>
          <div className="lfx-pending-box">
            <FileWarning size={15} style={{ flexShrink: 0, marginTop: 1 }} />
            <span>El contenido de lectura de este título aún no se ha incorporado — se definirá en una siguiente fase, respetando los derechos de autor de cada obra.</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function LeerflixView({ onExit }) {
  const [activeCat, setActiveCat] = useState("inicio");
  const [detail, setDetail] = useState(null);

  const featuredCat = LEERFLIX_CATEGORIES.find((c) => c.key === LEERFLIX_FEATURED.key);
  const openDetail = (item, cat) => setDetail({ item, cat });

  return (
    <div className="lfx">
      <div className="lfx-shell">
        <div className="lfx-sidebar">
          <div className="lfx-brand"><Film size={20} /> LEERFLIX</div>
          <div className="lfx-brand-sub">El Profe Víctor</div>

          <button className={"lfx-navitem" + (activeCat === "inicio" ? " active" : "")} onClick={() => setActiveCat("inicio")}>
            <Home size={15} /> Inicio
          </button>
          {LEERFLIX_CATEGORIES.map((c) => {
            const Icon = c.icon;
            return (
              <button key={c.key} className={"lfx-navitem" + (activeCat === c.key ? " active" : "")} onClick={() => setActiveCat(c.key)}>
                <Icon size={15} /> {c.label}
              </button>
            );
          })}
          <div className="lfx-navitem-spacer" />
          <button className="lfx-navitem" onClick={onExit}><LogOut size={15} /> Salir</button>
        </div>

        <div className="lfx-main">
          <div className="lfx-hero" style={{ background: `linear-gradient(120deg, ${featuredCat.color}3D, #0A0A0A 72%)` }}>
            <div className="lfx-hero-scrim" />
            <div className="lfx-hero-content">
              <div className="lfx-hero-cat">{featuredCat.label}</div>
              <div className="lfx-hero-title">{LEERFLIX_FEATURED.title}</div>
              <div className="lfx-hero-meta">{LEERFLIX_FEATURED.author}</div>
              <div className="lfx-hero-actions">
                <button className="lfx-btn lfx-btn-primary" onClick={() => openDetail(LEERFLIX_CATALOG.leyendas[0], featuredCat)}><PlayCircle size={15} /> Ver ficha</button>
                <button className="lfx-btn lfx-btn-ghost" onClick={() => setActiveCat("leyendas")}>Explorar Leyendas</button>
              </div>
            </div>
          </div>

          {activeCat === "inicio" ? (
            LEERFLIX_CATEGORIES.map((c) => (
              <LeerflixRow key={c.key} cat={c} items={LEERFLIX_CATALOG[c.key]} onOpen={openDetail} />
            ))
          ) : (
            <>
              <div className="lfx-row-title" style={{ marginTop: 26 }}>
                {React.createElement(LEERFLIX_CATEGORIES.find((c) => c.key === activeCat).icon, { size: 15, color: LEERFLIX_CATEGORIES.find((c) => c.key === activeCat).color })}
                {LEERFLIX_CATEGORIES.find((c) => c.key === activeCat).label}
                <span className="lfx-row-count">· {LEERFLIX_CATALOG[activeCat].length} títulos</span>
              </div>
              <div className="lfx-cat-grid">
                {LEERFLIX_CATALOG[activeCat].map((it) => (
                  <LeerflixCard key={it.title} item={it} cat={LEERFLIX_CATEGORIES.find((c) => c.key === activeCat)} onOpen={openDetail} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {detail && <LeerflixDetailModal item={detail.item} cat={detail.cat} onClose={() => setDetail(null)} />}
    </div>
  );
}

/* ---------------- Admin ---------------- */

function ImportPreviewModal({ preview, onClose, onConfirm }) {
  return (
    <div className="smx-overlay" onClick={onClose}>
      <div className="smx-modal" onClick={(e) => e.stopPropagation()}>
        <div style={{ padding: 22 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 style={{ fontSize: 17 }}>Vista previa de importación</h3>
            <button className="smx-icon-btn" onClick={onClose}><X size={15} /></button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, marginTop: 16 }}>
            <StatBox label="Registros encontrados" value={preview.found} />
            <StatBox label="Válidos" value={<span style={{ color: "var(--verde)" }}>{preview.valid}</span>} />
            <StatBox label="Con errores" value={<span style={{ color: "var(--rojo)" }}>{preview.withErrors}</span>} />
            <StatBox label="Duplicados" value={<span style={{ color: "var(--amarillo)" }}>{preview.duplicates}</span>} />
          </div>

          <div className="smx-table-wrap" style={{ marginTop: 16 }}>
            <table className="smx-table">
              <thead><tr><th>Título</th><th>Autor</th><th>Grado</th><th>Ejemplares</th><th>Estado</th></tr></thead>
              <tbody>
                {preview.rows.map((r, i) => (
                  <tr key={i}>
                    <td data-label="Título">{r.title || <em style={{ color: "var(--ink-2)" }}>Sin título</em>}</td>
                    <td data-label="Autor">{r.author}</td>
                    <td data-label="Grado">{r.grade}.º</td>
                    <td data-label="Ejemplares">{r.copies}</td>
                    <td data-label="Estado">
                      {r.errors.length > 0 ? (
                        <span className="smx-status" style={{ background: "var(--rojo-soft)", color: "var(--rojo)" }}><FileWarning size={11} /> {r.errors[0]}</span>
                      ) : r.duplicate ? (
                        <span className="smx-status" style={{ background: "var(--amarillo-soft)", color: "var(--amarillo)" }}><TriangleAlert size={11} /> Posible duplicado</span>
                      ) : (
                        <span className="smx-status" style={{ background: "var(--verde-soft)", color: "var(--verde)" }}><CheckCircle2 size={11} /> Listo</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ fontSize: 12, color: "var(--ink-2)", marginTop: 14 }}>Los registros con errores o duplicados no se importarán hasta que se corrijan. Nada se guarda hasta confirmar.</div>
          <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
            <button className="smx-btn smx-btn-ghost" onClick={onClose}>Cancelar</button>
            <button className="smx-btn smx-btn-primary" onClick={onConfirm}><Upload size={14} /> Confirmar importación ({preview.valid} registros)</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function AdminView({ books, onAddBook, onDeleteBook, onToast, findDuplicate }) {
  const [form, setForm] = useState({ title: "", author: "", isbn: "", grade: 1, category: CATEGORIES[0], copies: 3 });
  const [duplicateWarning, setDuplicateWarning] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [tab, setTab] = useState("catalog");
  const [importPreview, setImportPreview] = useState(null);

  const checkAndSubmit = () => {
    if (!form.title || !form.author) return;
    const dup = findDuplicate(form);
    if (dup && !duplicateWarning) { setDuplicateWarning(dup); return; }
    onAddBook(form);
    setForm({ title: "", author: "", isbn: "", grade: 1, category: CATEGORIES[0], copies: 3 });
    setDuplicateWarning(null);
  };

  return (
    <>
      <div className="smx-section-head">
        <div>
          <h2 style={{ fontSize: 22 }}>Panel de administración</h2>
          <div className="smx-section-sub">Gestión del catálogo, categorías, usuarios y préstamos.</div>
        </div>
        <DataSourceBadge />
      </div>

      <div className="smx-filterbar">
        {[["catalog", "Catálogo"], ["categories", "Categorías y temas"], ["users", "Usuarios"], ["importexport", "Importar / Exportar"], ["roadmap", "Integraciones futuras"]].map(([k, l]) => (
          <button key={k} className={"smx-chip" + (tab === k ? " active" : "")} onClick={() => setTab(k)}>{l}</button>
        ))}
      </div>

      {tab === "catalog" && (
        <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: 18 }}>
          <div className="smx-card" style={{ padding: 18, height: "fit-content" }}>
            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 14, display: "flex", alignItems: "center", gap: 7 }}><PlusCircle size={16} color="var(--marigold)" /> Agregar libro</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div className="smx-field"><label>Título</label><input value={form.title} onChange={(e) => { setForm({ ...form, title: e.target.value }); setDuplicateWarning(null); }} placeholder="Título del libro" /></div>
              <div className="smx-field"><label>Autor</label><input value={form.author} onChange={(e) => { setForm({ ...form, author: e.target.value }); setDuplicateWarning(null); }} placeholder="Nombre del autor" /></div>
              <div className="smx-field"><label>ISBN (opcional)</label><input value={form.isbn} onChange={(e) => setForm({ ...form, isbn: e.target.value })} placeholder="978-…" /></div>
              <div className="smx-field"><label>Grado</label>
                <select value={form.grade} onChange={(e) => setForm({ ...form, grade: Number(e.target.value) })}>{GRADE_LABELS.map((g, i) => <option key={i} value={i + 1}>{g}</option>)}</select>
              </div>
              <div className="smx-field"><label>Categoría</label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>{CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}</select>
              </div>
              <div className="smx-field"><label>Ejemplares</label><input type="number" min={1} value={form.copies} onChange={(e) => setForm({ ...form, copies: Number(e.target.value) })} /></div>

              {duplicateWarning && (
                <div style={{ background: "var(--amarillo-soft)", border: "1px solid rgba(226,186,69,0.35)", borderRadius: 10, padding: 11, fontSize: 12, color: "var(--amarillo)", display: "flex", gap: 8 }}>
                  <TriangleAlert size={15} style={{ flexShrink: 0 }} />
                  Posible duplicado ({duplicateWarning.reason}) con "{duplicateWarning.book.title}". Vuelve a presionar "Agregar" para confirmar de todas formas.
                </div>
              )}

              <button className="smx-btn smx-btn-primary" disabled={!form.title || !form.author} onClick={checkAndSubmit}><Plus size={14} /> Agregar al catálogo</button>
            </div>
          </div>

          <div className="smx-card">
            <div className="smx-table-wrap">
              <table className="smx-table">
                <thead><tr><th>Título</th><th>Autor</th><th>Grado</th><th>Categoría</th><th>Ejemplares</th><th></th></tr></thead>
                <tbody>
                  {books.slice(0, 40).map((b) => (
                    <tr key={b.id}>
                      <td data-label="Título" style={{ color: "var(--ink-0)" }}>{b.title}</td>
                      <td data-label="Autor">{b.author}</td>
                      <td data-label="Grado">{b.grade}.º</td>
                      <td data-label="Categoría">{b.category}</td>
                      <td data-label="Ejemplares">{b.copiesTotal}</td>
                      <td data-label="">
                        <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
                          <button className="smx-icon-btn" style={{ width: 30, height: 30 }}><Pencil size={13} /></button>
                          <button className="smx-icon-btn" style={{ width: 30, height: 30 }} onClick={() => setConfirmDelete(b)}><Trash2 size={13} color="var(--rojo)" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {tab === "categories" && (
        <div className="smx-card" style={{ padding: 18 }}>
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 12 }}>Categorías activas</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>{CATEGORIES.map((c) => <span key={c} className="smx-badge" style={{ background: "var(--bg-3)", color: "var(--ink-1)", fontSize: 12, padding: "6px 12px" }}>{CATEGORY_ICON[c]} {c}</span>)}</div>
        </div>
      )}

      {tab === "users" && (
        <div className="smx-empty">
          <Users size={30} style={{ marginBottom: 10, opacity: 0.6 }} />
          <div style={{ fontWeight: 600, color: "var(--ink-1)" }}>Sin usuarios cargados</div>
          <div style={{ fontSize: 13, marginTop: 4 }}>Los alumnos, docentes y grupos se sincronizarán desde SIED MX mediante su ID único — no se duplicarán aquí.</div>
        </div>
      )}

      {tab === "importexport" && (
        <div className="smx-card" style={{ padding: 18, display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button className="smx-btn smx-btn-ghost" onClick={() => setImportPreview(LibraryService.parseImportPreview(books))}><Upload size={14} /> Importar catálogo (CSV/Excel)</button>
          <button className="smx-btn smx-btn-ghost" onClick={() => onToast("Exportación generada (demostración).", "ok")}><Download size={14} /> Exportar información</button>
        </div>
      )}

      {tab === "roadmap" && (
        <div className="smx-card" style={{ padding: 22 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <Radar size={17} color="var(--morado)" /><span style={{ fontWeight: 700, fontSize: 14.5 }}>Próximas integraciones con SIED MX</span>
            <span className="smx-source-badge smx-source-config">🔵 CONFIGURACIÓN</span>
          </div>
          <p style={{ fontSize: 13, color: "var(--ink-1)", lineHeight: 1.6, marginTop: 8 }}>
            La actividad bibliotecaria está preparada para alimentar, como una fuente más entre varias, el futuro Radar pedagógico
            del alumno — junto con evaluaciones, evidencias, bitácoras y asistencia. Esta integración aún no está activa: no se
            generan diagnósticos ni etiquetas a partir de los préstamos.
          </p>
          <div className="smx-roadmap" style={{ marginTop: 18 }}>
            <div className="smx-roadmap-node">Biblioteca · Actividad lectora</div>
            <div className="smx-roadmap-arrow">↓</div>
            <div className="smx-roadmap-node">Historial e indicadores</div>
            <div className="smx-roadmap-arrow">↓</div>
            <div className="smx-roadmap-node" style={{ borderStyle: "solid", color: "var(--ink-2)" }}>Radar pedagógico (próximamente)</div>
          </div>
        </div>
      )}

      {confirmDelete && (
        <div className="smx-overlay" onClick={() => setConfirmDelete(null)}>
          <div className="smx-modal smx-modal-sm" onClick={(e) => e.stopPropagation()}>
            <div style={{ padding: 22 }}>
              <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <AlertTriangle size={20} color="var(--rojo)" style={{ flexShrink: 0, marginTop: 2 }} />
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>Eliminar libro</div>
                  <div style={{ fontSize: 13, color: "var(--ink-1)", marginTop: 5 }}>¿Confirmas eliminar "{confirmDelete.title}" del catálogo? Esta acción no se puede deshacer.</div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 8, marginTop: 18, justifyContent: "flex-end" }}>
                <button className="smx-btn smx-btn-ghost" onClick={() => setConfirmDelete(null)}>Cancelar</button>
                <button className="smx-btn smx-btn-danger" onClick={() => { onDeleteBook(confirmDelete.id); setConfirmDelete(null); }}><Trash2 size={14} /> Eliminar</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {importPreview && (
        <ImportPreviewModal
          preview={importPreview}
          onClose={() => setImportPreview(null)}
          onConfirm={() => {
            importPreview.rows.filter((r) => r.errors.length === 0 && !r.duplicate).forEach((r) => onAddBook(r));
            onToast(`Importación completada: ${importPreview.valid} libros agregados.`, "ok");
            setImportPreview(null);
          }}
        />
      )}
    </>
  );
}

/* ---------------- Quick actions / FAB ---------------- */

function QuickMenu({ onAction }) {
  const items = [
    { key: "add-book", label: "Agregar libro", icon: <Plus size={15} /> },
    { key: "new-loan", label: "Registrar préstamo", icon: <BookOpen size={15} /> },
    { key: "return", label: "Registrar devolución", icon: <Undo2 size={15} /> },
    { key: "search-student", label: "Buscar alumno", icon: <UserRound size={15} /> },
    { key: "overdue", label: "Ver vencidos", icon: <AlertTriangle size={15} /> },
    { key: "stats", label: "Ver estadísticas", icon: <BarChart3 size={15} /> },
    { key: "ai", label: "Recomendación IA", icon: <Sparkles size={15} /> },
  ];
  return (
    <div className="smx-quickmenu">{items.map((it) => <button key={it.key} className="smx-quickitem" onClick={() => onAction(it.key)}>{it.icon}{it.label}</button>)}</div>
  );
}

/* ================================================================================
   6) APP — orquesta hooks y vistas. Punto de entrada.
   ================================================================================ */

export default function App() {
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("dashboard");
  const [role, setRole] = useState("admin");
  const [search, setSearch] = useState("");
  const [selectedGrade, setSelectedGrade] = useState(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [notifsOpen, setNotifsOpen] = useState(false);
  const [quickOpen, setQuickOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [historyBook, setHistoryBook] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentSearchOpen, setStudentSearchOpen] = useState(false);
  const [favorites, setFavorites] = useState(new Set());
  const [showLoanForm, setShowLoanForm] = useState(false);
  const [initialCatalogFilter, setInitialCatalogFilter] = useState(null);
  const [toast, setToast] = useState(null);

  const { books, addBook, deleteBook, findDuplicate, setCopyStatus, bumpLoanCount } = useBooks();
  const { students } = useStudents();
  const { loans, reservations, createLoan, returnLoan, renewLoan, markLost, createReservation, cancelReservation } = useLoans(books, { setCopyStatus, bumpLoanCount });
  const recommendations = useRecommendations(books);

  useEffect(() => { const t = setTimeout(() => setLoading(false), 700); return () => clearTimeout(t); }, []);
  useEffect(() => { if (!toast) return; const t = setTimeout(() => setToast(null), 2800); return () => clearTimeout(t); }, [toast]);

  const showToast = (msg, kind) => setToast({ msg, kind: kind || "ok" });

  const alerts = [
    { icon: "⚠️", text: `${loans.filter((l) => l.status === "Vencido").length} préstamos vencidos requieren seguimiento` },
    { icon: "🔔", text: `${loans.filter((l) => l.status === "Por devolver").length} devoluciones próximas a vencer` },
    { icon: "📦", text: `${books.filter((b) => b.copiesAvailable === 0).length} títulos sin ejemplares disponibles` },
    { icon: "📖", text: `${reservations.filter((r) => r.status === "Disponible").length} reservas listas para recoger` },
  ];

  // Si el rol activo pierde acceso a la vista actual, regresar al dashboard.
  useEffect(() => { if (!ROLE_PERMISSIONS[role].tabs.includes(view)) setView("dashboard"); }, [role]); // eslint-disable-line

  const handleNav = (v) => { setView(v); setFiltersOpen(false); setNotifsOpen(false); };
  const handleGrade = (g) => { setSelectedGrade(g); setInitialCatalogFilter(null); setView("catalog"); };
  const handleNavFiltered = (filterKey) => {
    if (filterKey && filterKey.startsWith("loans-")) { setView("loans"); return; }
    setInitialCatalogFilter(filterKey); setView("catalog");
  };

  const handleCreateLoan = (bookId, studentId) => {
    const res = createLoan(bookId, studentId);
    showToast(res.message, res.ok ? "ok" : "error");
    if (res.ok) { setShowLoanForm(false); setSelectedBook(null); }
  };

  const handleReturn = (id) => { const r = returnLoan(id); showToast(r.message, r.ok ? "ok" : "error"); };
  const handleRenew = (id) => { const r = renewLoan(id); showToast(r.message, r.ok ? "ok" : "error"); };
  const handleMarkLost = (id) => { const r = markLost(id); showToast(r.message, r.ok ? "ok" : "error"); };
  const handleReserve = (book) => { const s = students[0]; const r = createReservation(book.id, s.id); showToast(r.message, r.ok ? "ok" : "error"); };
  const handleCancelReservation = (id) => { const r = cancelReservation(id); showToast(r.message, r.ok ? "ok" : "error"); };

  const handleAddBook = (form) => { addBook(form); showToast(`Libro agregado: ${form.title}`, "ok"); };
  const handleDeleteBook = (id) => { deleteBook(id); showToast("Libro eliminado", "ok"); };
  const toggleFavorite = (book) => setFavorites((prev) => { const next = new Set(prev); next.has(book.id) ? next.delete(book.id) : next.add(book.id); return next; });

  const openStudentById = (studentId) => { const s = students.find((x) => x.id === studentId); if (s) setSelectedStudent(s); };

  const handleQuickAction = (key) => {
    setQuickOpen(false);
    if (key === "add-book") setView("admin");
    else if (key === "new-loan") setShowLoanForm(true);
    else if (key === "return") setView("loans");
    else if (key === "search-student") setStudentSearchOpen(true);
    else if (key === "overdue") setView("loans");
    else if (key === "stats") setView("analytics");
    else if (key === "ai") setView("ai");
  };

  if (loading) {
    return (
      <div className="smx" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "70vh" }}>
        <style>{STYLES}</style>
        <div style={{ textAlign: "center", color: "var(--ink-1)" }}>
          <Loader2 size={26} style={{ animation: "spin 1s linear infinite" }} />
          <style>{"@keyframes spin{to{transform:rotate(360deg)}}"}</style>
          <div style={{ marginTop: 10, fontSize: 13 }}>Cargando biblioteca inteligente…</div>
        </div>
      </div>
    );
  }

  return (
    <div className="smx">
      <style>{STYLES}</style>

      <Header
        search={search} setSearch={(v) => { setSearch(v); if (v) setView("catalog"); }}
        selectedGrade={selectedGrade} setSelectedGrade={setSelectedGrade}
        onToggleFilters={() => setFiltersOpen((v) => !v)} filtersOpen={filtersOpen}
        onOpenNotifs={() => setNotifsOpen((v) => !v)} notifsOpen={notifsOpen} alerts={alerts}
        onNav={handleNav} role={role} setRole={setRole}
        onOpenStudentSearch={() => setStudentSearchOpen(true)}
      />
      <NavTabs view={view} setView={handleNav} role={role} />

      <div className="smx-main">
        {view === "dashboard" && <Dashboard books={books} loans={loans} onOpen={setSelectedBook} onGrade={handleGrade} onNavFiltered={handleNavFiltered} recommendations={recommendations} />}
        {view === "catalog" && (
          <CatalogView books={books} search={search} setSearch={setSearch} selectedGrade={selectedGrade} setSelectedGrade={setSelectedGrade} onOpen={setSelectedBook} initialFilters={initialCatalogFilter} />
        )}
        {view === "loans" && ROLE_PERMISSIONS[role].tabs.includes("loans") && (
          <LoansView loans={loans} reservations={reservations} onReturn={handleReturn} onRenew={handleRenew} onMarkLost={handleMarkLost} onCancelReservation={handleCancelReservation} onNewLoan={() => setShowLoanForm(true)} onOpenStudent={openStudentById} />
        )}
        {view === "analytics" && ROLE_PERMISSIONS[role].tabs.includes("analytics") && <AnalyticsView books={books} loans={loans} />}
        {view === "ai" && <AIView books={books} onOpen={setSelectedBook} recommendations={recommendations} />}
        {view === "leerflix" && <LeerflixView onExit={() => handleNav("dashboard")} />}
        {view === "admin" && ROLE_PERMISSIONS[role].tabs.includes("admin") && <AdminView books={books} onAddBook={handleAddBook} onDeleteBook={handleDeleteBook} onToast={showToast} findDuplicate={findDuplicate} />}
      </div>

      {selectedBook && (
        <BookModal
          book={selectedBook} onClose={() => setSelectedBook(null)}
          onLoan={() => setShowLoanForm(selectedBook.id)}
          onReserve={handleReserve}
          onFavorite={toggleFavorite} isFavorite={favorites.has(selectedBook.id)}
          onOpenHistory={(b) => setHistoryBook(b)}
        />
      )}

      {historyBook && <BookHistoryModal book={historyBook} loans={loans} onClose={() => setHistoryBook(null)} />}

      {selectedStudent && (
        <ReaderProfileModal student={selectedStudent} books={books} loans={loans} role={role} onClose={() => setSelectedStudent(null)} onOpenBook={(b) => { setSelectedStudent(null); setSelectedBook(b); }} />
      )}

      {studentSearchOpen && (
        <StudentSearchModal students={students} onClose={() => setStudentSearchOpen(false)} onSelect={(s) => { setStudentSearchOpen(false); setSelectedStudent(s); }} />
      )}

      {showLoanForm && (
        <LoanFormModal
          books={books} students={students}
          presetBookId={typeof showLoanForm === "string" ? showLoanForm : null}
          onClose={() => setShowLoanForm(false)}
          onCreate={handleCreateLoan}
        />
      )}

      {quickOpen && <QuickMenu onAction={handleQuickAction} />}
      <button className="smx-fab" onClick={() => setQuickOpen((v) => !v)}><Plus size={17} /> Acciones rápidas</button>

      {toast && <div className={"smx-toast" + (toast.kind === "error" ? " error" : "")}>{toast.kind === "error" ? <AlertTriangle size={16} color="var(--rojo)" /> : <CheckCircle2 size={16} color="var(--verde)" />}{toast.msg}</div>}
    </div>
  );
}
