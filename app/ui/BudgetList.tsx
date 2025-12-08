type BudgetEntry = {
  category: string;
  amount: number;
};

type Props = {
  budgets: BudgetEntry[];
  spentByCategory: Record<string, number>;
  title?: string;
  showEmptyState?: boolean;
};

function formatCurrency(value: number) {
  return `$${value.toFixed(2)}`;
}

function formatCategory(cat: string) {
  return cat.replace(/_/g, " ");
}

function barColor(percent: number) {
  if (percent > 100) return "bg-rose-500";
  if (percent >= 85) return "bg-amber-400";
  return "bg-emerald-500";
}

export function BudgetList({ budgets, spentByCategory, title = "Budgets", showEmptyState = true }: Props) {
  const safeBudgets = Array.isArray(budgets) ? budgets : [];
  const sortedBudgets = [...safeBudgets].sort((a, b) => a.category.localeCompare(b.category));

  if (!sortedBudgets.length && showEmptyState) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
        <p className="mt-2 text-sm text-slate-600">No budgets yet. Add one to get started.</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Month to date</p>
      </div>
      <div className="space-y-4">
        {sortedBudgets.map((budget) => {
          const spent = spentByCategory[budget.category] ?? 0;
          const pct = budget.amount > 0 ? Math.round((spent / budget.amount) * 100) : 0;
          const clamped = Math.min(pct, 120);
          return (
            <div key={budget.category} className="space-y-2 rounded-xl border border-slate-100 bg-slate-50/60 p-4">
              <div className="flex items-center justify-between text-sm font-semibold text-slate-800">
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white">
                    {formatCategory(budget.category)}
                  </span>
                  <span className="text-slate-500">{formatCurrency(spent)} spent</span>
                </div>
                <div className="text-right text-slate-600">
                  <p>{formatCurrency(budget.amount)} budget</p>
                  <p className="text-xs text-slate-500">{pct}% used</p>
                </div>
              </div>
              <div className="h-2 rounded-full bg-slate-200">
                <div
                  className={`h-full rounded-full ${barColor(pct)}`}
                  style={{ width: `${Math.min(clamped, 100)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
