/**
 * Apps & Websites — Executive Intelligence Dashboard
 * Dedicated page showing all app/website-building tasks, grouped by category
 */

import { useEffect, useMemo, useState } from "react";
import {
  ExternalLink,
  Search,
  X,
  LayoutGrid,
  List,
  Layers,
  Globe,
  BarChart2,
  FileText,
  Wrench,
  Zap,
  Megaphone,
  Building2,
  ChevronRight,
  ArrowLeft,
  Coins,
  Calendar,
  Cpu,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Link } from "wouter";

// ─── Types ────────────────────────────────────────────────────────────────────

interface AppTask {
  num: number;
  id: string;
  title: string;
  url: string;
  status: string;
  type: string;
  agent: string;
  credits: number;
  created: string;
  category: string;
}

interface AppsData {
  total: number;
  categories: Record<string, number>;
  tasks: AppTask[];
}

// ─── Constants ────────────────────────────────────────────────────────────────

const LOGO_URL =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663449376037/6HAcW2mfRmxrM6oLjQmHt6/logo-icon-WtjLyRW8qf6yaEgLNX8XN9.webp";

const CATEGORY_CONFIG: Record<string, { icon: React.ReactNode; color: string; bg: string; border: string }> = {
  "Property Management": {
    icon: <Building2 size={16} />,
    color: "text-blue-400",
    bg: "bg-blue-400/10",
    border: "border-blue-400/25",
  },
  "Websites & Web Apps": {
    icon: <Globe size={16} />,
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
    border: "border-emerald-400/25",
  },
  "Dashboards & Analytics": {
    icon: <BarChart2 size={16} />,
    color: "text-purple-400",
    bg: "bg-purple-400/10",
    border: "border-purple-400/25",
  },
  "Documents & Templates": {
    icon: <FileText size={16} />,
    color: "text-orange-400",
    bg: "bg-orange-400/10",
    border: "border-orange-400/25",
  },
  "Apps & Tools": {
    icon: <Wrench size={16} />,
    color: "text-cyan-400",
    bg: "bg-cyan-400/10",
    border: "border-cyan-400/25",
  },
  "Automation & Scripts": {
    icon: <Zap size={16} />,
    color: "text-yellow-400",
    bg: "bg-yellow-400/10",
    border: "border-yellow-400/25",
  },
  "Marketing & Content": {
    icon: <Megaphone size={16} />,
    color: "text-pink-400",
    bg: "bg-pink-400/10",
    border: "border-pink-400/25",
  },
  "AI & Automation": {
    icon: <Layers size={16} />,
    color: "text-violet-400",
    bg: "bg-violet-400/10",
    border: "border-violet-400/25",
  },
  "Other Builds": {
    icon: <Wrench size={16} />,
    color: "text-slate-400",
    bg: "bg-slate-400/10",
    border: "border-slate-400/25",
  },
};

const STATUS_DOT: Record<string, string> = {
  stopped: "bg-emerald-400",
  running: "bg-blue-400 pulse-dot",
  waiting: "bg-amber-400 pulse-dot",
};

const AGENT_LABELS: Record<string, string> = {
  "manus-1.6": "1.6",
  "manus-1.6-lite": "1.6 Lite",
  "manus-1.6-max": "1.6 Max",
};

function formatCredits(n: number): string {
  if (n >= 1000) return (n / 1000).toFixed(1) + "k";
  return n.toString();
}

