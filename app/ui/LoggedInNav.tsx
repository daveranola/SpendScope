"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

const navItems = [
  {
    href: "/dashboard",
    label: "Dashboard",
    description: "Overview and activity",
  },
  {
    href: "/dashboard?tab=transactions",
    label: "Transactions",
    description: "Log income or spending",
  },
  {
    href: "/dashboard?tab=insights",
    label: "Insights",
    description: "Trends and categories",
  },
  {
    href: "/budget",
    label: "Budgets",
    description: "Monthly category limits",
  },
];

function isActive(pathname: string, href: string, activeTab: string) {
  if (href === "/budget") return pathname === "/budget";
  if (pathname !== "/dashboard") return false;
  if (href === "/dashboard") return activeTab === "overview";
  return href.includes(`tab=${activeTab}`);
}

export function LoggedInNav() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") ?? "overview";
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    try {
      await fetch("/api/logout", { method: "POST" });
      router.refresh();
      router.push("/");
    } finally {
      setLoading(false);
    }
  }

  return (
    <aside className="rounded-[28px] border border-[#ded6c8] bg-[#fffcf6] p-4 shadow-[0_24px_70px_-58px_rgba(23,33,29,0.55)] lg:sticky lg:top-6 lg:self-start">
      <div className="flex items-center gap-3 px-2 py-2">
        <Image src="/icon.svg" alt="" width={40} height={40} className="h-10 w-10 shrink-0" />
        <div>
          <p className="text-base font-extrabold text-[#17211d]">SpendScope</p>
          <p className="text-xs font-semibold text-[#69736c]">Your budget workspace</p>
        </div>
      </div>

      <nav className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-1" aria-label="Logged in navigation">
        {navItems.map((item) => {
          const active = isActive(pathname, item.href, activeTab);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-2xl border px-4 py-3 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e7b96f] ${
                active
                  ? "border-[#1f6b4e] bg-[#ddefe5] text-[#124b36]"
                  : "border-transparent text-[#17211d] hover:border-[#ded6c8] hover:bg-[#f6f1e8]"
              }`}
              aria-current={active ? "page" : undefined}
            >
              <span className="block text-sm font-extrabold">{item.label}</span>
              <span className={`mt-0.5 block text-xs font-semibold ${active ? "text-[#1f6b4e]" : "text-[#69736c]"}`}>
                {item.description}
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-5 rounded-2xl bg-[#f6f1e8] p-4">
        <p className="text-sm font-extrabold text-[#17211d]">Need to step away?</p>
        <p className="mt-1 text-xs leading-5 text-[#69736c]">Sign out when you are done reviewing your budget.</p>
        <button
          type="button"
          onClick={handleLogout}
          disabled={loading}
          className="mt-3 w-full rounded-full bg-[#17211d] px-4 py-2.5 text-sm font-extrabold text-white transition hover:bg-[#124b36] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e7b96f] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Logging out..." : "Log out"}
        </button>
      </div>
    </aside>
  );
}
