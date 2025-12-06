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
            label={({ percent }) => {
              const pct = percent ?? 0;
              return `${(pct * 100).toFixed(0)}%`;
            }}
            labelLine={false}
          >
            {data.map((entry, index) => (
              <Cell key={entry.category} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export function CategoryPieChart({ expenses, income }: Props) {
  return (
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
  );
}
