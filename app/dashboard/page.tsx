import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/app/lib/supabaseServer";
import { TransactionForm } from "@/app/ui/TrasnsactionForm";
import { CategoryPieChart } from "@/app/ui/CategoryPieChart";

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
    .select("amount, category, type")
    .eq("userId", user.id);

  const balance =
    transactions?.reduce((total, tx) => total + (tx.amount ?? 0), 0) ?? 0;

  const txs = transactions ?? [];

  // build a map: category -> total
  const expenseTotals: Record<string, number> = {};
  const incomeTotals: Record<string, number> = {};

  for (const tx of txs) {
    const cat = tx.category ?? "OTHER";
    const amt = Math.abs(tx.amount ?? 0);

    if (tx.type === "EXPENSE") {
      expenseTotals[cat] = (expenseTotals[cat] ?? 0) + amt;
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
    </main>
  );
}
