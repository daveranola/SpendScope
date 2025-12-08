"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { GoalSchema } from "@/app/lib/validation";

type FormState = {
  title: string;
  targetAmount: string;
};

type FieldErrors = Partial<Record<keyof FormState, string>>;

export function GoalForm() {
  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 transition focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-200";
  const labelClass = "mb-2 block text-sm font-semibold text-slate-700";
  const buttonClass =
    "w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-400/30 transition hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 disabled:cursor-not-allowed disabled:opacity-60";

  const [form, setForm] = useState<FormState>({ title: "", targetAmount: "" });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [message, setMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage(null);

    const parsedAmount = Number(form.targetAmount);
    const result = GoalSchema.safeParse({
      title: form.title,
      targetAmount: parsedAmount,
    });

    if (!result.success) {
      const fieldErrors: FieldErrors = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof FormState;
        if (!fieldErrors[field]) {
          fieldErrors[field] = issue.message;
        }
      }
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/goal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: form.title, targetAmount: parsedAmount }),
      });

      const data = await res.json();
      if (!res.ok) {
        setMessage(data?.error || "Failed to create goal.");
        return;
      }

      setMessage("Goal created.");
      setForm({ title: "", targetAmount: "" });
      router.refresh();
    } catch (_err) {
      setMessage("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <div>
        <label className={labelClass} htmlFor="goal-title">
          Goal name
        </label>
        <input
          id="goal-title"
          name="title"
          type="text"
          value={form.title}
          onChange={handleChange}
          placeholder="New laptop, vacation fund..."
          className={inputClass}
          required
        />
        {errors.title && <p className="mt-1 text-sm font-medium text-red-500">{errors.title}</p>}
      </div>

      <div>
        <label className={labelClass} htmlFor="goal-target">
          Target amount
        </label>
        <input
          id="goal-target"
          name="targetAmount"
          type="number"
          min="0.01"
          step="0.01"
          value={form.targetAmount}
          onChange={handleChange}
          placeholder="1200"
          className={inputClass}
          required
        />
        {errors.targetAmount && (
          <p className="mt-1 text-sm font-medium text-red-500">{errors.targetAmount}</p>
        )}
      </div>

      <button type="submit" disabled={isSubmitting} className={buttonClass}>
        {isSubmitting ? "Creating..." : "Create goal"}
      </button>

      {message && (
        <p
          className={`text-sm font-semibold ${
            message.toLowerCase().includes("goal created") ? "text-emerald-600" : "text-rose-600"
          }`}
        >
          {message}
        </p>
      )}
    </form>
  );
}
