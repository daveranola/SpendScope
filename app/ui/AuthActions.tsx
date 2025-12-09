"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type Props = {
  isAuthenticated: boolean;
};

export function AuthActions({ isAuthenticated: initialIsAuthenticated }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(initialIsAuthenticated);
  const [loading, setLoading] = useState(false);

  // Double-check auth state on the client to avoid stale SSR props.
  useEffect(() => {
    let isMounted = true;
    fetch("/api/auth-status", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (!isMounted) return;
        setIsAuthenticated(!!data?.isAuthenticated);
      })
      .catch(() => {
        // ignore; fall back to initial SSR value
      });
    return () => {
      isMounted = false;
    };
  }, []);

  // Hide auth actions on the landing page to avoid showing logout there.
  if (pathname === "/") {
    return null;
  }

  async function handleLogout() {
    setLoading(true);
    try {
      const res = await fetch("/api/logout", { method: "POST" });
      if (!res.ok) {
        console.error("Logout failed");
      }
      router.refresh();
      router.push("/");
    } finally {
      setLoading(false);
    }
  }

  const baseClass =
    "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition shadow-sm";

  if (!isAuthenticated) {
    return (
      <Link
        href="/"
        className={`${baseClass} border border-white/50 bg-white/80 text-slate-900 backdrop-blur hover:bg-white hover:shadow`}
      >
        Login
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={loading}
      className={`${baseClass} border border-slate-200 bg-white text-slate-800 backdrop-blur hover:bg-slate-50 hover:shadow disabled:cursor-not-allowed disabled:opacity-70`}
    >
      {loading ? "Logging out..." : "Logout"}
    </button>
  );
}
