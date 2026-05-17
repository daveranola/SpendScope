import { NextResponse } from "next/server";
import { serverErrorResponse } from "@/app/lib/api";
import { createSupabaseServerClient } from "@/app/lib/supabaseServer";

export async function POST() {
  const supabase = createSupabaseServerClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    return serverErrorResponse("Failed to sign out.", error);
  }

  return NextResponse.json({ success: true });
}
