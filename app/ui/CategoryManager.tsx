"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CategorySchema, transactionTypes } from "@/app/lib/validation";

type Category = {
  id: number;
  name: string;
  type: (typeof transactionTypes)[number];
};

const inputClass =
  "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 transition focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-200";
const labelClass = "mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600";

export function CategoryManager() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [type, setType] = useState<Category["type"]>("EXPENSE");
  const [message, setMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/category");
      if (!res.ok) return;
      const data = await res.json();
      setCategories(data.categories ?? []);
    }
    load();
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage(null);
    const parsed = CategorySchema.safeParse({ name, type });
    if (!parsed.success) {
      setMessage(parsed.error.issues[0]?.message ?? "Invalid category.");
      return;
    }

    setIsSaving(true);
    try {
      const res = await fetch("/api/category", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, type }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage(data?.error || "Failed to save category.");
        return;
      }
      setCategories((prev) => {
        const existing = prev.find((c) => c.id === data.category.id);
        if (existing) {
          return prev.map((c) => (c.id === existing.id ? data.category : c));
        }
        return [...prev, data.category].sort((a, b) => a.name.localeCompare(b.name));
      });
      setName("");
      setMessage("Category saved.");
      router.refresh();
    } catch (_err) {
      setMessage("An unexpected error occurred.");
    } finally {
      setIsSaving(false);
    }
  }

  const grouped = categories.reduce<Record<Category["type"], Category[]>>(
    (acc, item) => {
      acc[item.type] = acc[item.type] ? [...acc[item.type], item] : [item];
      return acc;
    },
    { EXPENSE: [], INCOME: [] }
  );

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div>
          <label htmlFor="cat-name" className={labelClass}>
            Category name
          </label>
          <input
            id="cat-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Groceries, Salary"
            className={inputClass}
            required
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="cat-type">
            Type
          </label>
          <select
            id="cat-type"
            value={type}
            onChange={(e) => setType(e.target.value as Category["type"])}
            className={inputClass}
          >
            {transactionTypes.map((t) => (
              <option key={t} value={t}>
                {t === "EXPENSE" ? "Expense" : "Income"}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          disabled={isSaving}
          className="w-full rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSaving ? "Saving..." : "Save category"}
        </button>
        {message && (
          <p
            className={`text-xs font-semibold ${
              message.toLowerCase().includes("saved") ? "text-emerald-600" : "text-rose-600"
            }`}
          >
            {message}
          </p>
        )}
      </form>

      <div className="grid gap-3 md:grid-cols-2">
        {transactionTypes.map((t) => (
          <div key={t} className="rounded-xl border border-slate-200 bg-slate-50/60 p-3">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
              {t === "EXPENSE" ? "Expense" : "Income"} categories
            </p>
            {grouped[t].length === 0 ? (
              <p className="text-xs font-semibold text-slate-500">None yet.</p>
            ) : (
              <ul className="space-y-1 text-sm font-semibold text-slate-800">
                {grouped[t].map((cat) => (
                  <li key={cat.id} className="rounded-lg bg-white px-3 py-2 shadow-sm">
                    {cat.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
