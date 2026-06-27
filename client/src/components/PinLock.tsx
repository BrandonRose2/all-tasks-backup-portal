/**
 * PinLock — Executive Intelligence Dashboard
 * Full-screen PIN gate. Stores unlock state in sessionStorage so
 * the user only enters the PIN once per browser session.
 * PIN is hashed client-side (SHA-256) so it is never stored in plain text.
 * PIN: 2597
 */

import { useEffect, useRef, useState } from "react";
import { Delete } from "lucide-react";

const SESSION_KEY = "task_intel_unlocked";

async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

// PIN: 2597
const CORRECT_PIN = "2597";

interface PinLockProps {
  children: React.ReactNode;
}

export default function PinLock({ children }: PinLockProps) {
  const [unlocked, setUnlocked] = useState(false);
  const [digits, setDigits] = useState<string[]>([]);
  const [shake, setShake] = useState(false);
  const [checking, setChecking] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [locked, setLocked] = useState(false);
  const [lockTimer, setLockTimer] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const session = sessionStorage.getItem(SESSION_KEY);
    if (session === "true") setUnlocked(true);
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (unlocked) return;
      if (locked || checking) return;
      if (e.key >= "0" && e.key <= "9") {
        setDigits((prev) => prev.length < 4 ? [...prev, e.key] : prev);
      } else if (e.key === "Backspace") {
        setDigits((prev) => prev.slice(0, -1));
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [unlocked, locked, checking]);

  useEffect(() => {
    if (locked && lockTimer > 0) {
      timerRef.current = setInterval(() => {
        setLockTimer((t) => {
          if (t <= 1) {
            clearInterval(timerRef.current!);
            setLocked(false);
            setAttempts(0);
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [locked]);

  useEffect(() => {
    if (digits.length === 4 && !checking) {
      setChecking(true);
      sha256(digits.join("")).then((hash) => {
        sha256(CORRECT_PIN).then((correctHash) => {
          if (hash === correctHash) {
            sessionStorage.setItem(SESSION_KEY, "true");
            setTimeout(() => setUnlocked(true), 300);
          } else {
            const newAttempts = attempts + 1;
            setAttempts(newAttempts);
            setShake(true);
            setTimeout(() => {
              setShake(false);
              setDigits([]);
              setChecking(false);
              if (newAttempts >= 5) {
                setLocked(true);
                setLockTimer(30);
              }
            }, 600);
          }
        });
      });
    }
  }, [digits]);

  function pressDigit(d: string) {
    if (locked || checking || digits.length >= 4) return;
    setDigits((prev) => [...prev, d]);
  }

  function backspace() {
    if (locked || checking) return;
    setDigits((prev) => prev.slice(0, -1));
  }

  if (unlocked) return <>{children}</>;

  const pad = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "⌫"];

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center"
      style={{
        background: "oklch(0.10 0.018 260)",
        backgroundImage: [
          "radial-gradient(ellipse 90% 55% at 50% -5%, oklch(0.22 0.030 75 / 18%) 0%, transparent 65%)",
          "repeating-linear-gradient(0deg, transparent, transparent 39px, oklch(1 0 0 / 2%) 39px, oklch(1 0 0 / 2%) 40px)",
          "repeating-linear-gradient(90deg, transparent, transparent 39px, oklch(1 0 0 / 2%) 39px, oklch(1 0 0 / 2%) 40px)",
        ].join(", "),
      }}
    >
      {/* ── Harsh 3-D Lock + Title ── */}
      <div className="flex flex-col items-center gap-5 mb-10">

        {/* 3-D Lock SVG */}
        <div style={{ position: "relative", width: 96, height: 96, filter: "drop-shadow(0 12px 28px oklch(0 0 0 / 70%)) drop-shadow(0 0 18px oklch(0.78 0.16 75 / 35%))" }}>
          <svg viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg" width={96} height={96}>
            {/* ── Shackle ── */}
            {/* Shackle shadow/depth (dark offset) */}
            <path
              d="M27 46V28C27 15.85 35.85 7 48 7C60.15 7 69 15.85 69 28V46"
              stroke="oklch(0.30 0.08 75)"
              strokeWidth="13"
              strokeLinecap="square"
              strokeLinejoin="miter"
              fill="none"
            />
            {/* Shackle main face */}
            <path
              d="M27 44V28C27 15.85 35.85 7 48 7C60.15 7 69 15.85 69 28V44"
              stroke="oklch(0.68 0.14 75)"
              strokeWidth="10"
              strokeLinecap="square"
              strokeLinejoin="miter"
              fill="none"
            />
            {/* Shackle highlight edge */}
            <path
              d="M27 44V28C27 15.85 35.85 7 48 7C60.15 7 69 15.85 69 28V44"
              stroke="oklch(0.90 0.18 80)"
              strokeWidth="2"
              strokeLinecap="square"
              strokeLinejoin="miter"
              fill="none"
              strokeDasharray="4 3"
              opacity="0.4"
            />

            {/* ── Lock body — bottom face (shadow) ── */}
            <rect x="10" y="48" width="76" height="46" rx="0" fill="oklch(0.25 0.06 75)" />

            {/* ── Lock body — right face (side depth) ── */}
            <path d="M86 48 L92 54 L92 100 L86 94 Z" fill="oklch(0.22 0.05 75)" />

            {/* ── Lock body — top face (main face) ── */}
            <rect x="10" y="44" width="76" height="46" rx="0" fill="oklch(0.72 0.16 75)" />

            {/* Face highlight — top edge bevel */}
            <rect x="10" y="44" width="76" height="4" fill="oklch(0.88 0.18 80)" opacity="0.6" />

            {/* Face shadow — bottom edge bevel */}
            <rect x="10" y="86" width="76" height="4" fill="oklch(0.45 0.10 75)" opacity="0.8" />

            {/* Left edge bevel */}
            <rect x="10" y="44" width="4" height="46" fill="oklch(0.88 0.18 80)" opacity="0.3" />

            {/* Right edge bevel */}
            <rect x="82" y="44" width="4" height="46" fill="oklch(0.40 0.08 75)" opacity="0.8" />

            {/* ── Rivet bolts — industrial corners ── */}
            {/* Top-left rivet */}
            <rect x="14" y="48" width="7" height="7" fill="oklch(0.50 0.10 75)" />
            <rect x="15" y="49" width="3" height="3" fill="oklch(0.85 0.16 80)" opacity="0.7" />
            {/* Top-right rivet */}
            <rect x="75" y="48" width="7" height="7" fill="oklch(0.50 0.10 75)" />
            <rect x="76" y="49" width="3" height="3" fill="oklch(0.85 0.16 80)" opacity="0.7" />
            {/* Bottom-left rivet */}
            <rect x="14" y="79" width="7" height="7" fill="oklch(0.50 0.10 75)" />
            <rect x="15" y="80" width="3" height="3" fill="oklch(0.85 0.16 80)" opacity="0.5" />
            {/* Bottom-right rivet */}
            <rect x="75" y="79" width="7" height="7" fill="oklch(0.50 0.10 75)" />
            <rect x="76" y="80" width="3" height="3" fill="oklch(0.85 0.16 80)" opacity="0.5" />

            {/* ── Keyhole ── */}
            {/* Keyhole recess (dark inset) */}
            <circle cx="49" cy="66" r="9" fill="oklch(0.18 0.015 260)" />
            {/* Keyhole circle */}
            <circle cx="48" cy="65" r="8" fill="oklch(0.12 0.012 260)" />
            {/* Keyhole slot */}
            <rect x="45" y="65" width="6" height="11" rx="1" fill="oklch(0.12 0.012 260)" />
            {/* Keyhole rim highlight */}
            <circle cx="48" cy="65" r="8" stroke="oklch(0.55 0.10 75)" strokeWidth="1.5" fill="none" />

            {/* ── Horizontal center band — adds depth ── */}
            <rect x="10" y="63" width="76" height="3" fill="oklch(0.55 0.10 75)" opacity="0.25" />
          </svg>
        </div>

        {/* Title block */}
        <div className="text-center" style={{ maxWidth: 340 }}>
          <h1
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "1.75rem",
              fontWeight: 900,
              letterSpacing: "-0.04em",
              lineHeight: 1.05,
              color: "oklch(0.97 0.006 260)",
              textTransform: "uppercase",
              textShadow: "0 2px 12px oklch(0 0 0 / 60%)",
            }}
          >
            Brandon Rose
          </h1>
          <h1
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "1.75rem",
              fontWeight: 900,
              letterSpacing: "-0.04em",
              lineHeight: 1.05,
              color: "oklch(0.78 0.16 75)",
              textTransform: "uppercase",
              textShadow: "0 0 24px oklch(0.78 0.16 75 / 50%)",
            }}
          >
            — ALL TASKS
          </h1>
          {/* Slash underline */}
          <div style={{
            height: 4,
            background: "linear-gradient(90deg, oklch(0.78 0.16 75), oklch(0.65 0.14 75 / 0%))",
            marginTop: 10,
            width: "100%",
            clipPath: "polygon(0 0, 94% 0, 100% 100%, 6% 100%)",
          }} />
          {/* Warning subtitle */}
          <p
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "0.65rem",
              fontWeight: 700,
              letterSpacing: "0.18em",
              color: "oklch(0.55 0.010 260)",
              textTransform: "uppercase",
              marginTop: 10,
            }}
          >
            ⚠ No trespassing allowed
          </p>
        </div>
      </div>

      {/* ── PIN Card ── */}
      <div
        className="w-72 rounded-none p-8 flex flex-col items-center gap-6"
        style={{
          background: "oklch(0.16 0.014 260)",
          border: "1px solid oklch(0.78 0.16 75 / 20%)",
          borderTop: "3px solid oklch(0.78 0.16 75 / 60%)",
          boxShadow: [
            "0 28px 72px oklch(0 0 0 / 60%)",
            "0 0 0 1px oklch(1 0 0 / 4%)",
            "inset 0 1px 0 oklch(1 0 0 / 6%)",
          ].join(", "),
        }}
      >
        <div className="text-center">
          <div
            className="text-sm font-bold text-foreground mb-1 uppercase tracking-widest"
            style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: "0.12em" }}
          >
            {locked ? "Access Denied" : "Enter PIN"}
          </div>
          <div
            className="text-[11px]"
            style={{ color: "oklch(0.45 0.010 260)", fontFamily: "'Space Grotesk', sans-serif" }}
          >
            {locked
              ? `Locked for ${lockTimer}s`
              : attempts > 0
              ? `Wrong PIN · ${5 - attempts} attempt${5 - attempts !== 1 ? "s" : ""} left`
              : "4-digit PIN required"}
          </div>
        </div>

        {/* Dot indicators */}
        <div
          className="flex items-center gap-4"
          style={shake ? { animation: "shake 0.5s ease-in-out" } : {}}
        >
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="transition-all duration-200"
              style={{
                width: 14,
                height: 14,
                borderRadius: 0,
                background:
                  digits.length > i
                    ? shake
                      ? "oklch(0.60 0.22 25)"
                      : "oklch(0.78 0.16 75)"
                    : "oklch(0.24 0.012 260)",
                border:
                  digits.length > i
                    ? shake
                      ? "1px solid oklch(0.60 0.22 25 / 60%)"
                      : "1px solid oklch(0.78 0.16 75 / 60%)"
                    : "1px solid oklch(0.32 0.012 260)",
                transform: digits.length > i ? "scale(1.2) rotate(45deg)" : "rotate(45deg)",
                boxShadow:
                  digits.length > i && !shake
                    ? "0 0 10px oklch(0.78 0.16 75 / 50%)"
                    : "none",
              }}
            />
          ))}
        </div>

        {/* Numpad */}
        <div className="grid grid-cols-3 gap-2 w-full">
          {pad.map((key, idx) => {
            if (key === "") return <div key={idx} />;
            const isBackspace = key === "⌫";
            return (
              <button
                key={idx}
                onClick={() => (isBackspace ? backspace() : pressDigit(key))}
                disabled={locked || checking}
                className="h-12 text-base font-bold transition-all duration-100 disabled:opacity-30 flex items-center justify-center active:scale-95"
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  borderRadius: 0,
                  background: "oklch(0.20 0.014 260)",
                  border: "1px solid oklch(1 0 0 / 10%)",
                  borderBottom: "3px solid oklch(0.12 0.010 260)",
                  color: isBackspace ? "oklch(0.45 0.010 260)" : "oklch(0.92 0.008 260)",
                  boxShadow: "inset 0 1px 0 oklch(1 0 0 / 8%)",
                }}
                onMouseEnter={(e) => {
                  if (!locked && !checking) {
                    const el = e.currentTarget as HTMLButtonElement;
                    el.style.background = "oklch(0.26 0.018 260)";
                    el.style.borderColor = "oklch(0.78 0.16 75 / 30%)";
                    el.style.color = "oklch(0.78 0.16 75)";
                  }
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLButtonElement;
                  el.style.background = "oklch(0.20 0.014 260)";
                  el.style.borderColor = "oklch(1 0 0 / 10%)";
                  el.style.color = isBackspace ? "oklch(0.45 0.010 260)" : "oklch(0.92 0.008 260)";
                }}
              >
                {isBackspace ? <Delete size={16} /> : key}
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div
        className="mt-8 text-[10px] uppercase tracking-widest"
        style={{ color: "oklch(0.28 0.010 260)", fontFamily: "'Space Grotesk', sans-serif" }}
      >
        Restricted Access · Task Intel v1.0
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          15% { transform: translateX(-10px); }
          30% { transform: translateX(10px); }
          45% { transform: translateX(-7px); }
          60% { transform: translateX(7px); }
          75% { transform: translateX(-4px); }
          90% { transform: translateX(4px); }
        }
      `}</style>
    </div>
  );
}
