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
  if (percent > 100) return "bg-[#b94132]";
  if (percent >= 85) return "bg-[#b97918]";
  return "bg-[#1f6b4e]";
}

export function BudgetList({ budgets, spentByCategory, title = "Budgets", showEmptyState = true }: Props) {
  const safeBudgets = Array.isArray(budgets) ? budgets : [];
  const sortedBudgets = [...safeBudgets].sort((a, b) => a.category.localeCompare(b.category));

  if (!sortedBudgets.length && showEmptyState) {
    return (
      <div className="rounded-[28px] border border-dashed border-[#b9ad9c] bg-[#fffcf6] p-6 shadow-sm">
        <h2 className="text-xl font-extrabold text-[#17211d]">{title}</h2>
        <p className="mt-2 text-sm font-medium leading-6 text-[#4d574f]">
          No budgets yet. Add your first category limit to see month-to-date progress here.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-[28px] border border-[#b9ad9c] bg-[#fffcf6] p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-extrabold text-[#17211d]">{title}</h2>
        <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-[#4d574f]">Month to date</p>
      </div>
      <div className="space-y-4">
        {sortedBudgets.map((budget) => {
          const spent = spentByCategory[budget.category] ?? 0;
          const pct = budget.amount > 0 ? Math.round((spent / budget.amount) * 100) : 0;
          const clamped = Math.min(pct, 120);
          return (
            <div key={budget.category} className="space-y-3 rounded-2xl border border-[#d2c6b6] bg-white p-4">
              <div className="flex flex-wrap items-start justify-between gap-3 text-sm font-semibold text-[#17211d]">
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-[#124b36] px-3 py-1 text-xs font-extrabold text-white">
                    {formatCategory(budget.category)}
                  </span>
                  <span className="font-bold text-[#39443d]">{formatCurrency(spent)} spent</span>
                </div>
                <div className="text-right font-bold text-[#17211d]">
                  <p>{formatCurrency(budget.amount)} budget</p>
                  <p className="text-xs text-[#4d574f]">{pct}% used</p>
                </div>
              </div>
              <div className="h-2.5 rounded-full bg-[#e8decd]">
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
