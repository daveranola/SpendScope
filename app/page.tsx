"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo, useRef, useState } from "react";
import { SignUpForm } from "./ui/SignUpForm";
import { LoginForm } from "./ui/LoginForm";

const toggleOptions = {
  signup: {
    title: "Create your SpendScope account",
    badge: "Start with a simple plan",
    description: "Set up a few categories, one savings goal, and a monthly spending limit you can come back to.",
  },
  login: {
    title: "Welcome back",
    badge: "Pick up where you left off",
    description: "Review what changed this month and check what is still safe to spend.",
  },
} as const;

const budgetRows = [
  { label: "Groceries", spent: "$426 spent", limit: "$600", percent: 71, color: "bg-[#1f6b4e]" },
  { label: "Eating out", spent: "$182 spent", limit: "$220", percent: 83, color: "bg-[#e7b96f]" },
  { label: "Transport", spent: "$96 spent", limit: "$160", percent: 60, color: "bg-[#516b8b]" },
];

const transactions = [
  { name: "Aldi", meta: "Groceries - today", amount: "-$42.18", tone: "expense" },
  { name: "Paycheck", meta: "Income - May 15", amount: "+$2,450", tone: "income" },
  { name: "Spotify", meta: "Subscription", amount: "-$11.99", tone: "bill" },
];

const useCases = [
  {
    metric: "$875 left",
    title: "You are 11 days from payday",
    copy: "See the amount left after groceries, bills, and the savings transfer you promised yourself.",
    accent: "text-[#1f6b4e]",
  },
  {
    metric: "83% used",
    title: "Groceries are creeping up",
    copy: "Catch a category running hot before the last week of the month, not after it is already over.",
    accent: "text-[#9a6a1f]",
  },
  {
    metric: "$420 saved",
    title: "Savings stays visible",
    copy: "Track goals next to everyday spending so progress does not disappear into a separate note.",
    accent: "text-[#516b8b]",
  },
];

const trendBars = [
  { month: "Jan", height: "h-14", color: "bg-[#516b8b]" },
  { month: "Feb", height: "h-20", color: "bg-[#1f6b4e]" },
  { month: "Mar", height: "h-12", color: "bg-[#e7b96f]" },
  { month: "Apr", height: "h-16", color: "bg-[#1f6b4e]" },
  { month: "May", height: "h-24", color: "bg-[#c96b58]" },
  { month: "Jun", height: "h-16", color: "bg-[#516b8b]" },
];

