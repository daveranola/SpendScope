"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { SignUpForm } from "./ui/SignUpForm";
import { LoginForm } from "./ui/LoginForm";
import { FadeInOnView } from "./ui/FadeInOnView";

const toggleOptions = {
  signup: {
    title: "Create your budget HQ",
    badge: "New to SpendScope",
    accent: "from-teal-500 to-emerald-500",
    description: "Set goals, budgets, and track every dollar with clarity.",
  },
  login: {
    title: "Welcome back",
    badge: "Returning user",
    accent: "from-slate-900 via-slate-800 to-slate-900",
    description: "Jump back into your spending plan and keep momentum.",
  },
} as const;

const features = [
  { title: "Real-time spending", desc: "See income and expenses together, with smart alerts when budgets run hot." },
  { title: "Goal tracking", desc: "Save toward big purchases with linked contributions and clear progress bars." },
  { title: "Category control", desc: "Custom categories for income and expenses so your data stays clean." },
  { title: "Insights you can act on", desc: "Stacked bars, trends, and category splits help you adjust fast." },
];

const steps = [
  { title: "Connect your plan", desc: "Set goals and monthly budgets that match your real life." },
  { title: "Log income & expenses", desc: "Add transactions in seconds, tied to the right categories and goals." },
  { title: "Adjust with insights", desc: "Use trends and category breakdowns to course-correct mid-month." },
];

const previews = [
  {
    title: "Monthly trends",
    desc: "Income vs expenses with category stacks.",
    sub: "Spot patterns in your spending before the month is over.",
    tag: "Insights",
  },
  {
    title: "Goals & budgets",
    desc: "Track progress and stay under target.",
    sub: "See how far you are from your savings and spending targets.",
    tag: "Planning",
  },
];

