import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/app/lib/supabaseServer";

export async function POST() {
  const supabase = createSupabaseServerClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error("Supabase signOut error:", error);
    return NextResponse.json({ error: error.message ?? "Failed to sign out." }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
