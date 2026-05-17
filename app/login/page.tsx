import Image from "next/image";
import Link from "next/link";
import { LoginForm } from "@/app/ui/LoginForm";

type LoginPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const signupParam = params.signup;
  const accountCreated = Array.isArray(signupParam)
    ? signupParam.includes("success")
    : signupParam === "success";

  return (
    <main className="min-h-screen bg-[#f6f1e8] px-4 py-6 text-[#17211d] sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
        <Link href="/" className="flex min-w-0 items-center gap-3">
          <Image src="/icon.svg" alt="" width={40} height={40} className="h-10 w-10 shrink-0" />
          <span className="text-lg font-extrabold tracking-tight">SpendScope</span>
        </Link>
        <Link
          href="/#auth"
          className="rounded-full border border-[#ded6c8] bg-[#fffcf6] px-4 py-2 text-sm font-extrabold text-[#17211d] transition hover:border-[#1f6b4e] hover:text-[#1f6b4e] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e7b96f]"
        >
          Create account
        </Link>
      </div>

      <section className="mx-auto grid max-w-5xl gap-8 py-14 lg:grid-cols-[0.95fr_0.82fr] lg:items-center lg:py-20">
        <div>
          <p className="text-sm font-extrabold uppercase tracking-[0.16em] text-[#1f6b4e]">Welcome back</p>
          <h1 className="mt-3 max-w-xl text-4xl font-extrabold tracking-tight sm:text-5xl">
            Log in and check what is still safe to spend.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-[#69736c]">
            Pick up your monthly budget, category limits, and saving goals from the same simple workspace.
          </p>
        </div>

        <div className="rounded-[28px] border border-[#ded6c8] bg-[#fffcf6] p-5 shadow-[0_28px_80px_-54px_rgba(23,33,29,0.55)] sm:p-7">
          {accountCreated && (
            <div
              role="status"
              className="mb-5 rounded-2xl border border-[#b6d7c5] bg-[#ddefe5] px-4 py-3 text-sm font-extrabold text-[#124b36]"
            >
              Account created successfully. Please log in.
            </div>
          )}
          <div>
            <p className="text-sm font-extrabold text-[#1f6b4e]">Pick up where you left off</p>
            <h2 className="mt-1 text-3xl font-extrabold text-[#17211d]">Log in to SpendScope</h2>
            <p className="mt-2 text-sm leading-6 text-[#69736c]">
              Use the email and password you chose when creating your account.
            </p>
          </div>

          <div className="mt-6 rounded-2xl border border-[#ded6c8] bg-white p-5">
            <LoginForm />
          </div>
        </div>
      </section>
    </main>
  );
}
