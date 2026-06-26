/**
 * GitHubRepos — Executive Intelligence Dashboard
 * Design: Deep slate + amber gold, Space Grotesk display font
 * Lists all GitHub repositories for BrandonRose2, fetched live via GitHub API.
 */

import { useEffect, useState } from "react";
import { Link } from "wouter";
import {
  Hash,
  Globe,
  GitBranch,
  Star,
  Lock,
  Unlock,
  Code2,
  Clock,
  ExternalLink,
  RefreshCw,
  BookOpen,
  GitFork,
  AlertCircle,
} from "lucide-react";

// ─── Config ──────────────────────────────────────────────────────────────────

const GITHUB_PAT = "REDACTED_GITHUB_PAT";
const GITHUB_USERNAME = "BrandonRose2";
const LOGO_URL =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663449376037/6HAcW2mfRmxrM6oLjQmHt6/logo-icon-WtjLyRW8qf6yaEgLNX8XN9.webp";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Repo {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  private: boolean;
  fork: boolean;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  updated_at: string;
  created_at: string;
  default_branch: string;
  size: number;
  topics: string[];
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatSize(kb: number): string {
  if (kb < 1024) return `${kb} KB`;
  return `${(kb / 1024).toFixed(1)} MB`;
}

const LANG_COLORS: Record<string, string> = {
  TypeScript: "oklch(0.65 0.18 240)",
  JavaScript: "oklch(0.85 0.18 90)",
  Python: "oklch(0.70 0.16 220)",
  Rust: "oklch(0.65 0.15 40)",
  Go: "oklch(0.65 0.18 200)",
  HTML: "oklch(0.65 0.18 30)",
  CSS: "oklch(0.65 0.18 260)",
  Shell: "oklch(0.65 0.12 150)",
  Java: "oklch(0.65 0.15 25)",
  "C++": "oklch(0.65 0.15 260)",
  Ruby: "oklch(0.65 0.20 15)",
  Swift: "oklch(0.70 0.18 30)",
};

// ─── Main Component ───────────────────────────────────────────────────────────

