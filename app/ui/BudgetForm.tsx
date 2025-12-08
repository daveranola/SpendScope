"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function BudgetForm() {
  const [category, setCategory] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [message, setMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 transition focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-200";
  const labelClass = "mb-2 block text-sm font-semibold text-slate-700";

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage(null);

    const parsedAmount = Number(amount);
    if (Number.isNaN(parsedAmount) || parsedAmount < 0) {
      setMessage("Budget must be 0 or greater.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/budget", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, amount: parsedAmount }),
      });

      const data = await res.json();
      if (!res.ok) {
        setMessage(data?.error || "Failed to save budget.");
        return;
      }

      setMessage("Budget saved.");
      setAmount("");
      router.refresh();
    } catch (_err) {
      setMessage("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div>
        <label className={labelClass} htmlFor="budget-category">
          Category
        </label>
        <input
          id="budget-category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className={inputClass}
          placeholder="e.g., Groceries"
          required
        />
      </div>

      <div>
        <label className={labelClass} htmlFor="budget-amount">
          Monthly budget
        </label>
        <input
          id="budget-amount"
          type="number"
          min="0"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="e.g., 300"
          className={inputClass}
          required
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-400/30 transition hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Saving..." : "Save budget"}
      </button>

      {message && (
        <p
          className={`text-sm font-semibold ${message.toLowerCase().includes("saved") ? "text-emerald-600" : "text-rose-600"}`}
        >
          {message}
        </p>
      )}
    </form>
  );
}