function formatDate(d: string): string {
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

// ─── App Card ─────────────────────────────────────────────────────────────────

function AppCard({ task }: { task: AppTask }) {
  const cat = CATEGORY_CONFIG[task.category] || CATEGORY_CONFIG["Other Builds"];
  const dot = STATUS_DOT[task.status] || "bg-emerald-400";

  return (
    <a
      href={task.url}
      target="_blank"
      rel="noopener noreferrer"
      className="task-card group block rounded-lg border border-border bg-card p-4 hover:border-amber-400/30 transition-all"
    >
      {/* Category badge */}
      <div className="flex items-center justify-between mb-3">
        <span
          className={`inline-flex items-center gap-1.5 text-[10px] px-2 py-1 rounded-md border font-semibold ${cat.color} ${cat.bg} ${cat.border}`}
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          {cat.icon}
          {task.category}
        </span>
        <ExternalLink
          size={13}
          className="text-muted-foreground/30 group-hover:text-amber-400 transition-colors"
        />
      </div>

      {/* Title */}
      <h3
        className="text-sm font-semibold text-foreground leading-snug group-hover:text-amber-400 transition-colors line-clamp-2 mb-3"
        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
      >
        {task.title}
      </h3>

      {/* Meta */}
      <div className="flex items-center gap-3 text-[11px] text-muted-foreground flex-wrap">
        <span className="flex items-center gap-1">
          <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
          <span className="capitalize">{task.status === "stopped" ? "Done" : task.status}</span>
        </span>
        <span className="flex items-center gap-1">
          <Coins size={10} />
          <span style={{ fontFamily: "'JetBrains Mono', monospace" }} className={task.credits > 500 ? "text-amber-400/70" : ""}>
            {formatCredits(task.credits)}
          </span>
        </span>
        <span className="flex items-center gap-1">
          <Calendar size={10} />
          {formatDate(task.created)}
        </span>
      </div>
    </a>
  );
}

// ─── App Row (list view) ──────────────────────────────────────────────────────

function AppRow({ task }: { task: AppTask }) {
  const cat = CATEGORY_CONFIG[task.category] || CATEGORY_CONFIG["Other Builds"];
  const dot = STATUS_DOT[task.status] || "bg-emerald-400";

  return (
    <tr className="border-b border-border/50 hover:bg-card/60 transition-colors group">
      <td className="px-4 py-3">
        <span
          className={`inline-flex items-center gap-1.5 text-[10px] px-2 py-0.5 rounded border font-semibold ${cat.color} ${cat.bg} ${cat.border}`}
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          {cat.icon}
          {task.category}
        </span>
      </td>
      <td className="px-4 py-3 max-w-sm">
        <a
          href={task.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium text-foreground hover:text-amber-400 transition-colors flex items-center gap-1.5 group/link"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          <span className="line-clamp-1">{task.title}</span>
          <ExternalLink size={11} className="opacity-0 group-hover/link:opacity-100 transition-opacity shrink-0" />
        </a>
      </td>
      <td className="px-4 py-3">
        <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
          <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
          {task.status === "stopped" ? "Done" : task.status}
        </span>
      </td>
      <td className="px-4 py-3 text-[11px] font-mono text-muted-foreground">{AGENT_LABELS[task.agent] || task.agent}</td>
      <td className="px-4 py-3 text-right text-[11px] font-mono text-foreground">{formatCredits(task.credits)}</td>
      <td className="px-4 py-3 text-[11px] text-muted-foreground">{formatDate(task.created)}</td>
    </tr>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Apps() {
  const [data, setData] = useState<AppsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  useEffect(() => {
    fetch("/apps_websites.json")
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    if (!data) return [];
    return data.tasks.filter((t) => {
      if (activeCategory && t.category !== activeCategory) return false;
      if (search) {
        const q = search.toLowerCase();
        if (!t.title.toLowerCase().includes(q) && !t.category.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [data, activeCategory, search]);

  // Sorted categories by count
  const sortedCategories = useMemo(() => {
    if (!data) return [];
    return Object.entries(data.categories).sort(([, a], [, b]) => b - a);
  }, [data]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <img src={LOGO_URL} alt="Logo" className="w-10 h-10 mx-auto mb-3 opacity-70" />
          <div className="text-sm text-muted-foreground" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Loading...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* ── Sidebar ── */}
      <aside
        className="w-60 shrink-0 border-r border-border flex flex-col sticky top-0 h-screen overflow-y-auto"
        style={{ background: "var(--sidebar)" }}
      >
        {/* Brand */}
        <div className="px-4 py-4 border-b border-border">
          <div className="flex items-center gap-2.5 mb-1">
            <div
              className="w-8 h-8 rounded-md flex items-center justify-center"
              style={{ background: "oklch(0.78 0.16 75 / 15%)", border: "1px solid oklch(0.78 0.16 75 / 30%)" }}
            >
              <img src={LOGO_URL} alt="Logo" className="w-5 h-5" />
            </div>
            <div>
              <div
                className="text-sm font-bold leading-none"
                style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.78 0.16 75)" }}
              >
                TASK INTEL
              </div>
              <div className="text-[10px] text-muted-foreground mt-0.5 tracking-wide">
                ApartmentCorp · Brandon
              </div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <div className="px-3 py-3 border-b border-border">
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-2 rounded-md text-xs text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            <ArrowLeft size={13} />
            All Tasks
          </Link>
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-md text-xs font-semibold text-amber-400 bg-amber-400/10 border border-amber-400/20 mt-1"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            <Globe size={13} />
            Apps & Websites
          </div>
        </div>

        {/* Category filters */}
        <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <div
            className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest px-1 mb-2"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Categories
          </div>

          {/* All */}
          <button
            onClick={() => setActiveCategory(null)}
            className={`flex items-center gap-2 px-3 py-2 rounded-md text-xs font-medium border transition-all w-full text-left ${
              !activeCategory
                ? "bg-amber-400/15 border-amber-400/40 text-amber-400"
                : "bg-transparent border-border text-muted-foreground hover:text-foreground"
            }`}
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            <Layers size={12} />
            <span className="flex-1">All Builds</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${!activeCategory ? "bg-amber-400/20 text-amber-300" : "bg-muted text-muted-foreground"}`}>
              {data?.total}
            </span>
          </button>

          {sortedCategories.map(([cat, count]) => {
            const cfg = CATEGORY_CONFIG[cat] || CATEGORY_CONFIG["Other Builds"];
            const active = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(active ? null : cat)}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-xs font-medium border transition-all w-full text-left ${
                  active
                    ? `${cfg.bg} ${cfg.border} ${cfg.color}`
                    : "bg-transparent border-border text-muted-foreground hover:text-foreground"
                }`}
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                <span className={active ? cfg.color : "text-muted-foreground"}>{cfg.icon}</span>
                <span className="flex-1 text-left leading-tight">{cat}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono shrink-0 ${active ? `${cfg.bg} ${cfg.color}` : "bg-muted text-muted-foreground"}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="flex-1 min-w-0 flex flex-col">
        {/* Top bar */}
        <div
          className="sticky top-0 z-10 border-b px-6 py-3 flex items-center gap-4"
          style={{
            background: "oklch(0.13 0.015 260 / 96%)",
            backdropFilter: "blur(16px)",
            borderBottom: "1px solid oklch(0.78 0.16 75 / 15%)",
          }}
        >
          <div className="flex items-center gap-2">
            <Globe size={16} className="text-amber-400" />
            <h1
              className="text-sm font-bold text-foreground"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Apps & Websites
            </h1>
            {activeCategory && (
              <>
                <ChevronRight size={13} className="text-muted-foreground" />
                <span className="text-sm text-muted-foreground" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  {activeCategory}
                </span>
              </>
            )}
          </div>

          <div className="relative flex-1 max-w-md ml-4">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search builds..."
              className="pl-8 h-8 bg-card border-border text-sm placeholder:text-muted-foreground focus-visible:ring-amber-400/40"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                <X size={12} />
              </button>
            )}
          </div>

          {/* View toggle */}
          <div className="flex items-center gap-1 bg-card border border-border rounded-md p-0.5 ml-auto">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded transition-colors ${viewMode === "grid" ? "bg-amber-400/20 text-amber-400" : "text-muted-foreground hover:text-foreground"}`}
            >
              <LayoutGrid size={13} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded transition-colors ${viewMode === "list" ? "bg-amber-400/20 text-amber-400" : "text-muted-foreground hover:text-foreground"}`}
            >
              <List size={13} />
            </button>
          </div>

          <div className="text-xs text-muted-foreground shrink-0" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            <span className="text-foreground font-medium">{filtered.length}</span> builds
          </div>
        </div>

        <div className="flex-1 px-6 py-5">
          {/* Category summary cards */}
          {!activeCategory && !search && (
            <div className="grid grid-cols-4 gap-3 mb-6">
              {sortedCategories.slice(0, 4).map(([cat, count]) => {
                const cfg = CATEGORY_CONFIG[cat] || CATEGORY_CONFIG["Other Builds"];
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`rounded-lg p-4 border text-left transition-all hover:scale-[1.02] ${cfg.bg} ${cfg.border}`}
                  >
                    <div className={`mb-2 ${cfg.color}`}>{cfg.icon}</div>
                    <div
                      className="text-xl font-bold text-foreground"
                      style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: "-0.02em" }}
                    >
                      {count}
                    </div>
                    <div className="text-[11px] text-muted-foreground mt-0.5" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                      {cat}
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* Grid view */}
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {filtered.map((task) => (
                <div key={task.id} className="fade-slide-in">
                  <AppCard task={task} />
                </div>
              ))}
            </div>
          ) : (
            /* List view */
            <div className="rounded-lg border border-border overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-card/50">
                    {["Category", "Title", "Status", "Agent", "Credits", "Created"].map((h) => (
                      <th
                        key={h}
                        className="text-left px-4 py-2.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider"
                        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((task) => (
                    <AppRow key={task.id} task={task} />
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Globe size={32} className="text-muted-foreground mb-3 opacity-30" />
              <div className="text-sm text-muted-foreground" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                No builds match your filters
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-border px-6 py-3 flex items-center justify-between">
          <div className="text-[11px] text-muted-foreground" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            {data?.total} builds identified from 635 tasks
          </div>
          <div className="text-[11px] text-muted-foreground flex items-center gap-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            <img src={LOGO_URL} alt="" className="w-3.5 h-3.5 opacity-50" />
            Manus Task Archive
          </div>
        </div>
      </main>
    </div>
  );
}
