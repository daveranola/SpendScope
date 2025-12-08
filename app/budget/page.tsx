import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/app/lib/supabaseServer";
import { BudgetForm } from "@/app/ui/BudgetForm";
import { BudgetList } from "@/app/ui/BudgetList";

export default async function BudgetPage() {
  const supabase = createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

  const { data: budgets = [], error: budgetError } = await supabase
    .from("Budget")
    .select("id, category, amount")
    .eq("userId", user.id);

  const { data: transactions = [], error: txError } = await supabase
    .from("Transaction")
    .select("amount, category, type, createdAt")
    .eq("userId", user.id)
    .gte("createdAt", startOfMonth);

  const spentByCategory: Record<string, number> = {};
  for (const tx of transactions ?? []) {
    if (tx.type !== "EXPENSE") continue;
    const txDate = tx.createdAt ? new Date(tx.createdAt) : null;
    if (!txDate || txDate.getMonth() !== now.getMonth() || txDate.getFullYear() !== now.getFullYear()) continue;
    const cat = tx.category ?? "OTHER";
    const amt = Math.abs(tx.amount ?? 0);
    spentByCategory[cat] = (spentByCategory[cat] ?? 0) + amt;
  }

  const safeBudgets = budgets ?? [];

  return (
    <main className="mx-auto max-w-4xl px-4 py-10 space-y-8">
      <header className="space-y-2 text-white">
        <p className="text-sm text-slate-300">Budgets</p>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-3xl font-bold">Plan your monthly spending</h1>
          <a
            href="/dashboard"
            className="text-xs font-semibold text-slate-200 underline underline-offset-4 transition hover:text-white"
          >
            Back to dashboard
          </a>
        </div>
        <p className="text-sm text-slate-200">Set category limits and track usage month to date.</p>
      </header>

      {(budgetError || txError) && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800">
          Failed to load all data. You can still set budgets, but some numbers may be missing.
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-[1.2fr_1.8fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Set a budget</h2>
          <p className="text-sm text-slate-600">Choose a category and monthly amount.</p>
          <div className="mt-4">
            <BudgetForm />
          </div>
        </div>

        <BudgetList budgets={safeBudgets} spentByCategory={spentByCategory} title="Your budgets" />
      </div>
    </main>
  );
}
