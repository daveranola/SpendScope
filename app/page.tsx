"use client";

import { useMemo, useState } from "react";
import { SignUpForm } from "./ui/SignUpForm";
import { LoginForm } from "./ui/LoginForm";

const toggleOptions = {
  signup: {
    title: "Create your workspace",
    badge: "New to SpendScope",
    accent: "from-teal-500 to-emerald-500",
    description: "Spin up access for your team in minutes.",
  },
  login: {
    title: "Welcome back",
    badge: "Returning user",
    accent: "from-slate-900 via-slate-800 to-slate-900",
    description: "Pick up where you left off.",
  },
} as const;

export default function Home() {
  const [mode, setMode] = useState<"signup" | "login">("signup");
  const config = useMemo(() => toggleOptions[mode], [mode]);

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/4 top-10 h-64 w-64 rounded-full bg-teal-500/30 blur-[120px]" />
        <div className="absolute right-10 bottom-10 h-72 w-72 rounded-full bg-indigo-500/30 blur-[140px]" />
      </div>

      <section className="relative mx-auto max-w-6xl px-6 py-16 lg:py-20">
        <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-teal-200 shadow-lg shadow-teal-500/10">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          SpendScope · Spend intelligence for modern teams
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1.05fr,0.95fr] lg:items-start">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl font-semibold leading-tight text-white sm:text-5xl">
                See every dollar with clarity, move the right ones faster.
              </h1>
              <p className="max-w-2xl text-lg text-slate-300">
                SpendScope gives finance and ops teams a clean command center for approvals, budgets, and real-time spend health. Sign up to launch your workspace or hop back in to keep momentum.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 shadow-lg shadow-black/20">
                <span className="mt-1 h-2.5 w-2.5 rounded-full bg-emerald-400" />
                <div>
                  <p className="font-semibold text-white">Live visibility</p>
                  <p className="text-sm text-slate-300">Track burn, budgets, and approvals without spreadsheets.</p>
                </div>
              </div>
              <div className="flex gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 shadow-lg shadow-black/20">
                <span className="mt-1 h-2.5 w-2.5 rounded-full bg-cyan-400" />
                <div>
                  <p className="font-semibold text-white">Guardrails built-in</p>
                  <p className="text-sm text-slate-300">Policies, alerts, and audit trails keep every swipe accountable.</p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-white/0 p-6 shadow-[0_20px_80px_-40px_rgba(0,0,0,0.6)]">
              <p className="text-sm text-slate-300">Teams are already saving</p>
              <div className="mt-3 flex flex-wrap items-baseline gap-4">
                <div className="text-5xl font-semibold text-white">23%</div>
                <p className="max-w-md text-sm text-slate-400">
                  average discretionary spend trimmed within the first 60 days when every request routes through SpendScope.
                </p>
              </div>
            </div>
          </div>

          <div className="relative rounded-3xl border border-white/10 bg-white/95 p-8 text-slate-900 shadow-[0_30px_120px_-50px_rgba(15,23,42,0.9)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-teal-700">{config.badge}</p>
                <h2 className="text-3xl font-semibold text-slate-900">{config.title}</h2>
                <p className="mt-1 text-sm text-slate-600">{config.description}</p>
              </div>
              <button
                type="button"
                onClick={() => setMode(mode === "signup" ? "login" : "signup")}
                className="group flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:translate-x-0.5 hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500"
                aria-label={mode === "signup" ? "Switch to login" : "Switch to signup"}
              >
                <span className="sr-only">Toggle auth mode</span>
                <svg
                  className="h-5 w-5 transition group-hover:translate-x-0.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14" />
                  <path d="m13 5 7 7-7 7" />
                </svg>
              </button>
            </div>

            <div className="mt-8">
              <div className="relative overflow-hidden rounded-2xl border border-slate-100 bg-slate-50 shadow-inner p-1">
                <div
                  className={`absolute inset-y-1 left-1 w-[calc(50%-4px)] rounded-xl bg-gradient-to-r ${config.accent} transition-transform duration-500`}
                  style={{ transform: mode === "login" ? "translateX(100%)" : "translateX(0%)" }}
                />
                <div className="relative z-10 flex text-xs font-semibold uppercase tracking-[0.12em] text-slate-600">
                  <span className="flex-1 py-3 text-center">Sign up</span>
                  <span className="flex-1 py-3 text-center">Log in</span>
                </div>
              </div>

              <div className="relative mt-6 min-h-[360px]">
                <div
                  className={`absolute inset-0 transition-all duration-500 ${
                    mode === "signup" ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-6 pointer-events-none"
                  }`}
                >
                  <div className="rounded-2xl border border-slate-100 bg-white/90 p-5 shadow-md">
                    <SignUpForm />
                  </div>
                </div>

                <div
                  className={`absolute inset-0 transition-all duration-500 ${
                    mode === "login" ? "opacity-100 translate-x-0" : "opacity-0 translate-x-6 pointer-events-none"
                  }`}
                >
                  <div className="rounded-2xl border border-slate-100 bg-white/90 p-5 shadow-md">
                    <LoginForm />
                  </div>
                </div>
              </div>

              <div className="mt-6 flex items-center gap-2 text-xs text-slate-500">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-white">
                  {mode === "signup" ? "→" : "←"}
                </span>
                <span className="font-semibold">
                  {mode === "signup" ? "Already onboarded? Click the arrow to log in." : "New here? Click back to create your account."}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
