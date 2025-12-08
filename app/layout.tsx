import "./globals.css";
import { Manrope } from "next/font/google";
import { createSupabaseServerClient } from "@/app/lib/supabaseServer";
import { AuthActions } from "@/app/ui/AuthActions";

export const metadata = {
  title: "SpendScope",
  description: "Budgeting, goals, and insights in one clear dashboard.",
  icons: {
    icon: "/icon.svg",
  },
};

const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <html lang="en">
      <body className={manrope.className}>
        <div className="fixed right-4 top-4 z-50">
          <AuthActions isAuthenticated={!!user} />
        </div>
        {children}
      </body>
    </html>
  );
}