function ProgressRow({
  label,
  spent,
  limit,
  percent,
  color,
}: {
  label: string;
  spent: string;
  limit: string;
  percent: number;
  color: string;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3 text-sm font-bold text-[#17211d]">
        <span>{label}</span>
        <span className="text-xs text-[#69736c]">{limit}</span>
      </div>
      <div className="h-2 rounded-full bg-[#f1e9da]">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${percent}%` }} />
      </div>
      <p className="text-xs font-semibold text-[#69736c]">{spent}</p>
    </div>
  );
}

function ProductPreview() {
  return (
    <div className="w-full max-w-full min-w-0 overflow-hidden rounded-[28px] border border-[#ded6c8] bg-[#fffcf6] p-4 shadow-[0_28px_80px_-48px_rgba(23,33,29,0.55)] sm:p-5">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#69736c]">May budget snapshot</p>
          <h2 className="mt-1 text-xl font-extrabold text-[#17211d]">11 days until payday</h2>
        </div>
        <span className="rounded-full bg-[#ddefe5] px-3 py-1.5 text-xs font-bold text-[#124b36]">Updated today</span>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {[
          ["Left to spend", "$875", "bg-[#ddefe5] text-[#1f6b4e]"],
          ["Spent so far", "$1,965", "bg-[#f2d9d3] text-[#c96b58]"],
          ["Saved this month", "$420", "bg-[#dde7ef] text-[#516b8b]"],
        ].map(([label, value, classes]) => (
          <div key={label} className={`rounded-2xl p-4 ${classes}`}>
            <p className="text-xs font-bold text-[#69736c]">{label}</p>
            <p className="mt-1 text-2xl font-extrabold">{value}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 grid min-w-0 gap-4 lg:grid-cols-[1.08fr_1fr]">
        <div className="min-w-0 rounded-2xl border border-[#ded6c8] bg-white p-4">
          <h3 className="text-sm font-extrabold text-[#17211d]">Category limits</h3>
          <div className="mt-4 space-y-4">
            {budgetRows.map((row) => (
              <ProgressRow key={row.label} {...row} />
            ))}
          </div>
        </div>

        <div className="min-w-0 rounded-2xl border border-[#ded6c8] bg-white p-4">
          <h3 className="text-sm font-extrabold text-[#17211d]">Recent activity</h3>
          <div className="mt-3 space-y-3">
            {transactions.map((item) => (
              <div key={item.name} className="flex items-center gap-3">
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-extrabold ${
                    item.tone === "income"
                      ? "bg-[#ddefe5] text-[#1f6b4e]"
                      : item.tone === "bill"
                        ? "bg-[#dde7ef] text-[#516b8b]"
                        : "bg-[#f2d9d3] text-[#c96b58]"
                  }`}
                >
                  {item.tone === "income" ? "+" : "-"}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-[#17211d]">{item.name}</p>
                  <p className="truncate text-xs font-semibold text-[#69736c]">{item.meta}</p>
                </div>
                <p className={`shrink-0 text-sm font-extrabold ${item.tone === "income" ? "text-[#1f6b4e]" : "text-[#c96b58]"}`}>
                  {item.amount}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 min-w-0 rounded-2xl border border-[#ded6c8] bg-white p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-sm font-extrabold text-[#17211d]">Spending trend</h3>
          <span className="text-xs font-bold text-[#1f6b4e]">8% lower than last month</span>
        </div>
        <div className="mt-4 flex h-32 min-w-0 items-end justify-between gap-2 overflow-hidden">
          {trendBars.map((bar) => (
            <div key={bar.month} className="flex min-w-0 flex-1 flex-col items-center gap-2">
              <div className={`w-full max-w-10 rounded-t-lg ${bar.height} ${bar.color}`} />
              <span className="text-[11px] font-bold text-[#69736c]">{bar.month}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function UseCaseCard({ metric, title, copy, accent }: (typeof useCases)[number]) {
  return (
    <article className="min-w-0 rounded-[20px] border border-[#ded6c8] bg-[#fffcf6] p-6 shadow-[0_20px_60px_-54px_rgba(23,33,29,0.6)]">
      <p className={`text-sm font-extrabold ${accent}`}>{metric}</p>
      <h3 className="mt-3 text-xl font-extrabold leading-tight text-[#17211d]">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-[#69736c]">{copy}</p>
    </article>
  );
}

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
    <main className="min-h-screen overflow-x-hidden bg-[#f6f1e8] text-[#17211d]">
      <header className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-5 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <Image src="/icon.svg" alt="" width={40} height={40} className="h-10 w-10 shrink-0" />
          <span className="text-lg font-extrabold tracking-tight">SpendScope</span>
        </div>
        <nav className="hidden items-center gap-7 text-sm font-bold text-[#69736c] md:flex">
          <a className="transition hover:text-[#17211d]" href="#use-cases">
            Use cases
          </a>
          <a className="transition hover:text-[#17211d]" href="#auth">
            Start
          </a>
          <Link className="transition hover:text-[#17211d]" href="/dashboard">
            Dashboard
          </Link>
        </nav>
        <div className="hidden items-center gap-2 sm:flex">
          <button
            type="button"
            onClick={() => scrollToAuth("login")}
            className="rounded-full border border-[#ded6c8] bg-[#fffcf6] px-4 py-2 text-sm font-bold text-[#17211d] transition hover:border-[#1f6b4e] hover:text-[#1f6b4e] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e7b96f]"
          >
            Log in
          </button>
          <button
            type="button"
            onClick={() => scrollToAuth("signup")}
            className="hidden rounded-full bg-[#1f6b4e] px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-[#124b36] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e7b96f] sm:inline-flex"
          >
            Start free
          </button>
        </div>
      </header>

      <section className="mx-auto grid w-full max-w-7xl items-center gap-12 px-4 pb-16 pt-8 sm:px-6 lg:grid-cols-[0.92fr_1fr] lg:px-8 lg:pb-24 lg:pt-16">
        <div className="min-w-0">
          <p className="inline-flex rounded-full bg-[#ddefe5] px-3 py-1.5 text-xs font-extrabold uppercase tracking-[0.16em] text-[#124b36]">
            Budgeting for real months
          </p>
          <h1 className="mt-6 max-w-3xl text-5xl font-extrabold leading-[1.02] tracking-tight text-[#17211d] sm:text-6xl">
            See what is left before you overspend.
          </h1>
          <p className="mt-6 max-w-2xl break-words text-lg leading-8 text-[#69736c]">
            SpendScope keeps categories, saving goals, and monthly spending in one place, so you can decide what to spend today without opening a spreadsheet.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => scrollToAuth("signup")}
              className="rounded-full bg-[#1f6b4e] px-5 py-3 text-sm font-extrabold text-white shadow-sm transition hover:bg-[#124b36] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e7b96f]"
            >
              Create your budget
            </button>
            <button
              type="button"
              onClick={() => scrollToAuth("login")}
              className="rounded-full border border-[#ded6c8] bg-[#fffcf6] px-5 py-3 text-sm font-extrabold text-[#17211d] transition hover:border-[#1f6b4e] hover:text-[#1f6b4e] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e7b96f]"
            >
              I already have an account
            </button>
          </div>
          <div className="mt-6 flex flex-wrap gap-2 text-xs font-bold text-[#69736c]">
            <span className="rounded-full border border-[#ded6c8] bg-[#fffcf6] px-3 py-1.5">No bank connection required</span>
            <span className="rounded-full border border-[#ded6c8] bg-[#fffcf6] px-3 py-1.5">Plain categories</span>
            <span className="rounded-full border border-[#ded6c8] bg-[#fffcf6] px-3 py-1.5">Private account</span>
          </div>
        </div>
        <ProductPreview />
      </section>

      <section id="use-cases" className="border-y border-[#ded6c8] bg-[#fffcf6] py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-extrabold uppercase tracking-[0.16em] text-[#1f6b4e]">Real budgeting use cases</p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-[#17211d] sm:text-4xl">
              Built for the moments that usually blow up a budget.
            </h2>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {useCases.map((item) => (
              <UseCaseCard key={item.title} {...item} />
            ))}
          </div>
        </div>
      </section>

      <section id="auth" ref={authRef} className="bg-[#f1e9da] py-16 sm:py-20">
        <div className="mx-auto grid w-full max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-[0.9fr_0.82fr] lg:px-8">
          <div className="min-w-0">
            <p className="text-sm font-extrabold uppercase tracking-[0.16em] text-[#1f6b4e]">A calmer signup flow</p>
            <h2 className="mt-3 max-w-xl text-4xl font-extrabold tracking-tight text-[#17211d]">
              Build a budget you will actually check.
            </h2>
            <p className="mt-5 max-w-xl text-base leading-7 text-[#69736c]">
              Start with the parts most people already think about: categories, monthly limits, and one savings goal. SpendScope turns those into a clear snapshot you can update in a few minutes.
            </p>
            <div className="mt-8 max-w-md rounded-2xl border border-[#ded6c8] bg-[#fffcf6] p-5">
              <div className="flex items-center justify-between gap-4 text-sm font-bold">
                <span>Emergency fund goal</span>
                <span className="text-[#69736c]">$560 of $1,000</span>
              </div>
              <div className="mt-3 h-2 rounded-full bg-[#f1e9da]">
                <div className="h-full w-[56%] rounded-full bg-[#1f6b4e]" />
              </div>
              <p className="mt-3 text-xs font-semibold text-[#69736c]">A small progress cue makes the first account feel useful before the user has lots of data.</p>
            </div>
          </div>

          <div className="min-w-0 rounded-[28px] border border-[#ded6c8] bg-[#fffcf6] p-5 shadow-[0_28px_80px_-54px_rgba(23,33,29,0.55)] sm:p-7">
            <p className="text-sm font-extrabold text-[#1f6b4e]">{config.badge}</p>
            <h3 className="mt-1 text-3xl font-extrabold text-[#17211d]">{config.title}</h3>
            <p className="mt-2 text-sm leading-6 text-[#69736c]">{config.description}</p>

            <div className="mt-6 grid grid-cols-2 rounded-full bg-[#f1e9da] p-1 text-sm font-extrabold">
              {(["signup", "login"] as const).map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setMode(option)}
                  className={`rounded-full px-4 py-2.5 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e7b96f] ${
                    mode === option ? "bg-[#1f6b4e] text-white shadow-sm" : "text-[#69736c] hover:text-[#17211d]"
                  }`}
                >
                  {option === "signup" ? "Sign up" : "Log in"}
                </button>
              ))}
            </div>

            <div className="mt-6 rounded-2xl border border-[#ded6c8] bg-white p-5">
              {mode === "signup" ? <SignUpForm /> : <LoginForm />}
            </div>

            <p className="mt-4 text-xs font-semibold text-[#69736c]">
              {mode === "signup"
                ? "Already have an account? Switch to log in above."
                : "New here? Switch back to create a private SpendScope account."}
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 rounded-[28px] bg-[#124b36] p-8 text-white sm:p-10 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-extrabold tracking-tight">Track spending, savings, and goals without a spreadsheet.</h2>
            <p className="mt-3 text-sm leading-6 text-[#ddefe5]">A simple place to see what happened this month and what is still safe to spend.</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => scrollToAuth("signup")}
              className="rounded-full bg-white px-5 py-3 text-sm font-extrabold text-[#124b36] transition hover:bg-[#f6f1e8] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e7b96f]"
            >
              Create account
            </button>
            <Link
              href="/dashboard"
              className="rounded-full border border-white/35 px-5 py-3 text-center text-sm font-extrabold text-white transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e7b96f]"
            >
              View dashboard
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
