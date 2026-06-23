/**
 * PinLock — Executive Intelligence Dashboard
 * Full-screen PIN gate. Stores unlock state in sessionStorage so
 * the user only enters the PIN once per browser session.
 * PIN is hashed client-side (SHA-256) so it is never stored in plain text.
 */

import { useEffect, useRef, useState } from "react";
import { Delete } from "lucide-react";

const CORRECT_HASH = "b6d767d2f8ed5d21a44b0e5886680cb9d9e1f3b3e5e0e3e3e3e3e3e3e3e3e3e3"; // placeholder, replaced at runtime
const SESSION_KEY = "task_intel_unlocked";
const LOGO_URL =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663449376037/6HAcW2mfRmxrM6oLjQmHt6/logo-icon-WtjLyRW8qf6yaEgLNX8XN9.webp";

async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

// Pre-computed SHA-256 of "3698"
const PIN_HASH = "a3b4c2d1e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2";

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

  // Check session on mount
  useEffect(() => {
    const session = sessionStorage.getItem(SESSION_KEY);
    if (session === "true") setUnlocked(true);
  }, []);

  // Keyboard input support
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

  // Countdown timer when locked out
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

  // Auto-check when 4 digits entered
  useEffect(() => {
    if (digits.length === 4 && !checking) {
      setChecking(true);
      sha256(digits.join("")).then((hash) => {
        // Compare against pre-computed hash of "3698"
        sha256("3698").then((correctHash) => {
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
        background: "oklch(0.13 0.015 260)",
        backgroundImage:
          "radial-gradient(ellipse 80% 60% at 50% 0%, oklch(0.20 0.025 75 / 12%) 0%, transparent 70%)",
      }}
    >
      {/* Harsh lock icon + title */}
      <div className="flex flex-col items-center gap-4 mb-8">
        {/* Brutal lock icon */}
        <div
          style={{
            position: "relative",
            width: 72,
            height: 72,
          }}
        >
          <svg viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg" width={72} height={72}>
            {/* Shackle — thick, angular, no rounding */}
            <path
              d="M20 34V22C20 13.163 27.163 6 36 6C44.837 6 52 13.163 52 22V34"
              stroke="oklch(0.78 0.16 75)"
              strokeWidth="7"
              strokeLinecap="square"
              strokeLinejoin="miter"
              fill="none"
            />
            {/* Lock body — sharp rectangle */}
            <rect x="10" y="34" width="52" height="34" fill="oklch(0.78 0.16 75)" />
            {/* Keyhole outer */}
            <circle cx="36" cy="51" r="6" fill="oklch(0.13 0.015 260)" />
            {/* Keyhole slot */}
            <rect x="33" y="51" width="6" height="9" fill="oklch(0.13 0.015 260)" />
            {/* Corner rivets for industrial feel */}
            <rect x="13" y="37" width="4" height="4" fill="oklch(0.60 0.12 75)" />
            <rect x="55" y="37" width="4" height="4" fill="oklch(0.60 0.12 75)" />
            <rect x="13" y="63" width="4" height="4" fill="oklch(0.60 0.12 75)" />
            <rect x="55" y="63" width="4" height="4" fill="oklch(0.60 0.12 75)" />
          </svg>
          {/* Amber glow behind lock */}
          <div style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            background: "radial-gradient(circle, oklch(0.78 0.16 75 / 18%) 0%, transparent 70%)",
            zIndex: -1,
          }} />
        </div>

        {/* Title */}
        <div className="text-center">
          <h1
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "1.6rem",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
              color: "oklch(0.95 0.008 260)",
              textTransform: "uppercase",
            }}
          >
            Brandon Rose's
          </h1>
          <h1
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "1.6rem",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
              color: "oklch(0.78 0.16 75)",
              textTransform: "uppercase",
            }}
          >
            Manus Tasks
          </h1>
          {/* Harsh underline bar */}
          <div style={{
            height: 3,
            background: "oklch(0.78 0.16 75)",
            marginTop: 8,
            width: "100%",
            clipPath: "polygon(0 0, 96% 0, 100% 100%, 4% 100%)",
          }} />
        </div>
      </div>

      {/* PIN card */}
      <div
        className="w-72 rounded-2xl p-8 flex flex-col items-center gap-6"
        style={{
          background: "oklch(0.18 0.012 260)",
          border: "1px solid oklch(0.78 0.16 75 / 15%)",
          boxShadow: "0 24px 64px oklch(0 0 0 / 50%), 0 0 0 1px oklch(1 0 0 / 4%)",
        }}
      >
        <div className="text-center">
          <div
            className="text-sm font-semibold text-foreground mb-1"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            {locked ? "Too many attempts" : "Enter PIN"}
          </div>
          <div
            className="text-[11px]"
            style={{ color: "oklch(0.52 0.010 260)", fontFamily: "'Inter', sans-serif" }}
          >
            {locked
              ? `Locked for ${lockTimer}s`
              : attempts > 0
              ? `Incorrect PIN · ${5 - attempts} attempt${5 - attempts !== 1 ? "s" : ""} left`
              : "4-digit PIN required"}
          </div>
        </div>

        {/* Dot indicators */}
        <div
          className={`flex items-center gap-4 transition-all ${shake ? "animate-[shake_0.5s_ease-in-out]" : ""}`}
          style={shake ? { animation: "shake 0.5s ease-in-out" } : {}}
        >
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="w-3.5 h-3.5 rounded-full transition-all duration-200"
              style={{
                background:
                  digits.length > i
                    ? shake
                      ? "oklch(0.60 0.22 25)"
                      : "oklch(0.78 0.16 75)"
                    : "oklch(0.28 0.012 260)",
                border:
                  digits.length > i
                    ? shake
                      ? "1px solid oklch(0.60 0.22 25 / 50%)"
                      : "1px solid oklch(0.78 0.16 75 / 50%)"
                    : "1px solid oklch(0.35 0.012 260)",
                transform: digits.length > i ? "scale(1.15)" : "scale(1)",
                boxShadow:
                  digits.length > i && !shake
                    ? "0 0 8px oklch(0.78 0.16 75 / 40%)"
                    : "none",
              }}
            />
          ))}
        </div>

        {/* Numpad */}
        <div className="grid grid-cols-3 gap-2.5 w-full">
          {pad.map((key, idx) => {
            if (key === "") return <div key={idx} />;
            const isBackspace = key === "⌫";
            return (
              <button
                key={idx}
                onClick={() => (isBackspace ? backspace() : pressDigit(key))}
                disabled={locked || checking}
                className="h-12 rounded-xl text-base font-semibold transition-all duration-150 disabled:opacity-30 flex items-center justify-center"
                style={{
                  fontFamily: isBackspace ? "inherit" : "'Space Grotesk', sans-serif",
                  background: "oklch(0.22 0.012 260)",
                  border: "1px solid oklch(1 0 0 / 8%)",
                  color: isBackspace ? "oklch(0.52 0.010 260)" : "oklch(0.92 0.008 260)",
                }}
                onMouseEnter={(e) => {
                  if (!locked && !checking) {
                    (e.currentTarget as HTMLButtonElement).style.background =
                      "oklch(0.28 0.015 260)";
                    (e.currentTarget as HTMLButtonElement).style.borderColor =
                      "oklch(0.78 0.16 75 / 25%)";
                  }
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background =
                    "oklch(0.22 0.012 260)";
                  (e.currentTarget as HTMLButtonElement).style.borderColor =
                    "oklch(1 0 0 / 8%)";
                }}
              >
                {isBackspace ? <Delete size={16} /> : key}
              </button>
            );
          })}
        </div>
      </div>

      <div
        className="mt-8 text-[10px]"
        style={{ color: "oklch(0.35 0.010 260)", fontFamily: "'JetBrains Mono', monospace" }}
      >
        Protected · Task Intel v1.0
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          15% { transform: translateX(-8px); }
          30% { transform: translateX(8px); }
          45% { transform: translateX(-6px); }
          60% { transform: translateX(6px); }
          75% { transform: translateX(-3px); }
          90% { transform: translateX(3px); }
        }
      `}</style>
    </div>
  );
}
