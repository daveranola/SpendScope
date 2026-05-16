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
    "w-full rounded-[14px] border border-[#b9ad9c] bg-[#fffcf6] px-3.5 py-3 text-sm font-semibold text-[#17211d] shadow-sm placeholder:text-[#7c756b] transition hover:border-[#8f8374] focus:border-[#1f6b4e] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#e7b96f]/45 disabled:cursor-not-allowed disabled:border-[#d8cfc0] disabled:bg-[#eee6d8] disabled:text-[#4d574f]";
  const labelClass = "mb-2 block text-sm font-extrabold text-[#17211d]";

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
    } catch {
      setMessage("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const budgetSaved = message?.toLowerCase().includes("saved") ?? false;

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
          autoComplete="off"
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
        className="w-full rounded-[14px] bg-[#1f6b4e] px-4 py-3 text-sm font-extrabold text-white shadow-sm transition hover:bg-[#124b36] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e7b96f] disabled:cursor-not-allowed disabled:bg-[#5f7569] disabled:text-white"
      >
        {isSubmitting ? "Saving..." : "Save budget"}
      </button>

      {message && (
        <p
          role={budgetSaved ? "status" : "alert"}
          className={`rounded-xl px-3 py-2 text-sm font-extrabold ${
            budgetSaved ? "bg-[#ddefe5] text-[#124b36]" : "bg-[#f2d9d3] text-[#8f2f22]"
          }`}
        >
          {message}
        </p>
      )}
    </form>
  );
}
