import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/app/lib/supabaseServer";

// Return a simple auth flag for client checks.
export async function GET() {
  const supabase = createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  const user = data.user;

  return NextResponse.json({
    isAuthenticated: !!user,
    user: user
      ? {
          id: user.id,
          email: user.email,
        }
      : null,
  });
}
