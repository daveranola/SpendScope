import Link from "next/link";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/app/lib/supabaseServer";
import { TransactionForm } from "@/app/ui/TrasnsactionForm";
import { CategoryPieChart } from "@/app/ui/CategoryPieChart";
import { TransactionList } from "@/app/ui/TransactionList";

const formatCurrency = (value: number) => `$${value.toFixed(2)}`;
const formatCategory = (value: string) => value.replace(/_/g, " ");

// Dashboard: requires an authenticated user and exposes the transaction form.
export default async function DashboardPage() {
  const supabase = createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  const { data: transactions, error: txError } = await supabase
    .from("Transaction")
    .select("id, amount, description, category, type, createdAt")
    .eq("userId", user.id)
    .order("createdAt", { ascending: false });

  const { data: budgets = [], error: budgetError } = await supabase
    .from("Budget")
    .select("id, category, amount")
    .eq("userId", user.id);

  const now = new Date();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const monthProgress = Math.round((now.getDate() / daysInMonth) * 100);

  const balance =
    transactions?.reduce((total, tx) => total + (tx.amount ?? 0), 0) ?? 0;

  const txs = transactions ?? [];
  const spentThisMonthByCategory: Record<string, number> = {};

  // build a map: category -> total
  const expenseTotals: Record<string, number> = {};
  const incomeTotals: Record<string, number> = {};

  for (const tx of txs) {
    const cat = tx.category ?? "OTHER";
    const amt = Math.abs(tx.amount ?? 0);
    const txDate = tx.createdAt ? new Date(tx.createdAt) : null;
    const isThisMonth =
      txDate &&
      txDate.getMonth() === now.getMonth() &&
      txDate.getFullYear() === now.getFullYear();

    if (tx.type === "EXPENSE") {
      expenseTotals[cat] = (expenseTotals[cat] ?? 0) + amt;
      if (isThisMonth) {
        spentThisMonthByCategory[cat] = (spentThisMonthByCategory[cat] ?? 0) + amt;
      }
    } else {
      incomeTotals[cat] = (incomeTotals[cat] ?? 0) + amt;
    }
  }

  const expenseChartData = Object.entries(expenseTotals).map(([category, total]) => ({
    category,
    total,
  }));

  const incomeChartData = Object.entries(incomeTotals).map(([category, total]) => ({
    category,
    total,
  }));

  const budgetUsage = (budgets ?? []).map((budget) => {
    const spent = spentThisMonthByCategory[budget.category ?? "OTHER"] ?? 0;
    const budgetAmount = budget.amount ?? 0;
    const percentUsed = budgetAmount > 0 ? Math.round((spent / budgetAmount) * 100) : 0;

    return {
      category: budget.category ?? "OTHER",
      budget: budgetAmount,
      spent,
      percentUsed,
    };
  });

  const highlightedBudget = budgetUsage.length
    ? [...budgetUsage].sort((a, b) => b.percentUsed - a.percentUsed)[0]
    : null;

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 space-y-8">
      <header className="space-y-2 text-white">
        <p className="text-sm text-slate-300">Welcome back</p>
        <h1 className="text-3xl font-bold">Your dashboard</h1>
        <p className="text-sm text-slate-200">
          Track your spending and save toward your goals.
        </p>
      </header>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-600">Current balance</p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">
              ${balance.toFixed(2)}
            </p>
          </div>
          {txError && (
            <p className="text-sm font-medium text-red-600">
              Failed to load balance.
            </p>
          )}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-slate-700">Budget health</p>
            {highlightedBudget ? (
              <p className="text-sm text-slate-600">
                You&apos;ve spent {highlightedBudget.percentUsed}% of your {formatCategory(highlightedBudget.category)} budget and we&apos;re {monthProgress}% through the month.
              </p>
            ) : (
              <p className="text-sm text-slate-600">Set monthly budgets to track your progress.</p>
            )}
          </div>
          <Link
            href="/budget"
            className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Manage budgets
          </Link>
        </div>

        {highlightedBudget ? (
          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
              <span>{formatCurrency(highlightedBudget.spent)} spent</span>
              <span>{formatCurrency(highlightedBudget.budget)} budget</span>
            </div>
            <div className="h-2 rounded-full bg-slate-200">
              <div
                className={`h-full rounded-full ${
                  highlightedBudget.percentUsed > 100
                    ? "bg-rose-500"
                    : highlightedBudget.percentUsed >= 85
                      ? "bg-amber-400"
                      : "bg-emerald-500"
                }`}
                style={{ width: `${Math.min(highlightedBudget.percentUsed, 100)}%` }}
              />
            </div>
            <p className="text-xs font-semibold text-slate-500">
              Month progress: {monthProgress}%
            </p>
          </div>
        ) : (
          <p className="mt-4 text-sm font-semibold text-slate-700">
            No budgets yet.
          </p>
        )}
        {budgetError && (
          <p className="mt-3 text-xs font-semibold text-amber-600">Couldn&apos;t load budgets.</p>
        )}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-slate-900">Add transaction</h2>
          <p className="text-sm text-slate-600">
            Log an expense or income to keep your budget up to date.
          </p>
        </div>
        <TransactionForm />
      </section>

      <section>
        <CategoryPieChart expenses={expenseChartData} income={incomeChartData} />
      </section>

      <section>
        <TransactionList transactions={txs} />
      </section>
    </main>
  );
}
