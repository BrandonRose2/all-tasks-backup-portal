/*
 * Manus Task Dashboard — Executive Intelligence Dashboard
 * Design: Deep slate + amber gold, Space Grotesk display font
 * Layout: Fixed left sidebar (filters/stats) + main content (search + task grid)
 */

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  Search,
  ExternalLink,
  Zap,
  CheckCircle2,
  Clock,
  Play,
  Filter,
  X,
  ChevronDown,
  ChevronUp,
  LayoutGrid,
  List,
  Calendar,
  Cpu,
  Coins,
  Hash,
  Globe,
  Lock,
  MessageSquare,
  Tag,
  User,
  Download,
  GitBranch,
  Shield,
  Mic,
} from "lucide-react";
import { Link } from "wouter";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function downloadTaskJson(task: Task) {
  const blob = new Blob([JSON.stringify(task, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  const safeName = task.title.replace(/[^a-z0-9]/gi, "_").slice(0, 60);
  a.download = `task_${String(task.num).padStart(4, "0")}_${safeName}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface Task {
  num: number;
  title: string;
  url: string;
  status: "stopped" | "running" | "waiting" | string;
  type: "standard" | "project" | "agent_subtask" | string;
  agent: string;
  credits: number;
  created: string;
  messages: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<string, { label: string; color: string; dot: string; icon: React.ReactNode }> = {
  stopped: {
    label: "Completed",
    color: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
    dot: "bg-emerald-400",
    icon: <CheckCircle2 size={11} />,
  },
  running: {
    label: "Running",
    color: "text-blue-400 bg-blue-400/10 border-blue-400/20",
    dot: "bg-blue-400 pulse-dot",
    icon: <Play size={11} />,
  },
  waiting: {
    label: "Waiting",
    color: "text-amber-400 bg-amber-400/10 border-amber-400/20",
    dot: "bg-amber-400 pulse-dot",
    icon: <Clock size={11} />,
  },
};

const TYPE_LABELS: Record<string, string> = {
  standard: "Standard",
  project: "Project",
  agent_subtask: "Subtask",
};

const AGENT_LABELS: Record<string, string> = {
  "manus-1.6": "Manus 1.6",
  "manus-1.6-lite": "1.6 Lite",
  "manus-1.6-max": "1.6 Max",
};

const LOGO_URL = "https://d2xsxph8kpxj0f.cloudfront.net/310519663449376037/6HAcW2mfRmxrM6oLjQmHt6/logo-icon-WtjLyRW8qf6yaEgLNX8XN9.webp";
const SESSION_KEY = "task_intel_unlocked";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatCredits(n: number): string {
  if (n >= 1000) return (n / 1000).toFixed(1) + "k";
  return n.toString();
}

function formatDate(d: string): string {
  const date = new Date(d);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function isSubtask(task: Task): boolean {
  return task.title === "Wide Research Subtask" || task.type === "agent_subtask";
}

// ─── Task Detail Panel ────────────────────────────────────────────────────────

function TaskDetailPanel({
  task,
  open,
  onClose,
}: {
  task: Task | null;
  open: boolean;
  onClose: () => void;
}) {
  if (!task) return null;
  const status = STATUS_CONFIG[task.status] || STATUS_CONFIG.stopped;
  const subtask = isSubtask(task);

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md border-l border-border overflow-y-auto"
        style={{ background: "var(--sidebar)", fontFamily: "'Space Grotesk', sans-serif" }}
      >
        <SheetHeader className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <span
              className={`inline-flex items-center gap-1 text-[10px] px-2 py-1 rounded border font-medium ${status.color}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
              {status.label}
            </span>
            {task.type === "project" && (
              <span className="text-[10px] px-2 py-1 rounded border text-purple-400 bg-purple-400/10 border-purple-400/20 font-semibold">
                Project
              </span>
            )}
            {subtask && (
              <span className="text-[10px] px-2 py-1 rounded border text-muted-foreground bg-muted/30 border-border font-semibold">
                Subtask
              </span>
            )}
            {task.credits > 1000 && (
              <span className="text-[10px] px-2 py-1 rounded border text-amber-400 bg-amber-400/10 border-amber-400/20 font-semibold">
                ★ High Value
              </span>
            )}
          </div>
          <SheetTitle
            className="text-base font-bold leading-snug text-foreground"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            {task.title}
          </SheetTitle>
        </SheetHeader>

        {/* Metadata grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="rounded-lg bg-card border border-border p-3">
            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground uppercase tracking-widest mb-1.5">
              <Hash size={10} /> Task #
            </div>
            <div className="text-lg font-bold text-amber-400 font-mono">{task.num}</div>
          </div>
          <div className="rounded-lg bg-card border border-border p-3">
            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground uppercase tracking-widest mb-1.5">
              <Coins size={10} /> Credits
            </div>
            <div className={`text-lg font-bold font-mono ${task.credits > 500 ? "text-amber-400" : "text-foreground"}`}>
              {task.credits.toLocaleString()}
            </div>
          </div>
          <div className="rounded-lg bg-card border border-border p-3">
            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground uppercase tracking-widest mb-1.5">
              <MessageSquare size={10} /> Messages
            </div>
            <div className="text-lg font-bold text-foreground font-mono">{task.messages}</div>
          </div>
          <div className="rounded-lg bg-card border border-border p-3">
            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground uppercase tracking-widest mb-1.5">
              <Calendar size={10} /> Created
            </div>
            <div className="text-xs font-medium text-foreground mt-1">{formatDate(task.created)}</div>
          </div>
        </div>

        {/* Details list */}
        <div className="space-y-3 mb-6">
          <div className="rounded-lg bg-card border border-border p-3 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Tag size={12} />
              <span>Type</span>
            </div>
            <span className="text-xs font-semibold text-foreground">
              {TYPE_LABELS[task.type] || task.type}
            </span>
          </div>
          <div className="rounded-lg bg-card border border-border p-3 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Cpu size={12} />
              <span>Agent</span>
            </div>
            <span className="text-xs font-semibold text-foreground font-mono">
              {AGENT_LABELS[task.agent] || task.agent}
            </span>
          </div>
          <div className="rounded-lg bg-card border border-border p-3 flex items-start justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-muted-foreground shrink-0">
              <ExternalLink size={12} />
              <span>Task URL</span>
            </div>
            <a
              href={task.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] text-amber-400 hover:text-amber-300 underline underline-offset-2 break-all text-right transition-colors"
            >
              Open in Manus →
            </a>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2">
          <a
            href={task.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 flex-1 py-2.5 rounded-lg border text-sm font-semibold transition-all duration-150"
            style={{
              background: "oklch(0.78 0.16 75 / 15%)",
              borderColor: "oklch(0.78 0.16 75 / 40%)",
              color: "oklch(0.78 0.16 75)",
            }}
          >
            <ExternalLink size={14} />
            Open in Manus
          </a>
          <button
            onClick={() => downloadTaskJson(task)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-semibold transition-all duration-150"
            style={{
              background: "oklch(0.55 0.15 250 / 15%)",
              borderColor: "oklch(0.55 0.15 250 / 40%)",
              color: "oklch(0.75 0.12 250)",
            }}
            title="Download task data as JSON"
          >
            <Download size={14} />
            JSON
          </button>
        </div>

        <div className="mt-4 text-[10px] text-muted-foreground/50 text-center">
          Task ID: {task.url.split("/").pop() || task.num}
        </div>
      </SheetContent>
    </Sheet>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatCard({
  icon,
  label,
  value,
  sub,
  amber,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  sub?: string;
  amber?: boolean;
}) {
  return (
    <div
      className={`rounded-lg p-4 border flex flex-col gap-1 ${
        amber
          ? "amber-card"
          : "bg-card border-border"
      }`}
    >
      <div className="flex items-center gap-2 mb-1">
        <span className={amber ? "text-amber-400" : "text-amber-400/50"}>{icon}</span>
        <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          {label}
        </span>
      </div>
      <div
        className={`text-3xl font-bold count-animate ${amber ? "text-amber-400" : "text-foreground"}`}
        style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: "-0.02em" }}
      >
        {value}
      </div>
      {sub && <div className="text-[11px] text-muted-foreground mt-0.5">{sub}</div>}
    </div>
  );
}

function FilterChip({
  label,
  active,
  count,
  onClick,
  color,
}: {
  label: string;
  active: boolean;
  count: number;
  onClick: () => void;
  color?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium border transition-all duration-150 w-full text-left ${
        active
          ? color || "bg-amber-400/15 border-amber-400/40 text-amber-400"
          : "bg-transparent border-border text-muted-foreground hover:border-border/80 hover:text-foreground"
      }`}
      style={{ fontFamily: "'Space Grotesk', sans-serif" }}
    >
      <span className="flex-1">{label}</span>
      <span
        className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
          active ? "bg-amber-400/20 text-amber-300" : "bg-muted text-muted-foreground"
        }`}
      >
        {count}
      </span>
    </button>
  );
}

function TaskCard({
  task,
  index,
  onClick,
}: {
  task: Task;
  index: number;
  onClick: () => void;
}) {
  const status = STATUS_CONFIG[task.status] || STATUS_CONFIG.stopped;
  const subtask = isSubtask(task);

  // Subtasks get a stripped-down, visually recessed treatment
  if (subtask) {
    return (
      <div
        onClick={onClick}
        className="task-card block rounded border border-border/30 bg-card/30 px-3 py-2 group cursor-pointer"
        style={{ animationDelay: `${Math.min(index * 20, 400)}ms` }}
      >
        <div className="flex items-center justify-between gap-2">
          <span className="text-[11px] text-muted-foreground/60 font-mono truncate flex-1">
            ↳ Wide Research Subtask
          </span>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[10px] font-mono text-muted-foreground/40">{formatCredits(task.credits)} cr</span>
            <ExternalLink size={10} className="text-muted-foreground/30 group-hover:text-muted-foreground transition-colors" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className="task-card block rounded-lg border border-border bg-card p-4 group cursor-pointer hover:border-amber-400/30 transition-colors duration-150"
      style={{ animationDelay: `${Math.min(index * 20, 400)}ms` }}
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1.5">
            <span
              className={`inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded border font-medium ${status.color}`}
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
              {status.label}
            </span>
            {task.type === "project" && (
              <span className="text-[10px] px-1.5 py-0.5 rounded border text-purple-400 bg-purple-400/10 border-purple-400/20 font-semibold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Project
              </span>
            )}
            {task.credits > 1000 && (
              <span className="text-[10px] px-1.5 py-0.5 rounded border text-amber-400 bg-amber-400/10 border-amber-400/20 font-semibold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                ★ High Value
              </span>
            )}
          </div>
          <h3
            className="text-sm font-semibold text-foreground leading-snug group-hover:text-amber-400 transition-colors duration-150 line-clamp-2"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            {task.title}
          </h3>
        </div>
        <div className="flex items-center gap-1.5 shrink-0 mt-0.5">
          <button
            onClick={(e) => { e.stopPropagation(); downloadTaskJson(task); }}
            title="Download task as JSON"
            className="p-1 rounded text-muted-foreground/40 hover:text-amber-400 hover:bg-amber-400/10 transition-all duration-150"
          >
            <Download size={13} />
          </button>
          <ExternalLink
            size={14}
            className="text-muted-foreground/40 group-hover:text-amber-400 transition-colors duration-150"
          />
        </div>
      </div>

      {/* Meta row */}
      <div className="flex items-center gap-3 text-[11px] text-muted-foreground flex-wrap">
        <span className="flex items-center gap-1">
          <Cpu size={10} />
          <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            {AGENT_LABELS[task.agent] || task.agent}
          </span>
        </span>
        <span className={`flex items-center gap-1 ${task.credits > 500 ? "text-amber-400/70" : ""}`}>
          <Coins size={10} />
          <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            {formatCredits(task.credits)}
          </span>
        </span>
        <span className="flex items-center gap-1">
          <Calendar size={10} />
          <span>{formatDate(task.created)}</span>
        </span>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [agentFilter, setAgentFilter] = useState<string | null>(null);
  const [hideSubtasks, setHideSubtasks] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "credits">("newest");
  const [showChart, setShowChart] = useState(true);
  const searchRef = useRef<HTMLInputElement>(null);
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 60;

  // Detail panel state
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  function openDetail(task: Task) {
    setSelectedTask(task);
    setDetailOpen(true);
  }

  function closeDetail() {
    setDetailOpen(false);
  }

  // Lock function — clears session and reloads
  function lockDashboard() {
    sessionStorage.removeItem(SESSION_KEY);
    window.location.reload();
  }

  // Load data
  useEffect(() => {
    fetch("/tasks_data.json")
      .then((r) => r.json())
      .then((data: { tasks?: Task[] } | Task[]) => {
        // Handle both {tasks: [...]} and plain array formats
        const taskList = Array.isArray(data) ? data : (data as { tasks?: Task[] }).tasks ?? [];
        setTasks(taskList);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 200);
    return () => clearTimeout(t);
  }, [search]);

  // Reset page on filter change
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, statusFilter, typeFilter, agentFilter, hideSubtasks, sortBy]);

  // Keyboard shortcut: Cmd/Ctrl+K to focus search
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // Stats
  const stats = useMemo(() => {
    const t = Array.isArray(tasks) ? tasks : [];
    const totalCredits = t.reduce((s, x) => s + x.credits, 0);
    const stopped = t.filter((x) => x.status === "stopped").length;
    const waiting = t.filter((x) => x.status === "waiting").length;
    const running = t.filter((x) => x.status === "running").length;
    const projects = t.filter((x) => x.type === "project").length;
    return { totalCredits, stopped, waiting, running, projects };
  }, [tasks]);

  // Filter counts
  const counts = useMemo(() => {
    const safeTasks2 = Array.isArray(tasks) ? tasks : [];
    const base = safeTasks2.filter((t) => {
      if (hideSubtasks && isSubtask(t)) return false;
      if (debouncedSearch) {
        const q = debouncedSearch.toLowerCase();
        if (!t.title.toLowerCase().includes(q)) return false;
      }
      return true;
    });
    return {
      status: {
        stopped: base.filter((t) => t.status === "stopped").length,
        running: base.filter((t) => t.status === "running").length,
        waiting: base.filter((t) => t.status === "waiting").length,
      },
      type: {
        standard: base.filter((t) => t.type === "standard").length,
        project: base.filter((t) => t.type === "project").length,
        agent_subtask: base.filter((t) => t.type === "agent_subtask").length,
      },
      agent: {
        "manus-1.6": base.filter((t) => t.agent === "manus-1.6").length,
        "manus-1.6-lite": base.filter((t) => t.agent === "manus-1.6-lite").length,
        "manus-1.6-max": base.filter((t) => t.agent === "manus-1.6-max").length,
      },
    };
  }, [tasks, debouncedSearch, hideSubtasks]);

  // Filtered + sorted tasks
  const filtered = useMemo(() => {
    let result = (Array.isArray(tasks) ? tasks : []).filter((t) => {
      if (hideSubtasks && isSubtask(t)) return false;
      if (debouncedSearch) {
        const q = debouncedSearch.toLowerCase();
        if (!t.title.toLowerCase().includes(q)) return false;
      }
      if (statusFilter && t.status !== statusFilter) return false;
      if (typeFilter && t.type !== typeFilter) return false;
      if (agentFilter && t.agent !== agentFilter) return false;
      return true;
    });
    if (sortBy === "newest") result = result.sort((a, b) => b.num - a.num);
    else if (sortBy === "oldest") result = result.sort((a, b) => a.num - b.num);
    else if (sortBy === "credits") result = result.sort((a, b) => b.credits - a.credits);
    return result;
  }, [tasks, debouncedSearch, statusFilter, typeFilter, agentFilter, hideSubtasks, sortBy]);

  const safeTasks = Array.isArray(tasks) ? tasks : [];
  const safeFiltered = Array.isArray(filtered) ? filtered : [];
  const paginated = safeFiltered.slice(0, page * PAGE_SIZE);
  const hasMore = paginated.length < safeFiltered.length;

  // Chart data — tasks by month
  const chartData = useMemo(() => {
    const byMonth: Record<string, number> = {};
    (Array.isArray(tasks) ? tasks : []).forEach((t) => {
      const m = t.created.slice(0, 7); // YYYY-MM
      byMonth[m] = (byMonth[m] || 0) + 1;
    });
    return Object.entries(byMonth)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-8)
      .map(([month, count]) => ({
        month: new Date(month + "-01").toLocaleDateString("en-US", { month: "short", year: "2-digit" }),
        count,
      }));
  }, [tasks]);

  const activeFilters = [statusFilter, typeFilter, agentFilter].filter(Boolean).length + (hideSubtasks ? 1 : 0);

  function clearAllFilters() {
    setStatusFilter(null);
    setTypeFilter(null);
    setAgentFilter(null);
    setHideSubtasks(false);
    setSearch("");
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <img src={LOGO_URL} alt="Logo" className="w-12 h-12 mx-auto mb-4 opacity-80" />
          <div className="text-muted-foreground text-sm" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Loading task data...
          </div>
        </div>
      </div>
    );
  }

  // Safe aliases used throughout render
  const displayTasks = safeTasks;
  const displayFiltered = safeFiltered;

  return (
    <div className="min-h-screen bg-background flex">
      {/* ── Sidebar ── */}
      <aside className="w-60 shrink-0 border-r border-border flex flex-col sticky top-0 h-screen overflow-y-auto"
        style={{ background: "var(--sidebar)" }}>
        {/* Brand */}
        <div className="px-4 py-4 border-b border-border">
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-8 h-8 rounded-md flex items-center justify-center" style={{ background: "oklch(0.78 0.16 75 / 15%)", border: "1px solid oklch(0.78 0.16 75 / 30%)" }}>
              <img src={LOGO_URL} alt="Logo" className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold leading-none" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.78 0.16 75)" }}>
                TASK INTEL
              </div>
              <div className="text-[10px] text-muted-foreground mt-0.5 tracking-wide">ApartmentCorp · Brandon</div>
            </div>
          </div>
          <div className="mt-2 text-[10px] text-muted-foreground/60 font-mono">Backup: 2026-06-18</div>
        </div>

        {/* Navigation */}
        <div className="px-3 py-2 border-b border-border space-y-1">
          <div className="flex items-center gap-2 px-3 py-2 rounded-md text-xs font-semibold text-amber-400 bg-amber-400/10 border border-amber-400/20"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            <Hash size={13} />
            All Tasks
          </div>
          <Link
            href="/apps"
            className="flex items-center gap-2 px-3 py-2 rounded-md text-xs text-muted-foreground hover:text-foreground hover:bg-accent transition-colors border border-transparent"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            <Globe size={13} />
            Apps &amp; Websites
            <span className="ml-auto text-[10px] bg-muted px-1.5 py-0.5 rounded font-mono text-muted-foreground">42</span>
          </Link>
          <Link
            href="/github"
            className="flex items-center gap-2 px-3 py-2 rounded-md text-xs text-muted-foreground hover:text-foreground hover:bg-accent transition-colors border border-transparent"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            <GitBranch size={13} />
            GitHub Repos
          </Link>
          <a
            href="https://drive.google.com/drive/folders/1Gxg3gg06CVLO-F05kke5CXvdXgVXSPsP"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-2 rounded-md text-xs text-muted-foreground hover:text-foreground hover:bg-accent transition-colors border border-transparent"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            <Mic size={13} />
            Ai Recordings
            <span className="ml-auto text-[10px] bg-muted px-1.5 py-0.5 rounded font-mono text-muted-foreground">Drive</span>
          </a>
          <Link
            href="/admin"
            className="flex items-center gap-2 px-3 py-2 rounded-md text-xs text-muted-foreground hover:text-foreground hover:bg-accent transition-colors border border-transparent"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            <Shield size={13} />
            Admin
          </Link>
        </div>

        {/* Quick stats */}
        <div className="px-3 py-4 border-b border-border space-y-2">
          <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest px-1 mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Overview
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-md bg-card border border-border p-2.5 text-center">
              <div className="text-lg font-bold text-amber-400" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {safeTasks.length}
              </div>
              <div className="text-[10px] text-muted-foreground">Total Tasks</div>
            </div>
            <div className="rounded-md bg-card border border-border p-2.5 text-center">
              <div className="text-lg font-bold text-amber-400" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {formatCredits(stats.totalCredits)}
              </div>
              <div className="text-[10px] text-muted-foreground">Credits Used</div>
            </div>
            <div className="rounded-md bg-card border border-border p-2.5 text-center">
              <div className="text-lg font-bold text-emerald-400" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {stats.stopped}
              </div>
              <div className="text-[10px] text-muted-foreground">Completed</div>
            </div>
            <div className="rounded-md bg-card border border-border p-2.5 text-center">
              <div className="text-lg font-bold text-purple-400" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {stats.projects}
              </div>
              <div className="text-[10px] text-muted-foreground">Projects</div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex-1 px-3 py-4 space-y-5 overflow-y-auto">
          {/* Status */}
          <div>
            <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest px-1 mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Status
            </div>
            <div className="space-y-1">
              <FilterChip
                label="Completed"
                active={statusFilter === "stopped"}
                count={counts.status.stopped}
                onClick={() => setStatusFilter(statusFilter === "stopped" ? null : "stopped")}
                color="bg-emerald-400/15 border-emerald-400/40 text-emerald-400"
              />
              <FilterChip
                label="Waiting"
                active={statusFilter === "waiting"}
                count={counts.status.waiting}
                onClick={() => setStatusFilter(statusFilter === "waiting" ? null : "waiting")}
                color="bg-amber-400/15 border-amber-400/40 text-amber-400"
              />
              <FilterChip
                label="Running"
                active={statusFilter === "running"}
                count={counts.status.running}
                onClick={() => setStatusFilter(statusFilter === "running" ? null : "running")}
                color="bg-blue-400/15 border-blue-400/40 text-blue-400"
              />
            </div>
          </div>

          {/* Type */}
          <div>
            <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest px-1 mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Task Type
            </div>
            <div className="space-y-1">
              {(["standard", "project", "agent_subtask"] as const).map((type) => (
                <FilterChip
                  key={type}
                  label={TYPE_LABELS[type]}
                  active={typeFilter === type}
                  count={counts.type[type]}
                  onClick={() => setTypeFilter(typeFilter === type ? null : type)}
                />
              ))}
            </div>
          </div>

          {/* Agent */}
          <div>
            <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest px-1 mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Agent Profile
            </div>
            <div className="space-y-1">
              {(["manus-1.6", "manus-1.6-lite", "manus-1.6-max"] as const).map((agent) => (
                <FilterChip
                  key={agent}
                  label={AGENT_LABELS[agent]}
                  active={agentFilter === agent}
                  count={counts.agent[agent]}
                  onClick={() => setAgentFilter(agentFilter === agent ? null : agent)}
                />
              ))}
            </div>
          </div>

          {/* Hide subtasks toggle */}
          <div>
            <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest px-1 mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Options
            </div>
            <button
              onClick={() => setHideSubtasks(!hideSubtasks)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium border transition-all duration-150 w-full text-left ${
                hideSubtasks
                  ? "bg-amber-400/15 border-amber-400/40 text-amber-400"
                  : "bg-transparent border-border text-muted-foreground hover:text-foreground"
              }`}
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              <span className={`w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0 ${hideSubtasks ? "bg-amber-400 border-amber-400" : "border-muted-foreground"}`}>
                {hideSubtasks && <span className="text-[8px] text-black font-bold">✓</span>}
              </span>
              Hide Research Subtasks
            </button>
          </div>
        </div>

        {/* Clear filters */}
        {activeFilters > 0 && (
          <div className="px-3 py-3 border-t border-border">
            <button
              onClick={clearAllFilters}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors w-full"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              <X size={12} />
              Clear all filters
              <span className="ml-auto text-[10px] bg-muted px-1.5 py-0.5 rounded font-mono">{activeFilters}</span>
            </button>
          </div>
        )}

        {/* Lock button */}
        <div className="px-3 py-3 border-t border-border">
          <button
            onClick={lockDashboard}
            className="flex items-center gap-2 px-3 py-2 rounded-md text-xs font-medium border border-border/50 text-muted-foreground hover:text-red-400 hover:border-red-400/30 hover:bg-red-400/5 transition-all duration-150 w-full"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            <Lock size={12} />
            Lock Dashboard
          </button>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main className="flex-1 min-w-0 flex flex-col">
        {/* Top bar */}
        <div className="sticky top-0 z-10 border-b border-border px-6 py-3 flex items-center gap-4"
          style={{ background: "oklch(0.13 0.015 260 / 96%)", backdropFilter: "blur(16px)", borderBottom: "1px solid oklch(0.78 0.16 75 / 15%)" }}>
          {/* Search */}
          <div className="relative flex-1 max-w-xl">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              ref={searchRef}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tasks… (⌘K)"
              className="pl-9 pr-8 h-9 bg-card border-border text-sm placeholder:text-muted-foreground focus-visible:ring-amber-400/40"
              style={{ fontFamily: "'Inter', sans-serif" }}
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X size={13} />
              </button>
            )}
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="h-9 px-3 rounded-md border border-border bg-card text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-amber-400/40"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="credits">Most Credits</option>
          </select>

          {/* View toggle */}
          <div className="flex items-center gap-1 bg-card border border-border rounded-md p-0.5">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded transition-colors ${viewMode === "grid" ? "bg-amber-400/20 text-amber-400" : "text-muted-foreground hover:text-foreground"}`}
            >
              <LayoutGrid size={14} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded transition-colors ${viewMode === "list" ? "bg-amber-400/20 text-amber-400" : "text-muted-foreground hover:text-foreground"}`}
            >
              <List size={14} />
            </button>
          </div>

          {/* Result count */}
            <div className="text-xs text-muted-foreground shrink-0" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            <span className="text-foreground font-medium">{displayFiltered.length}</span> / {safeTasks.length}
          </div>
        </div>

        <div className="flex-1 px-6 py-5">
          {/* Stats row */}
          <div className="grid grid-cols-4 gap-3 mb-5">
            <StatCard icon={<Zap size={14} />} label="Total Tasks" value={safeTasks.length} sub="All time" amber />
            <StatCard icon={<Coins size={14} />} label="Credits Used" value={formatCredits(stats.totalCredits)} sub="Across all tasks" />
            <StatCard icon={<CheckCircle2 size={14} />} label="Completed" value={stats.stopped} sub={`${safeTasks.length > 0 ? Math.round((stats.stopped / safeTasks.length) * 100) : 0}% completion rate`} />
            <StatCard icon={<Clock size={14} />} label="Awaiting" value={stats.waiting} sub={`${stats.running} currently running`} />
          </div>

          {/* Activity chart — compact executive strip */}
          <div className="rounded-lg border border-border bg-card mb-6 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-border/50">
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-foreground" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  Task Activity
                </span>
                <span className="text-[10px] text-muted-foreground font-mono">Last 8 months</span>
              </div>
              <button
                onClick={() => setShowChart(!showChart)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {showChart ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
              </button>
            </div>
            {showChart && (
              <div className="px-4 pt-2 pb-3">
                <ResponsiveContainer width="100%" height={80}>
                  <BarChart data={chartData} barSize={16} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                    <XAxis
                      dataKey="month"
                      tick={{ fill: "oklch(0.45 0.010 260)", fontSize: 9, fontFamily: "'JetBrains Mono', monospace" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis hide />
                    <Tooltip
                      contentStyle={{
                        background: "oklch(0.20 0.012 260)",
                        border: "1px solid oklch(0.78 0.16 75 / 30%)",
                        borderRadius: "6px",
                        fontSize: "11px",
                        fontFamily: "'Space Grotesk', sans-serif",
                        color: "oklch(0.92 0.008 260)",
                      }}
                      cursor={{ fill: "oklch(0.78 0.16 75 / 5%)" }}
                      formatter={(v: number) => [`${v} tasks`, ""]}
                    />
                    <Bar dataKey="count" radius={[2, 2, 0, 0]}>
                      {chartData.map((_, i) => (
                        <Cell
                          key={i}
                          fill={i === chartData.length - 1 ? "oklch(0.78 0.16 75)" : "oklch(0.28 0.018 260)"}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* Active filter pills */}
          {(activeFilters > 0 || debouncedSearch) && (
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Filter size={11} /> Active filters:
              </span>
              {debouncedSearch && (
                <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-400">
                  "{debouncedSearch}"
                  <button onClick={() => setSearch("")}><X size={10} /></button>
                </span>
              )}
              {statusFilter && (
                <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-emerald-400/15 border border-emerald-400/30 text-emerald-400">
                  {STATUS_CONFIG[statusFilter]?.label}
                  <button onClick={() => setStatusFilter(null)}><X size={10} /></button>
                </span>
              )}
              {typeFilter && (
                <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-purple-400/15 border border-purple-400/30 text-purple-400">
                  {TYPE_LABELS[typeFilter]}
                  <button onClick={() => setTypeFilter(null)}><X size={10} /></button>
                </span>
              )}
              {agentFilter && (
                <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-blue-400/15 border border-blue-400/30 text-blue-400">
                  {AGENT_LABELS[agentFilter] || agentFilter}
                  <button onClick={() => setAgentFilter(null)}><X size={10} /></button>
                </span>
              )}
              {hideSubtasks && (
                <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-400">
                  No subtasks
                  <button onClick={() => setHideSubtasks(false)}><X size={10} /></button>
                </span>
              )}
            </div>
          )}

          {/* Task grid / list */}
          {displayFiltered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Search size={32} className="text-muted-foreground mb-3 opacity-40" />
              <div className="text-sm font-medium text-muted-foreground" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                No tasks match your filters
              </div>
              <button
                onClick={clearAllFilters}
                className="mt-3 text-xs text-amber-400 hover:underline"
              >
                Clear all filters
              </button>
            </div>
          ) : viewMode === "grid" ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {paginated.map((task, i) => (
                  <div key={task.num} className="fade-slide-in">
                    <TaskCard task={task} index={i} onClick={() => openDetail(task)} />
                  </div>
                ))}
              </div>
              {hasMore && (
                <div className="flex justify-center mt-8">
                  <button
                    onClick={() => setPage((p) => p + 1)}
                    className="px-6 py-2 rounded-md border border-border text-sm text-muted-foreground hover:text-foreground hover:border-amber-400/40 transition-all"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    Load more ({displayFiltered.length - paginated.length} remaining)
                  </button>
                </div>
              )}
            </>
          ) : (
            /* List view */
            <>
              <div className="rounded-lg border border-border overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-card/50">
                      <th className="text-left px-4 py-2.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>#</th>
                      <th className="text-left px-4 py-2.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Title</th>
                      <th className="text-left px-4 py-2.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Status</th>
                      <th className="text-left px-4 py-2.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Type</th>
                      <th className="text-left px-4 py-2.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Agent</th>
                      <th className="text-right px-4 py-2.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Credits</th>
                      <th className="text-left px-4 py-2.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Created</th>
                      <th className="px-4 py-2.5"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginated.map((task, i) => {
                      const status = STATUS_CONFIG[task.status] || STATUS_CONFIG.stopped;
                      return (
                        <tr
                          key={task.num}
                          onClick={() => openDetail(task)}
                          className={`border-b border-border/50 hover:bg-card/60 transition-colors group cursor-pointer ${isSubtask(task) ? "opacity-60 hover:opacity-100" : ""}`}
                          style={{ animationDelay: `${Math.min(i * 10, 200)}ms` }}
                        >
                          <td className="px-4 py-2.5 text-[11px] text-muted-foreground font-mono">{task.num}</td>
                          <td className="px-4 py-2.5 max-w-xs">
                            <span
                              className="text-sm font-medium text-foreground group-hover:text-amber-400 transition-colors line-clamp-1"
                              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                            >
                              {task.title}
                            </span>
                          </td>
                          <td className="px-4 py-2.5">
                            <span className={`inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded border font-medium ${status.color}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                              {status.label}
                            </span>
                          </td>
                          <td className="px-4 py-2.5 text-xs text-muted-foreground">{TYPE_LABELS[task.type] || task.type}</td>
                          <td className="px-4 py-2.5 text-[11px] text-muted-foreground font-mono">{AGENT_LABELS[task.agent] || task.agent}</td>
                          <td className="px-4 py-2.5 text-right text-[11px] font-mono text-foreground">{formatCredits(task.credits)}</td>
                          <td className="px-4 py-2.5 text-xs text-muted-foreground">{formatDate(task.created)}</td>
                          <td className="px-4 py-2.5">
                            <ExternalLink size={13} className="text-muted-foreground/40 group-hover:text-amber-400 transition-colors" />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              {hasMore && (
                <div className="flex justify-center mt-6">
                  <button
                    onClick={() => setPage((p) => p + 1)}
                    className="px-6 py-2 rounded-md border border-border text-sm text-muted-foreground hover:text-foreground hover:border-amber-400/40 transition-all"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    Load more ({displayFiltered.length - paginated.length} remaining)
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-border px-6 py-3 flex items-center justify-between">
              <div className="text-[11px] text-muted-foreground" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            Backup: 2026-06-18 · Brandon@apartmentcorp.com
          </div>
          <div className="text-[11px] text-muted-foreground flex items-center gap-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            <img src={LOGO_URL} alt="" className="w-3.5 h-3.5 opacity-50" />
            Manus Task Archive
          </div>
        </div>
      </main>

      {/* ── Task Detail Panel ── */}
      <TaskDetailPanel task={selectedTask} open={detailOpen} onClose={closeDetail} />
    </div>
  );
}
