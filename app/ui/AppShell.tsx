import { LoggedInNav } from "@/app/ui/LoggedInNav";

type Props = {
  eyebrow: string;
  title: string;
  description: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
};

export function AppShell({ eyebrow, title, description, actions, children }: Props) {
  return (
    <main className="min-h-screen bg-[#f6f1e8] text-[#17211d]">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[260px_minmax(0,1fr)] lg:px-8">
        <LoggedInNav />
        <section className="min-w-0 space-y-6">
          <header className="rounded-[28px] border border-[#ded6c8] bg-[#fffcf6] p-6 shadow-[0_24px_70px_-60px_rgba(23,33,29,0.55)] sm:p-8">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-sm font-extrabold uppercase tracking-[0.16em] text-[#1f6b4e]">{eyebrow}</p>
                <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-[#17211d] sm:text-4xl">{title}</h1>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-[#69736c] sm:text-base">{description}</p>
              </div>
              {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
            </div>
          </header>
          {children}
        </section>
      </div>
    </main>
  );
}
