import { redirect } from "next/navigation";
import { createSupabaseServerComponentClient } from "@/app/lib/supabaseServer";
import { BudgetForm } from "@/app/ui/BudgetForm";
import { BudgetList } from "@/app/ui/BudgetList";
import { AppShell } from "@/app/ui/AppShell";

export default async function BudgetPage() {
  const supabase = createSupabaseServerComponentClient();

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
  const totalBudgeted = safeBudgets.reduce((sum, budget) => sum + (budget.amount ?? 0), 0);
  const totalSpent = Object.values(spentByCategory).reduce((sum, value) => sum + value, 0);
  const remaining = totalBudgeted - totalSpent;
  const categoriesOverBudget = safeBudgets.filter((budget) => {
    const spent = spentByCategory[budget.category ?? "OTHER"] ?? 0;
    return budget.amount > 0 && spent > budget.amount;
  }).length;

  return (
    <AppShell
      eyebrow="Budgets"
      title="Plan your monthly spending"
      description="Set category limits, see what has been used this month, and adjust before a category goes over."
      actions={
        <a
          href="/dashboard"
          className="inline-flex items-center justify-center rounded-full border border-[#ded6c8] bg-white px-4 py-2.5 text-sm font-extrabold text-[#17211d] transition hover:border-[#1f6b4e] hover:text-[#1f6b4e] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e7b96f]"
        >
          Back to dashboard
        </a>
      }
    >
      <section className="grid gap-4 md:grid-cols-3">
        {[
          { label: "Monthly budgeted", value: `$${totalBudgeted.toFixed(2)}`, detail: `${safeBudgets.length} active budget${safeBudgets.length === 1 ? "" : "s"}` },
          { label: "Spent this month", value: `$${totalSpent.toFixed(2)}`, detail: "Tracked from expense transactions" },
          {
            label: "Remaining",
            value: totalBudgeted > 0 ? `$${remaining.toFixed(2)}` : "Set limits",
            detail: categoriesOverBudget > 0 ? `${categoriesOverBudget} over budget` : "No categories over budget",
          },
        ].map((card) => (
          <div key={card.label} className="rounded-[24px] border border-[#b9ad9c] bg-[#fffcf6] p-5 shadow-sm">
            <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-[#4d574f]">{card.label}</p>
            <p className="mt-2 text-2xl font-extrabold text-[#17211d]">{card.value}</p>
            <p className="mt-2 text-sm font-medium leading-5 text-[#4d574f]">{card.detail}</p>
          </div>
        ))}
      </section>

      {(budgetError || txError) && (
        <div className="rounded-2xl border border-[#e7b96f] bg-[#f8e5c1] px-4 py-3 text-sm font-bold text-[#6f4b13]">
          Failed to load all data. You can still set budgets, but some numbers may be missing.
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.35fr]">
        <div className="rounded-[28px] border border-[#b9ad9c] bg-[#fffcf6] p-6 shadow-sm">
          <h2 className="text-xl font-extrabold text-[#17211d]">Set a budget</h2>
          <p className="mt-1 text-sm font-medium leading-6 text-[#4d574f]">Choose a category and monthly amount. You can update this later as your month changes.</p>
          <div className="mt-4">
            <BudgetForm />
          </div>
        </div>

        <BudgetList budgets={safeBudgets} spentByCategory={spentByCategory} title="Your budgets" />
      </div>
    </AppShell>
  );
}
