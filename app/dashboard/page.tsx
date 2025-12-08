import Link from "next/link";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/app/lib/supabaseServer";
import { TransactionForm } from "@/app/ui/TrasnsactionForm";
import { CategoryPieChart } from "@/app/ui/CategoryPieChart";
import { TransactionList } from "@/app/ui/TransactionList";
import { MonthlyTrendsChart } from "@/app/ui/MonthlyTrendsChart";
import { GoalForm } from "@/app/ui/GoalForm";
import { GoalList } from "@/app/ui/GoalList";
import { CategoryManager } from "@/app/ui/CategoryManager";
import { DashboardTabs } from "@/app/ui/DashboardTabs";

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
    .select("id, amount, description, category, type, goalId, createdAt")
    .eq("userId", user.id)
    .order("createdAt", { ascending: false });

  const { data: budgets = [], error: budgetError } = await supabase
    .from("Budget")
    .select("id, category, amount")
    .eq("userId", user.id);

  const { data: goals = [], error: goalError } = await supabase
    .from("Goal")
    .select("id, title, targetAmount, isCompleted")
    .eq("userId", user.id)
    .order("createdAt", { ascending: false });

  const { data: categories = [], error: categoryError } = await supabase
    .from("Category")
    .select("id, name, type")
    .eq("userId", user.id)
    .order("name", { ascending: true });
  const safeCategories = categories ?? [];

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
  const monthsToShow = 6;
  const startOfWindow = new Date(now.getFullYear(), now.getMonth() - (monthsToShow - 1), 1);
  const monthlyExpenseTotals: Record<string, number> = {};
  const monthlyIncomeTotals: Record<string, number> = {};
  const monthlyExpenseByCategory: Record<string, Record<string, number>> = {};
  const expenseTotalsByCategoryWindow: Record<string, number> = {};
  const savedByGoal: Record<number, number> = {};
  const linkedTxCount: Record<number, number> = {};

  for (const tx of txs) {
    const cat = tx.category ?? "OTHER";
    const amt = Math.abs(tx.amount ?? 0);
    const txDate = tx.createdAt ? new Date(tx.createdAt) : null;
    const isThisMonth =
      txDate &&
      txDate.getMonth() === now.getMonth() &&
      txDate.getFullYear() === now.getFullYear();

    if (typeof tx.goalId === "number") {
      const contribution = Math.abs(tx.amount ?? 0);
      savedByGoal[tx.goalId] = (savedByGoal[tx.goalId] ?? 0) + contribution;
      linkedTxCount[tx.goalId] = (linkedTxCount[tx.goalId] ?? 0) + 1;
    }

    if (tx.type === "EXPENSE") {
      expenseTotals[cat] = (expenseTotals[cat] ?? 0) + amt;
      if (isThisMonth) {
        spentThisMonthByCategory[cat] = (spentThisMonthByCategory[cat] ?? 0) + amt;
      }
    } else {
      incomeTotals[cat] = (incomeTotals[cat] ?? 0) + amt;
    }

    if (txDate && txDate >= startOfWindow) {
      const monthKey = `${txDate.getFullYear()}-${txDate.getMonth()}`;
      if (tx.type === "EXPENSE") {
        monthlyExpenseTotals[monthKey] = (monthlyExpenseTotals[monthKey] ?? 0) + amt;
        const catTotals = monthlyExpenseByCategory[monthKey] ?? {};
        monthlyExpenseByCategory[monthKey] = {
          ...catTotals,
          [cat]: (catTotals[cat] ?? 0) + amt,
        };
        expenseTotalsByCategoryWindow[cat] = (expenseTotalsByCategoryWindow[cat] ?? 0) + amt;
      } else {
        monthlyIncomeTotals[monthKey] = (monthlyIncomeTotals[monthKey] ?? 0) + amt;
      }
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

  const goalProgress = (goals ?? []).map((goal) => {
    const saved = Math.max(0, savedByGoal[goal.id] ?? 0);
    const rawPct = goal.targetAmount > 0 ? (saved / goal.targetAmount) * 100 : 0;
    const progressPct = Math.min(rawPct, 100);
    const linkedTransactions = linkedTxCount[goal.id] ?? 0;
    const isCompleted = (goal as any).isCompleted || saved >= goal.targetAmount;
    return {
      ...goal,
      savedAmount: saved,
      progressPct,
      linkedTransactions,
      isCompleted,
      wasCompleted: (goal as any).isCompleted ?? false,
    };
  });

  const newlyCompletedIds = goalProgress
    .filter((goal) => goal.isCompleted && !goal.wasCompleted)
    .map((goal) => goal.id);

  if (newlyCompletedIds.length) {
    await supabase
      .from("Goal")
      .update({ isCompleted: true, updatedAt: new Date().toISOString() })
      .in("id", newlyCompletedIds);
  }

  const activeGoals = goalProgress.filter((goal) => !goal.isCompleted);
  const finishedGoals = goalProgress.filter((goal) => goal.isCompleted);

  const monthBuckets = Array.from({ length: monthsToShow }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - (monthsToShow - 1 - index), 1);
    const key = `${date.getFullYear()}-${date.getMonth()}`;
    const label = date.toLocaleDateString(undefined, { month: "short" });
    const year = date.getFullYear();
    return { key, label: `${label} '${String(year).slice(-2)}`, year };
  });

  const topExpenseCategories = Object.entries(expenseTotalsByCategoryWindow)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([category]) => category);

  const monthlyChartData = monthBuckets.map(({ key, label }) => {
    const categoryTotals = monthlyExpenseByCategory[key] ?? {};
    const dataPoint: { monthLabel: string; expenseTotal: number; incomeTotal: number } & Record<string, number> = {
      monthLabel: label,
      expenseTotal: monthlyExpenseTotals[key] ?? 0,
      incomeTotal: monthlyIncomeTotals[key] ?? 0,
    };

    for (const cat of topExpenseCategories) {
      dataPoint[cat] = categoryTotals[cat] ?? 0;
    }

    const otherTotal = Object.entries(categoryTotals).reduce((sum, [cat, value]) => {
      return topExpenseCategories.includes(cat) ? sum : sum + value;
    }, 0);

    if (otherTotal > 0) {
      dataPoint.Other = otherTotal;
    }

    return dataPoint;
  });

  const expenseStackKeys = [...topExpenseCategories];
  const hasOtherExpenses = Object.keys(monthlyExpenseByCategory).some((key) => {
    const categoryTotals = monthlyExpenseByCategory[key];
    return Object.keys(categoryTotals).some((cat) => !topExpenseCategories.includes(cat));
  });
  if (hasOtherExpenses) {
    expenseStackKeys.push("Other");
  }

  const monthlyExpenseSeries = monthBuckets.map(({ key }) => monthlyExpenseTotals[key] ?? 0);
  const averageMonthlySpend =
    monthlyExpenseSeries.reduce((sum, value) => sum + value, 0) / monthBuckets.length;

  const highestCategoryThisMonth = Object.entries(spentThisMonthByCategory)
    .sort((a, b) => b[1] - a[1])
    .map(([category, amount]) => ({ category, amount }))[0];

  const currentMonthKey = monthBuckets[monthBuckets.length - 1]?.key;
  const lastMonthKey = monthBuckets[monthBuckets.length - 2]?.key;
  const thisMonthSpend = currentMonthKey ? monthlyExpenseTotals[currentMonthKey] ?? 0 : 0;
  const lastMonthSpend = lastMonthKey ? monthlyExpenseTotals[lastMonthKey] ?? 0 : 0;
  const monthOverMonthChange =
    lastMonthSpend > 0 ? ((thisMonthSpend - lastMonthSpend) / lastMonthSpend) * 100 : null;

  const overviewContent = (
    <>
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
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Saving goals</h2>
            <p className="text-sm text-slate-600">Create goals and link transactions to track progress.</p>
          </div>
          {goalError && (
            <p className="text-xs font-semibold text-amber-600">Couldn&apos;t load goals.</p>
          )}
        </div>
        <div className="grid gap-6 lg:grid-cols-[1.1fr_1.4fr]">
          <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4">
            <p className="mb-2 text-sm font-semibold text-slate-800">Add a goal</p>
            <GoalForm />
          </div>
          <div>
            <GoalList goals={activeGoals} />
            {finishedGoals.length > 0 && (
              <div className="mt-6 space-y-3">
                <h3 className="text-sm font-semibold text-slate-700">Finished goals</h3>
                <GoalList goals={finishedGoals} />
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );

  const transactionsContent = (
    <>
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-slate-900">Add transaction</h2>
          <p className="text-sm text-slate-600">
            Log an expense or income to keep your budget up to date.
          </p>
        </div>
        <TransactionForm
          goals={goalProgress.map((goal) => ({ id: goal.id, title: goal.title }))}
          categories={safeCategories}
        />
        {categoryError && (
          <p className="mt-3 text-xs font-semibold text-amber-600">Couldn&apos;t load categories.</p>
        )}
      </section>

      <section>
        <TransactionList transactions={txs} />
      </section>
    </>
  );

  const insightsContent = (
    <>
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Monthly trends</h2>
            <p className="text-sm text-slate-600">Track income and expenses across the last {monthsToShow} months.</p>
          </div>
          <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white">
            {monthBuckets[0]?.label} - {monthBuckets[monthBuckets.length - 1]?.label}
          </span>
        </div>
        <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
          <MonthlyTrendsChart data={monthlyChartData} expenseStackKeys={expenseStackKeys} />
          <div className="grid gap-3 text-sm font-semibold text-slate-800">
            <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-500">Average monthly spend</p>
              <p className="mt-2 text-2xl font-bold text-slate-900">{formatCurrency(averageMonthlySpend)}</p>
              <p className="text-xs text-slate-500">Across the last {monthsToShow} months.</p>
            </div>
            <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-500">Highest category this month</p>
              {highestCategoryThisMonth ? (
                <div className="mt-2 space-y-1">
                  <p className="text-lg font-bold text-slate-900">{formatCategory(highestCategoryThisMonth.category)}</p>
                  <p className="text-sm text-slate-600">{formatCurrency(highestCategoryThisMonth.amount)} spent</p>
                </div>
              ) : (
                <p className="mt-2 text-sm text-slate-600">No expenses recorded yet.</p>
              )}
            </div>
            <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-500">This month vs last</p>
              <div className="mt-2 flex items-center justify-between">
                <div>
                  <p className="text-lg font-bold text-slate-900">{formatCurrency(thisMonthSpend)}</p>
                  <p className="text-xs text-slate-500">This month</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-slate-700">{formatCurrency(lastMonthSpend)} last month</p>
                  {monthOverMonthChange !== null ? (
                    <p className={`text-xs font-semibold ${monthOverMonthChange <= 0 ? "text-emerald-600" : "text-rose-600"}`}>
                      {monthOverMonthChange > 0 ? "+" : ""}
                      {monthOverMonthChange.toFixed(1)}% vs last month
                    </p>
                  ) : (
                    <p className="text-xs font-semibold text-slate-500">No data for last month.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <CategoryPieChart expenses={expenseChartData} income={incomeChartData} />
      </section>
    </>
  );

  const budgetsCategoriesContent = (
    <>
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Budgets</h2>
            <p className="text-sm text-slate-600">Set monthly budgets on the budgets page.</p>
          </div>
          <Link
            href="/budget"
            className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Open budgets
          </Link>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-slate-900">Manage categories</h2>
          <p className="text-sm text-slate-600">Create income and expense categories to keep entries clean.</p>
        </div>
        <CategoryManager />
      </section>
    </>
  );

  const tabs = [
    { id: "overview", label: "Overview", content: overviewContent },
    { id: "transactions", label: "Transactions", content: transactionsContent },
    { id: "insights", label: "Insights", content: insightsContent },
    { id: "budgets", label: "Budgets & Categories", content: budgetsCategoriesContent },
  ];

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 space-y-8">
      <header className="space-y-2 text-white">
        <p className="text-sm text-slate-300">Welcome back</p>
        <h1 className="text-3xl font-bold">Your dashboard</h1>
        <p className="text-sm text-slate-200">
          Track your spending and save toward your goals.
        </p>
      </header>

      <DashboardTabs tabs={tabs} />
    </main>
  );
}
