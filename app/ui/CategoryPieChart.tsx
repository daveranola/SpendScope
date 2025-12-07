"use client";

import { PieChart, Pie, Tooltip, ResponsiveContainer, Cell, Legend } from "recharts";

type CategoryTotal = {
  category: string;
  total: number;
};

type Props = {
  expenses: CategoryTotal[];
  income: CategoryTotal[];
};

const expenseColors = ["#f97316", "#fb923c", "#fbbf24", "#fcd34d", "#f59e0b"];
const incomeColors = ["#0ea5e9", "#22d3ee", "#2dd4bf", "#34d399", "#4ade80"];

const formatCurrency = (value: number) => `$${value.toFixed(2)}`;

function renderPie(data: CategoryTotal[], colors: string[], label: string) {
  if (!data.length) {
    return (
      <div className="flex h-64 w-full items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 text-sm text-slate-500">
        No {label.toLowerCase()} yet.
      </div>
    );
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            dataKey="total"
            nameKey="category"
            cx="50%"
            cy="50%"
            outerRadius={80}
            labelLine={false}
          >
            {data.map((entry, index) => (
              <Cell key={entry.category} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value: number) => formatCurrency(value)} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export function CategoryPieChart({ expenses, income }: Props) {
  const totalExpenses = expenses.reduce((sum, item) => sum + item.total, 0);
  const totalIncome = income.reduce((sum, item) => sum + item.total, 0);
  const netIncome = totalIncome - totalExpenses;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm">
          <span>Net income</span>
          <span className={netIncome >= 0 ? "text-emerald-300" : "text-rose-200"}>{formatCurrency(netIncome)}</span>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm">
          <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: incomeColors[0] }} />
          <span>Income {formatCurrency(totalIncome)}</span>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm">
          <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: expenseColors[0] }} />
          <span>Expenses {formatCurrency(totalExpenses)}</span>
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="mb-3 text-sm font-semibold text-slate-700">Expenses by category</p>
          {renderPie(expenses, expenseColors, "expenses")}
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="mb-3 text-sm font-semibold text-slate-700">Income by category</p>
          {renderPie(income, incomeColors, "income")}
        </div>
      </div>
    </div>
  );
}
