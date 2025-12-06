'use client';

import { useRouter } from "next/navigation";
import { useState } from "react";
import { TransactionSchema, type TransactionValues } from "../lib/validation";

type FormState = { amount: string; description: string };
type FieldErrors = Partial<Record<keyof FormState, string>>;

export function TransactionForm() {
    const inputClass =
        "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 transition focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-200";
    const labelClass = "mb-2 block text-sm font-semibold text-slate-700";
    const buttonClass =
        "w-full rounded-xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-400/30 transition hover:from-slate-800 hover:via-slate-900 hover:to-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 disabled:cursor-not-allowed disabled:opacity-60";

    const [form, setForm] = useState<FormState>({
        amount: "",
        description: "",
    });
    const [errors, setErrors] = useState<FieldErrors>({});
    const [message, setMessage] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target;
        setForm((prevForm) => ({
            ...prevForm,
            [name]: value,
        }));
        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: undefined,
        }));
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setMessage(null);

        const parsedAmount = Number(form.amount);
        const result = TransactionSchema.safeParse({
            amount: parsedAmount,
            description: form.description,
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
            const res = await fetch("/api/transaction", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    amount: parsedAmount,
                    description: form.description,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                setMessage(data.error || "Failed to create transaction.");
                return;
            }

            setMessage("Transaction added.");
            setForm({ amount: "", description: "" });
            router.refresh(); // refresh server data (balance card)
        } catch (error) {
            setMessage("An unexpected error occurred.");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
            <div>
                <label htmlFor="amount" className={labelClass}>
                    Amount
                </label>
                <input
                    id="amount"
                    name="amount"
                    type="number"
                    inputMode="decimal"
                    step="0.01"
                    value={form.amount}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="e.g., 120.50"
                    required
                />
                {errors.amount && (
                    <p className="mt-1 text-sm font-medium text-red-500">{errors.amount}</p>
                )}
            </div>

            <div>
                <label htmlFor="description" className={labelClass}>
                    Description
                </label>
                <input
                    id="description"
                    name="description"
                    type="text"
                    value={form.description}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="Groceries, rent, salary, etc."
                    required
                />
                {errors.description && (
                    <p className="mt-1 text-sm font-medium text-red-500">{errors.description}</p>
                )}
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className={buttonClass}
            >
                {isSubmitting ? "Adding..." : "Add transaction"}
            </button>

            {message && (
                <p
                    className={`text-sm font-medium ${
                        message.toLowerCase().includes("added")
                            ? "text-emerald-600"
                            : "text-red-600"
                    }`}
                >
                    {message}
                </p>
            )}
        </form>
    );
}
