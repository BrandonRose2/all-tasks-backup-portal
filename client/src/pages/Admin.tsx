/**
 * Admin — Login Attempt Log
 * Protected by PIN (same PinLock gate as the rest of the app).
 * Accessible at /admin from the sidebar.
 */

import { trpc } from "@/lib/trpc";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, ShieldCheck, ShieldX, Clock, Monitor, Globe } from "lucide-react";
import { Link } from "wouter";

function formatDate(d: Date | string): string {
  const date = typeof d === "string" ? new Date(d) : d;
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function parseUA(ua: string | null): string {
  if (!ua) return "Unknown";
  if (ua.includes("Chrome")) return "Chrome";
  if (ua.includes("Firefox")) return "Firefox";
  if (ua.includes("Safari")) return "Safari";
  if (ua.includes("Edge")) return "Edge";
  return ua.slice(0, 40);
}

export default function Admin() {
  const { data: attempts, isLoading, refetch, isFetching } = trpc.loginAttempts.list.useQuery();

  const total = attempts?.length ?? 0;
  const successes = attempts?.filter((a) => a.success === 1).length ?? 0;
  const failures = attempts?.filter((a) => a.success === 0).length ?? 0;

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside
        className="w-60 shrink-0 border-r border-border flex flex-col sticky top-0 h-screen"
        style={{ background: "var(--sidebar, oklch(0.13 0.015 260))" }}
      >
        <div className="px-4 py-4 border-b border-border">
          <div className="text-sm font-bold text-amber-400 uppercase tracking-widest" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Admin Panel
          </div>
          <div className="text-[10px] text-muted-foreground mt-0.5">Security &amp; Access Logs</div>
        </div>
        <div className="px-3 py-3 space-y-1">
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-2 rounded-md text-xs text-muted-foreground hover:text-foreground hover:bg-accent transition-colors border border-transparent"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            ← Back to Tasks
          </Link>
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-md text-xs font-semibold text-amber-400 bg-amber-400/10 border border-amber-400/20"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Login Attempts
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 min-w-0 flex flex-col">
        {/* Header */}
        <div
          className="sticky top-0 z-10 border-b border-border px-6 py-3 flex items-center justify-between"
          style={{ background: "oklch(0.13 0.015 260 / 96%)", backdropFilter: "blur(16px)" }}
        >
          <div>
            <h1 className="text-base font-bold text-foreground" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Login Attempt Log
            </h1>
            <p className="text-[11px] text-muted-foreground">Every PIN entry attempt — success or failure</p>
          </div>
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-border text-xs text-muted-foreground hover:text-foreground hover:border-amber-400/40 transition-all disabled:opacity-50"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            <RefreshCw size={12} className={isFetching ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        <div className="flex-1 px-6 py-5">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="rounded-lg border border-border bg-card p-4">
              <div className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Total Attempts</div>
              <div className="text-3xl font-bold text-foreground" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{total}</div>
            </div>
            <div className="rounded-lg border border-emerald-400/20 bg-emerald-400/5 p-4">
              <div className="text-[10px] text-emerald-400/70 uppercase tracking-widest mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Successful Logins</div>
              <div className="text-3xl font-bold text-emerald-400" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{successes}</div>
            </div>
            <div className="rounded-lg border border-red-400/20 bg-red-400/5 p-4">
              <div className="text-[10px] text-red-400/70 uppercase tracking-widest mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Failed Attempts</div>
              <div className="text-3xl font-bold text-red-400" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{failures}</div>
            </div>
          </div>

          {/* Table */}
          {isLoading ? (
            <div className="flex items-center justify-center py-20 text-muted-foreground text-sm" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Loading attempt log…
            </div>
          ) : !attempts || attempts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <ShieldCheck size={32} className="text-muted-foreground mb-3 opacity-40" />
              <div className="text-sm font-medium text-muted-foreground" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                No login attempts recorded yet
              </div>
              <div className="text-xs text-muted-foreground/60 mt-1">Attempts will appear here after someone tries to enter the PIN</div>
            </div>
          ) : (
            <div className="rounded-lg border border-border overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-card/50">
                    {["#", "Result", "Attempt #", "IP Address", "Browser", "Timestamp"].map((h) => (
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
                  {attempts.map((a, i) => (
                    <tr
                      key={a.id}
                      className="border-b border-border/50 hover:bg-card/60 transition-colors"
                    >
                      <td className="px-4 py-2.5 text-[11px] text-muted-foreground font-mono">{i + 1}</td>
                      <td className="px-4 py-2.5">
                        {a.success === 1 ? (
                          <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded border font-medium text-emerald-400 bg-emerald-400/10 border-emerald-400/20">
                            <ShieldCheck size={10} /> Success
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded border font-medium text-red-400 bg-red-400/10 border-red-400/20">
                            <ShieldX size={10} /> Failed
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-2.5 text-[11px] text-muted-foreground font-mono">
                        {a.attemptNumber ?? "—"}
                      </td>
                      <td className="px-4 py-2.5">
                        <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground font-mono">
                          <Globe size={10} />
                          {a.ip ?? "—"}
                        </span>
                      </td>
                      <td className="px-4 py-2.5">
                        <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                          <Monitor size={10} />
                          {parseUA(a.userAgent)}
                        </span>
                      </td>
                      <td className="px-4 py-2.5">
                        <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                          <Clock size={10} />
                          {formatDate(a.createdAt)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