export default function GitHubRepos() {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [langFilter, setLangFilter] = useState<string | null>(null);
  const [visFilter, setVisFilter] = useState<"all" | "public" | "private">("all");
  const [sortBy, setSortBy] = useState<"updated" | "name" | "stars" | "created">("updated");
  const [lastFetched, setLastFetched] = useState<string | null>(null);

  async function fetchRepos() {
    setLoading(true);
    setError(null);
    try {
      const allRepos: Repo[] = [];
      let page = 1;
      while (true) {
        const resp = await fetch(
          `https://api.github.com/user/repos?per_page=100&sort=updated&page=${page}`,
          {
            headers: {
              Authorization: `token ${GITHUB_PAT}`,
              Accept: "application/vnd.github.v3+json",
            },
          }
        );
        if (!resp.ok) throw new Error(`GitHub API error: ${resp.status}`);
        const data: Repo[] = await resp.json();
        if (data.length === 0) break;
        allRepos.push(...data);
        if (data.length < 100) break;
        page++;
      }
      setRepos(allRepos);
      setLastFetched(new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }));
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to fetch repositories");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchRepos();
  }, []);

  // Derived data
  const languages = Array.from(
    new Set(repos.map((r) => r.language).filter(Boolean) as string[])
  ).sort();

  const filtered = repos
    .filter((r) => {
      if (search && !r.name.toLowerCase().includes(search.toLowerCase()) &&
          !(r.description || "").toLowerCase().includes(search.toLowerCase())) return false;
      if (langFilter && r.language !== langFilter) return false;
      if (visFilter === "public" && r.private) return false;
      if (visFilter === "private" && !r.private) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "updated") return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
      if (sortBy === "created") return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "stars") return b.stargazers_count - a.stargazers_count;
      return 0;
    });

  const stats = {
    total: repos.length,
    public: repos.filter((r) => !r.private).length,
    private: repos.filter((r) => r.private).length,
    forks: repos.filter((r) => r.fork).length,
    totalStars: repos.reduce((s, r) => s + r.stargazers_count, 0),
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <img src={LOGO_URL} alt="Logo" className="w-12 h-12 mx-auto mb-4 opacity-80" />
          <div className="text-muted-foreground text-sm" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Fetching repositories...
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

        {/* Navigation */}
        <div className="px-3 py-2 border-b border-border space-y-1">
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-2 rounded-md text-xs text-muted-foreground hover:text-foreground hover:bg-accent transition-colors border border-transparent"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            <Hash size={13} />
            All Tasks
          </Link>
          <Link
            href="/apps"
            className="flex items-center gap-2 px-3 py-2 rounded-md text-xs text-muted-foreground hover:text-foreground hover:bg-accent transition-colors border border-transparent"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            <Globe size={13} />
            Apps &amp; Websites
            <span className="ml-auto text-[10px] bg-muted px-1.5 py-0.5 rounded font-mono text-muted-foreground">42</span>
          </Link>
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-md text-xs font-semibold text-amber-400 bg-amber-400/10 border border-amber-400/20"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            <GitBranch size={13} />
            GitHub Repos
            <span className="ml-auto text-[10px] bg-amber-400/20 px-1.5 py-0.5 rounded font-mono">{stats.total}</span>
          </div>
        </div>

        {/* Stats */}
        <div className="px-3 py-4 border-b border-border space-y-2">
          <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest px-1 mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Overview
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-md bg-card border border-border p-2.5 text-center">
              <div className="text-lg font-bold text-amber-400" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{stats.total}</div>
              <div className="text-[10px] text-muted-foreground">Total</div>
            </div>
            <div className="rounded-md bg-card border border-border p-2.5 text-center">
              <div className="text-lg font-bold text-emerald-400" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{stats.public}</div>
              <div className="text-[10px] text-muted-foreground">Public</div>
            </div>
            <div className="rounded-md bg-card border border-border p-2.5 text-center">
              <div className="text-lg font-bold text-purple-400" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{stats.private}</div>
              <div className="text-[10px] text-muted-foreground">Private</div>
            </div>
            <div className="rounded-md bg-card border border-border p-2.5 text-center">
              <div className="text-lg font-bold text-blue-400" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{stats.forks}</div>
              <div className="text-[10px] text-muted-foreground">Forks</div>
            </div>
          </div>
        </div>

        {/* Language filter */}
        <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest px-1 mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Language
          </div>
          <button
            onClick={() => setLangFilter(null)}
            className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-md text-xs transition-colors border ${
              langFilter === null
                ? "text-amber-400 bg-amber-400/10 border-amber-400/20"
                : "text-muted-foreground border-transparent hover:bg-accent hover:text-foreground"
            }`}
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            <Code2 size={11} />
            All Languages
            <span className="ml-auto font-mono text-[10px]">{repos.length}</span>
          </button>
          {languages.map((lang) => (
            <button
              key={lang}
              onClick={() => setLangFilter(langFilter === lang ? null : lang)}
              className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-md text-xs transition-colors border ${
                langFilter === lang
                  ? "text-amber-400 bg-amber-400/10 border-amber-400/20"
                  : "text-muted-foreground border-transparent hover:bg-accent hover:text-foreground"
              }`}
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ background: LANG_COLORS[lang] || "oklch(0.55 0.01 260)" }}
              />
              {lang}
              <span className="ml-auto font-mono text-[10px]">
                {repos.filter((r) => r.language === lang).length}
              </span>
            </button>
          ))}
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div
          className="sticky top-0 z-10 px-6 py-4 border-b border-border flex items-center gap-4"
          style={{ background: "oklch(0.16 0.010 260 / 95%)", backdropFilter: "blur(12px)" }}
        >
          <div className="flex items-center gap-2 mr-2">
            <GitBranch size={16} style={{ color: "oklch(0.78 0.16 75)" }} />
            <span className="text-sm font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.78 0.16 75)" }}>
              GitHub Repositories
            </span>
            <span className="text-xs text-muted-foreground font-mono ml-1">@{GITHUB_USERNAME}</span>
          </div>

          {/* Search */}
          <div className="flex-1 max-w-sm relative">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search repositories..."
              className="w-full h-8 pl-3 pr-3 rounded-lg text-xs bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-amber-400/40 transition-colors"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            />
          </div>

          {/* Visibility filter */}
          <div className="flex items-center gap-1 rounded-lg border border-border p-0.5" style={{ background: "oklch(0.18 0.010 260)" }}>
            {(["all", "public", "private"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setVisFilter(v)}
                className={`px-3 py-1 rounded-md text-[11px] font-semibold transition-all ${
                  visFilter === v
                    ? "text-amber-400 bg-amber-400/15"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                {v.charAt(0).toUpperCase() + v.slice(1)}
              </button>
            ))}
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="h-8 px-2 rounded-lg text-xs bg-card border border-border text-foreground focus:outline-none focus:border-amber-400/40 cursor-pointer"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            <option value="updated">Recently Updated</option>
            <option value="created">Newest First</option>
            <option value="name">Name A–Z</option>
            <option value="stars">Most Stars</option>
          </select>

          {/* Refresh */}
          <button
            onClick={fetchRepos}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:opacity-80 active:scale-95"
            style={{
              background: "oklch(0.78 0.16 75 / 15%)",
              border: "1px solid oklch(0.78 0.16 75 / 30%)",
              color: "oklch(0.78 0.16 75)",
              fontFamily: "'Space Grotesk', sans-serif",
            }}
          >
            <RefreshCw size={12} />
            Refresh
          </button>

          {lastFetched && (
            <span className="text-[10px] text-muted-foreground font-mono">
              Updated {lastFetched}
            </span>
          )}
        </div>

        {/* Error state */}
        {error && (
          <div className="m-6 p-4 rounded-lg border border-red-400/30 bg-red-400/10 flex items-center gap-3">
            <AlertCircle size={16} className="text-red-400 shrink-0" />
            <span className="text-sm text-red-400" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{error}</span>
          </div>
        )}

        {/* Results count */}
        <div className="px-6 py-3 border-b border-border flex items-center gap-2">
          <span className="text-xs text-muted-foreground" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Showing <span className="text-foreground font-semibold">{filtered.length}</span> of{" "}
            <span className="text-foreground font-semibold">{repos.length}</span> repositories
          </span>
        </div>

        {/* Repo grid */}
        <div className="flex-1 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((repo) => (
              <RepoCard key={repo.id} repo={repo} />
            ))}
          </div>

          {filtered.length === 0 && !error && (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <GitBranch size={32} className="text-muted-foreground/30 mb-3" />
              <div className="text-sm text-muted-foreground" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                No repositories match your filters
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

// ─── Repo Card ────────────────────────────────────────────────────────────────

function RepoCard({ repo }: { repo: Repo }) {
  const langColor = repo.language ? (LANG_COLORS[repo.language] || "oklch(0.55 0.01 260)") : null;

  return (
    <div
      className="rounded-xl border border-border p-4 flex flex-col gap-3 transition-all duration-200 hover:border-amber-400/30 hover:shadow-lg group"
      style={{
        background: "oklch(0.18 0.010 260)",
        boxShadow: "0 2px 8px oklch(0 0 0 / 20%)",
      }}
    >
      {/* Top row: name + visibility */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <BookOpen size={13} style={{ color: "oklch(0.78 0.16 75)", flexShrink: 0 }} />
          <a
            href={repo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-bold truncate hover:text-amber-400 transition-colors"
            style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.92 0.008 260)" }}
          >
            {repo.name}
          </a>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          {repo.fork && (
            <span className="flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded font-mono"
              style={{ background: "oklch(0.65 0.15 240 / 15%)", color: "oklch(0.65 0.15 240)", border: "1px solid oklch(0.65 0.15 240 / 25%)" }}>
              <GitFork size={9} />
              fork
            </span>
          )}
          <span
            className="flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded font-mono"
            style={
              repo.private
                ? { background: "oklch(0.65 0.15 300 / 15%)", color: "oklch(0.75 0.12 300)", border: "1px solid oklch(0.65 0.15 300 / 25%)" }
                : { background: "oklch(0.55 0.15 150 / 15%)", color: "oklch(0.70 0.15 150)", border: "1px solid oklch(0.55 0.15 150 / 25%)" }
            }
          >
            {repo.private ? <Lock size={9} /> : <Unlock size={9} />}
            {repo.private ? "private" : "public"}
          </span>
        </div>
      </div>

      {/* Description */}
      <p
        className="text-xs text-muted-foreground line-clamp-2 leading-relaxed"
        style={{ fontFamily: "'Inter', sans-serif", minHeight: "2.5rem" }}
      >
        {repo.description || <span className="italic opacity-50">No description</span>}
      </p>

      {/* Topics */}
      {repo.topics && repo.topics.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {repo.topics.slice(0, 4).map((topic) => (
            <span
              key={topic}
              className="text-[10px] px-1.5 py-0.5 rounded font-mono"
              style={{ background: "oklch(0.78 0.16 75 / 10%)", color: "oklch(0.78 0.16 75 / 80%)", border: "1px solid oklch(0.78 0.16 75 / 15%)" }}
            >
              {topic}
            </span>
          ))}
          {repo.topics.length > 4 && (
            <span className="text-[10px] text-muted-foreground/50 px-1">+{repo.topics.length - 4}</span>
          )}
        </div>
      )}

      {/* Footer: language + stats + date */}
      <div className="flex items-center gap-3 mt-auto pt-2 border-t border-border">
        {langColor && (
          <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: langColor }} />
            {repo.language}
          </span>
        )}
        {repo.stargazers_count > 0 && (
          <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
            <Star size={10} />
            {repo.stargazers_count}
          </span>
        )}
        {repo.forks_count > 0 && (
          <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
            <GitFork size={10} />
            {repo.forks_count}
          </span>
        )}
        <span className="flex items-center gap-1 text-[11px] text-muted-foreground ml-auto">
          <Clock size={10} />
          {formatDate(repo.updated_at)}
        </span>
        <a
          href={repo.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground hover:text-amber-400 transition-colors"
        >
          <ExternalLink size={12} />
        </a>
      </div>
    </div>
  );
}
