"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type MonthlyDataPoint = {
  monthLabel: string;
  expenseTotal: number;
  incomeTotal: number;
  [key: string]: string | number;
};

type Props = {
  data: MonthlyDataPoint[];
  expenseStackKeys: string[];
};

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const formatLabel = (value: string) => value.replace(/_/g, " ");

const palette = ["#0ea5e9", "#818cf8", "#f472b6", "#fb7185", "#f59e0b", "#34d399"];

export function MonthlyTrendsChart({ data, expenseStackKeys }: Props) {
  const stackKeys = expenseStackKeys.length ? expenseStackKeys : ["expenseTotal"];
  const hasData = data.some(
    (item) => (item.expenseTotal ?? 0) > 0 || (item.incomeTotal ?? 0) > 0,
  );

  if (!hasData) {
    return (
      <div className="flex h-[320px] items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 text-sm font-semibold text-slate-500">
        No transactions yet in this range.
      </div>
    );
  }

  return (
    <div className="h-[320px] w-full">
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="monthLabel" tickLine={false} axisLine={false} />
          <YAxis
            tickFormatter={(value) => currency.format(Number(value))}
            tickLine={false}
            axisLine={{ stroke: "#e2e8f0" }}
            width={64}
          />
          <Tooltip
            formatter={(value, name) => [currency.format(value as number), formatLabel(String(name))]}
            labelFormatter={(label) => `Month: ${label}`}
          />
          <Legend
            formatter={(value) =>
              value === "incomeTotal"
                ? "Income"
                : value === "expenseTotal"
                  ? "Total expenses"
                  : formatLabel(String(value))
            }
          />
          {stackKeys.map((key, idx) => (
            <Bar
              key={key}
              dataKey={key}
              stackId="expenses"
              name={formatLabel(key)}
              fill={palette[idx % palette.length]}
              radius={idx === stackKeys.length - 1 ? [4, 4, 0, 0] : 0}
            />
          ))}
          <Line
            type="monotone"
            dataKey="incomeTotal"
            name="Income"
            stroke="#0ea5e9"
            strokeWidth={2}
            dot={{ r: 3 }}
          />
          <Line
            type="monotone"
            dataKey="expenseTotal"
            name="Total expenses"
            stroke="#ef4444"
            strokeWidth={1.5}
            strokeDasharray="4 4"
            dot={{ r: 2 }}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
