import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/app/lib/supabaseServer";

export async function GET() {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    return NextResponse.json({ isAuthenticated: false, user: null });
  }

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
