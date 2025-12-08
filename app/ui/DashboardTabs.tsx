"use client";

import { useState } from "react";
import { FadeInSection } from "./FadeInSection";

type Tab = {
  id: string;
  label: string;
  content: React.ReactNode;
};

type Props = {
  tabs: Tab[];
  initialTabId?: string;
};

export function DashboardTabs({ tabs, initialTabId }: Props) {
  const [active, setActive] = useState<string>(initialTabId ?? tabs[0]?.id);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2 rounded-2xl bg-white/70 p-2 shadow-sm ring-1 ring-slate-200">
        {tabs.map((tab) => {
          const isActive = tab.id === active;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActive(tab.id)}
              className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                isActive
                  ? "bg-slate-900 text-white shadow ring-1 ring-slate-900/60"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
      <div className="rounded-2xl">
        {tabs.map((tab) =>
          tab.id === active ? (
            <FadeInSection key={tab.id} triggerKey={tab.id}>
              {tab.content}
            </FadeInSection>
          ) : null
        )}
      </div>
    </div>
  );
}