export default function Home() {
  const [mode, setMode] = useState<"signup" | "login">("signup");
  const config = useMemo(() => toggleOptions[mode], [mode]);
  const authRef = useRef<HTMLDivElement | null>(null);

  const scrollToAuth = (nextMode: "signup" | "login") => {
    setMode(nextMode);
    requestAnimationFrame(() => {
      authRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/4 top-10 h-64 w-64 rounded-full bg-teal-500/30 blur-[120px]" />
        <div className="absolute right-10 bottom-10 h-72 w-72 rounded-full bg-indigo-500/30 blur-[140px]" />
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-white/10 to-transparent" />
      </div>

      <FadeInOnView className="relative mx-auto max-w-6xl px-6 py-10 lg:py-14">
        <header className="flex items-center justify-between gap-4 rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-slate-100 backdrop-blur">
          <div className="flex items-center gap-2">
            <img src="/icon.svg" alt="SpendScope" className="h-7 w-7" />
            <span className="uppercase tracking-[0.12em] text-teal-200">SpendScope</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => scrollToAuth("login")}
              className="rounded-full border border-white/30 px-4 py-2 text-xs font-semibold text-slate-100 transition hover:border-white/60 hover:bg-white/10"
            >
              Log in
            </button>
            <button
              type="button"
              onClick={() => scrollToAuth("signup")}
              className="rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-teal-500/30 transition hover:shadow-xl"
            >
              Get started
            </button>
          </div>
        </header>

        <div className="mt-12 grid gap-10 lg:grid-cols-[1.05fr,0.95fr] lg:items-start">
          <div className="space-y-8">
            <div className="space-y-4">
              <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-teal-200">
                Personal finance, clear and fast
              </p>
              <h1 className="text-4xl font-semibold leading-tight text-white sm:text-5xl">
                Own your budget. Fund your goals. Stay in control.
              </h1>
              <p className="max-w-2xl text-lg text-slate-300">
                SpendScope gives you a clean command center for spending, saving, and staying on plan. Track goals, keep budgets honest, and see trends before they derail you.
              </p>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => scrollToAuth("signup")}
                  className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-md shadow-white/20 transition hover:-translate-y-0.5 hover:shadow-lg"
                >
                  Start for free
                </button>
                <button
                  type="button"
                  onClick={() => scrollToAuth("login")}
                  className="rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:border-white/50 hover:bg-white/10"
                >
                  I already have an account
                </button>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="flex h-full flex-col gap-2 rounded-2xl border border-white/10 bg-white/5 p-4 shadow-lg shadow-black/20 transition hover:-translate-y-1 hover:border-white/20"
                >
                  <div className="flex items-center gap-2 text-sm font-semibold text-white">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                    {feature.title}
                  </div>
                  <p className="text-sm text-slate-300">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div
            ref={authRef}
            className="relative rounded-3xl border border-white/10 bg-white/95 p-8 text-slate-900 shadow-[0_30px_120px_-50px_rgba(15,23,42,0.9)]"
          >
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
                  {mode === "signup" ? "✓" : "↺"}
                </span>
                <span className="font-semibold">
                  {mode === "signup" ? "Already onboarded? Switch to log in." : "New here? Switch back to create your account."}
                </span>
              </div>
            </div>
          </div>
        </div>
      </FadeInOnView>

      <FadeInOnView className="relative mx-auto max-w-6xl px-6 pb-16">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-[0_20px_80px_-40px_rgba(0,0,0,0.6)] backdrop-blur">
          <div className="grid gap-10 lg:grid-cols-[1.1fr,0.9fr] lg:items-start">
            <div className="space-y-4">
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-teal-200">How it works</p>
              <h2 className="text-3xl font-semibold text-white">Plan, track, and adjust without spreadsheets.</h2>
              <p className="text-slate-300">
                SpendScope keeps your budgets, goals, and categories in one clean place. Know where your money is going and what&apos;s left to save.
              </p>
              <div className="space-y-3">
                {steps.map((step, idx) => (
                  <div
                    key={step.title}
                    className="flex gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 text-slate-100 transition hover:-translate-y-1 hover:border-white/20"
                  >
                    <span className="mt-1 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-sm font-bold text-white">
                      {idx + 1}
                    </span>
                    <div>
                      <p className="text-base font-semibold">{step.title}</p>
                      <p className="text-sm text-slate-300">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {previews.map((card) => (
                <div
                  key={card.title}
                  className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-white/0 p-4 shadow-lg shadow-black/30 transition hover:-translate-y-1 hover:border-white/20 hover:shadow-[0_20px_60px_-40px_rgba(0,0,0,0.6)]"
                >
                  <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-teal-200">
                    {card.tag}
                  </div>
                  <p className="text-lg font-semibold text-white">{card.title}</p>
                  <p className="mt-1 text-sm text-slate-200">{card.desc}</p>
                  <p className="text-xs font-semibold text-emerald-200/90">{card.sub}</p>
                  <div className="mt-4 rounded-xl bg-slate-900/60 p-4 backdrop-blur">
                    <div className="mb-3 h-2 w-20 rounded-full bg-white/20" />
                    <div className="flex items-end gap-2">
                      <div className="h-12 w-7 rounded-full bg-emerald-400/80" />
                      <div className="h-16 w-7 rounded-full bg-emerald-300/80" />
                      <div className="h-9 w-7 rounded-full bg-emerald-500/70" />
                      <div className="h-14 w-7 rounded-full bg-emerald-200/80" />
                      <div className="h-10 w-7 rounded-full bg-emerald-400/60" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-white">Ready to take control?</p>
              <p className="text-sm text-slate-200">Start a plan that keeps your money aligned with your goals.</p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => scrollToAuth("signup")}
                className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-md shadow-white/20 transition hover:-translate-y-0.5 hover:shadow-lg"
              >
                Create account
              </button>
              <Link
                href="/dashboard"
                className="rounded-full border border-white/30 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:border-white/60 hover:bg-white/10"
              >
                View dashboard
              </Link>
            </div>
          </div>
        </div>
      </FadeInOnView>
    </main>
  );
}
