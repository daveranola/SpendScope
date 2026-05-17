"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  getFieldErrors,
  LoginFormSchema,
  type FieldErrors,
  type LoginValues,
} from "../lib/validation";

const inputClass =
  "w-full rounded-[14px] border border-[#ded6c8] bg-[#fffcf6] px-3.5 py-3 text-sm font-medium text-[#17211d] shadow-sm placeholder:text-[#9b9488] transition focus:border-[#1f6b4e] focus:outline-none focus:ring-2 focus:ring-[#e7b96f]/35";
const labelClass = "mb-2 block text-sm font-bold text-[#17211d]";
const buttonClass =
  "w-full rounded-[14px] bg-[#17211d] px-4 py-3 text-sm font-extrabold text-white shadow-sm transition hover:bg-[#124b36] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e7b96f] disabled:cursor-not-allowed disabled:opacity-60";

const initialFormState: LoginValues = {
  email: "",
  password: "",
};

type LoginFieldErrors = FieldErrors<LoginValues>;

export function LoginForm() {
  const [form, setForm] = useState<LoginValues>(initialFormState);
  const [errors, setErrors] = useState<LoginFieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    const field = name as keyof LoginValues;

    setForm((prevForm) => ({
      ...prevForm,
      [field]: value,
    }));

    setErrors((prevErrors) => ({
      ...prevErrors,
      [field]: undefined,
    }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage(null);

    const result = LoginFormSchema.safeParse(form);
    if (!result.success) {
      setErrors(getFieldErrors<LoginValues>(result.error.issues));
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error ?? "Login failed.");
        return;
      }

      setMessage("Login successful!");
      router.push("/dashboard");
    } catch {
      setMessage("Error submitting form. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const isSuccess = message?.toLowerCase().includes("success") ?? false;

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <div>
        <label htmlFor="login-email" className={labelClass}>
          Email
        </label>
        <input
          id="login-email"
          name="email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          value={form.email}
          onChange={handleChange}
          className={inputClass}
          required
        />
        {errors.email && (
          <p className="mt-1 text-sm font-semibold text-[#c96b58]">{errors.email}</p>
        )}
      </div>

      <div>
        <label htmlFor="login-password" className={labelClass}>
          Password
        </label>
        <input
          id="login-password"
          name="password"
          type="password"
          placeholder="Your password"
          autoComplete="current-password"
          value={form.password}
          onChange={handleChange}
          className={inputClass}
          required
        />
        {errors.password && (
          <p className="mt-1 text-sm font-semibold text-[#c96b58]">{errors.password}</p>
        )}
      </div>

      <button type="submit" disabled={isSubmitting} className={buttonClass}>
        {isSubmitting ? "Logging in..." : "Log in"}
      </button>

      {message && (
        <p
          role={isSuccess ? "status" : "alert"}
          className={`text-sm font-medium ${isSuccess ? "text-[#1f6b4e]" : "text-[#c96b58]"}`}
        >
          {message}
        </p>
      )}
    </form>
  );
}
