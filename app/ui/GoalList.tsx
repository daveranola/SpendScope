"use client";

type GoalProgress = {
  id: number;
  title: string;
  targetAmount: number;
  savedAmount: number;
  progressPct: number;
  linkedTransactions: number;
};

type Props = {
  goals: GoalProgress[];
};

const formatCurrency = (value: number) => {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  });
  return formatter.format(value);
};

export function GoalList({ goals }: Props) {
  const hasGoals = goals.length > 0;

  if (!hasGoals) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-sm font-semibold text-slate-500">
        No goals yet. Create one to start saving toward it.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {goals.map((goal) => (
        <div key={goal.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-slate-900">{goal.title}</p>
              <p className="text-xs font-medium text-slate-500">
                Target {formatCurrency(goal.targetAmount)}
              </p>
            </div>
            <div className="text-right text-sm font-semibold text-slate-800">
              <p>{formatCurrency(goal.savedAmount)} saved</p>
              <p className="text-xs text-slate-500">{goal.linkedTransactions} linked txs</p>
            </div>
          </div>
          <div className="mt-3 h-2 rounded-full bg-slate-200">
            <div
              className={`h-full rounded-full ${
                goal.progressPct >= 100 ? "bg-emerald-500" : "bg-blue-500"
              }`}
              style={{ width: `${Math.min(goal.progressPct, 120)}%` }}
            />
          </div>
          <div className="mt-2 flex items-center justify-between text-xs font-semibold text-slate-600">
            <span>{goal.progressPct.toFixed(0)}% to goal</span>
            <span>Remaining {formatCurrency(Math.max(goal.targetAmount - goal.savedAmount, 0))}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
