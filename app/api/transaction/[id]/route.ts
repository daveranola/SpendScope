import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/app/lib/supabaseServer";

export async function DELETE(request: Request) {
  // Only use the URL path to extract the transaction id, e.g. "/api/transaction/456" -> "456"
  const idRaw = new URL(request.url).pathname.split("/").pop();
  // Coerce to number; NaN if non-numeric like "abc"
  const id = idRaw ? Number(idRaw) : NaN;

  if (!Number.isInteger(id)) {
    return NextResponse.json({ error: "Invalid transaction id" }, { status: 400 });
  }

  const supabase = createSupabaseServerClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { error } = await supabase
    .from("Transaction")
    .delete()
    .eq("id", id)
    .eq("userId", user.id);

  if (error) {
    console.error("Supabase delete error:", error);
    return NextResponse.json({ error: error.message ?? "Failed to delete transaction." }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
