'use client'; // server componenrts run on server, needed for client side interactivity

// FormEvent - for onSubmit event of form
import { useState, type FormEvent } from "react";
import { SignupFormSchema, type SignupValues } from "../lib/validation";

// FieldErrors - type for possible validation errors,
// Partial - makes all fields optional
// Record - creates an object type with keys of SignupValues and values of string
// keyof SignupValues - gets the keys of SignupValues type (name, email, password)

// the same as
// type FieldErrors = {
//   name?: string;
//   email?: string;
//   password?: string;
// };

type FieldErrors = Partial<Record<keyof SignupValues, string>>;

export function SignUpForm() {
    const inputClass =
      "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 transition focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-200";
    const labelClass = "mb-2 block text-sm font-semibold text-slate-700";
    const buttonClass =
      "w-full rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-teal-200/60 transition hover:from-teal-600 hover:to-emerald-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500 disabled:cursor-not-allowed disabled:opacity-60";

    // generics, useState will be of type FormState
    // initial state is empty strings
    // setForm will be called when updating the form state
    const [form, setForm] = useState<SignupValues>({
        name: '',
        email: '',
        password: ''
    });

    // holds validation errors for each field
    const [errors, setErrors] = useState<FieldErrors>({});

    // tells if form is being submitted
    const [isSubmitting, setIsSubmitting] = useState(false);

    // message to show user after submission, wither string or null it can take
    const [message, setMessage] = useState<string | null>(null);

    // e -> change event coming from <input> element
    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        // e.target -> input element that triggered the event
        const { name, value } = e.target;
        console.log('change', name, value);

        // prev - previous state of the form
        // ..prev - copy all existing fields
        // [name]: value - update the specific field that changed
        setForm(prevForm => ({
            ...prevForm,
            [name]: value
        }));

        setErrors(prevErrors => ({
            ...prevErrors,
            [name]: undefined // clear error for this field on change
        }));
    }

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        // FormEvent<HTMLFormElement> -> submit event from form a <form> element
        // prevent default form submission behavior
        e.preventDefault();
        setMessage(null);

        // validate with zod
        const result = SignupFormSchema.safeParse(form);
        console.log('Zod result:', result);

        if (!result.success) {
          // start with empty errors list (no errors)
          const fieldErrors: FieldErrors = {};
          console.log('Zod issues:', result.error.issues);

          // iterate over validation issues
          for (const issue of result.error.issues) {
            const field = issue.path[0] as keyof SignupValues;
            // only keep first error per field
            if (!fieldErrors[field]) {
              fieldErrors[field] = issue.message;
            }
          }
          setErrors(fieldErrors);
          return;
        }

        setIsSubmitting(true);
        try {
          const res = await fetch('/api/signup', {
            // POST to db
            method: 'POST',
            // let server know we're sending JSON
            headers: { 'Content-Type': 'application/json' },
            //stringify - convert JS object to JSON string
            body: JSON.stringify(form),
          });

          const data = await res.json();

          if (!res.ok) {
            setMessage(data.error ?? 'Signup failed.');
            return;
          }

          setMessage('Sign up successful!');
        } catch (err) {
          console.error(err);
          setMessage('Error submitting form. Please try again.');
        } finally {
          setIsSubmitting(false);
        }
    }

    return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <div>
        <label htmlFor="name" className={labelClass}>
          Name
        </label>
        <input
          id="name"
          name="name"
          value={form.name}
          onChange={handleChange}
          className={inputClass}
          required
        />
        {errors.name && (
          <p className="mt-1 text-sm font-medium text-red-500">{errors.name}</p>
        )}
      </div>

      <div>
        <label htmlFor="email" className={labelClass}>
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          className={inputClass}
          required
        />
        {errors.email && (
          <p className="mt-1 text-sm font-medium text-red-500">{errors.email}</p>
        )}
      </div>

      <div>
        <label htmlFor="password" className={labelClass}>
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          className={inputClass}
          required
        />
        {errors.password && (
          <p className="mt-1 text-sm font-medium text-red-500">{errors.password}</p>
        )}
      </div>

      <button
        type="submit"
        // disable button while submitting
        disabled={isSubmitting}
        className={buttonClass}
      >
        {isSubmitting ? 'Signing up...' : 'Sign up'}
      </button>

      {message && (
        <p
          className={`text-sm font-medium ${
            message.toLowerCase().includes('success') ? 'text-emerald-600' : 'text-red-600'
          }`}
        >
          {message}
        </p>
      )}
    </form>
  );
}
