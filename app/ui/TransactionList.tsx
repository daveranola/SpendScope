"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

export type TransactionListItem = {
  id: number;
  amount: number;
  description: string | null;
  category: string | null;
  type: "EXPENSE" | "INCOME";
  createdAt: string;
};

const formatCurrency = (value: number) => `$${Math.abs(value).toFixed(2)}`;

const formatDate = (value: string) => {
  const date = new Date(value);
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export function TransactionList({ transactions }: { transactions: TransactionListItem[] }) {
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");
  const [page, setPage] = useState<number>(1);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<number | null>(null);
  const [confirmLabel, setConfirmLabel] = useState<string>("");
  const router = useRouter();

  async function handleDelete(id: number) {
    setError(null);
    setDeletingId(id);
    try {
      const res = await fetch(`/api/transaction/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data?.error || "Failed to delete transaction.");
        return;
      }
      router.refresh();
    } catch (_err) {
      setError("An unexpected error occurred.");
    } finally {
      setDeletingId(null);
    }
  }

  const openConfirm = (id: number, label?: string | null) => {
    setConfirmId(id);
    setConfirmLabel(label || "");
  };

  const closeConfirm = () => {
    setConfirmId(null);
    setConfirmLabel("");
  };

  const sorted = useMemo(() => {
    return [...transactions].sort((a, b) => {
      const aTime = new Date(a.createdAt).getTime();
      const bTime = new Date(b.createdAt).getTime();
      return sortOrder === "desc" ? bTime - aTime : aTime - bTime;
    });
  }, [transactions, sortOrder]);

  const pageSize = 10;
  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * pageSize;
  const paged = sorted.slice(start, start + pageSize);

  const empty = sorted.length === 0;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Transactions</h2>
          <p className="text-sm text-slate-600">Review your latest activity.</p>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-1.5 py-1 text-xs font-semibold text-slate-700 shadow-inner">
          <button
            type="button"
            onClick={() => setSortOrder("desc")}
            className={`rounded-full px-3 py-1 transition ${sortOrder === "desc" ? "bg-slate-900 text-white shadow" : "hover:bg-white"}`}
          >
            Newest
          </button>
          <button
            type="button"
            onClick={() => setSortOrder("asc")}
            className={`rounded-full px-3 py-1 transition ${sortOrder === "asc" ? "bg-slate-900 text-white shadow" : "hover:bg-white"}`}
          >
            Oldest
          </button>
        </div>
      </div>
      {error && <p className="mb-3 text-sm font-semibold text-rose-600">{error}</p>}

      {empty ? (
        <div className="flex h-32 items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 text-sm text-slate-500">
          No transactions yet.
        </div>
      ) : (
        <>
          <ul className="divide-y divide-slate-100">
            {paged.map((tx) => {
            const isIncome = tx.type === "INCOME";
            const amount = `${isIncome ? "+" : "-"}${formatCurrency(tx.amount)}`;

            return (
              <li key={tx.id} className="flex items-center justify-between gap-4 py-3">
                <div className="min-w-0 flex-1 space-y-0.5">
                  <p className="truncate text-sm font-semibold text-slate-900">{tx.description || "(No description)"}</p>
                  <div className="text-xs font-medium text-slate-500">
                    <span className="uppercase tracking-wide">{tx.category || "OTHER"}</span>
                    <span className="mx-2 text-slate-300" aria-hidden="true">|</span>
                    <span>{formatDate(tx.createdAt)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className={`text-sm font-semibold ${isIncome ? "text-emerald-600" : "text-rose-600"}`}>
                    {amount}
                  </div>
                  <button
                    type="button"
                    onClick={() => openConfirm(tx.id, tx.description)}
                    disabled={deletingId === tx.id}
                    className="rounded-lg border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {deletingId === tx.id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </li>
            );
          })}
          </ul>

          {totalPages > 1 && (
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
              {Array.from({ length: totalPages }).map((_, idx) => {
                const pageNum = idx + 1;
                const isActive = pageNum === currentPage;
                return (
                  <button
                    key={pageNum}
                    type="button"
                    onClick={() => setPage(pageNum)}
                    className={`h-3.5 w-3.5 rounded-full border transition ${
                      isActive
                        ? "border-slate-900 bg-slate-900 shadow-sm"
                        : "border-slate-300 bg-white hover:border-slate-500"
                    }`}
                    aria-label={`Go to page ${pageNum}`}
                  />
                );
              })}
            </div>
          )}
        </>
      )}

      {confirmId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
            <h3 className="text-lg font-semibold text-slate-900">Delete transaction?</h3>
            <p className="mt-2 text-sm text-slate-600">
              This will remove{confirmLabel ? ` "${confirmLabel}"` : ""} permanently.
            </p>
            <div className="mt-6 flex justify-end gap-3 text-sm font-semibold">
              <button
                type="button"
                onClick={closeConfirm}
                className="rounded-lg border border-slate-200 px-4 py-2 text-slate-700 transition hover:bg-slate-50"
                disabled={deletingId === confirmId}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (confirmId !== null) {
                    handleDelete(confirmId).finally(closeConfirm);
                  }
                }}
                disabled={deletingId === confirmId}
                className="rounded-lg bg-rose-600 px-4 py-2 text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {deletingId === confirmId ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
