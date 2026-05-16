"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
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
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestedTab = searchParams.get("tab");
  const fallbackTab = initialTabId ?? tabs[0]?.id;
  const active = requestedTab && tabs.some((tab) => tab.id === requestedTab) ? requestedTab : fallbackTab;

  function selectTab(tabId: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tabId);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  return (
    <div className="space-y-5">
      <div className="rounded-[24px] border border-[#ded6c8] bg-[#fffcf6] p-2 shadow-sm">
        <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
        {tabs.map((tab) => {
          const isActive = tab.id === active;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => selectTab(tab.id)}
              className={`rounded-2xl px-4 py-3 text-left text-sm font-extrabold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e7b96f] ${
                isActive
                  ? "bg-[#17211d] text-white shadow-sm"
                  : "text-[#69736c] hover:bg-[#f6f1e8] hover:text-[#17211d]"
              }`}
              aria-pressed={isActive}
            >
              {tab.label}
            </button>
          );
        })}
        </div>
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
