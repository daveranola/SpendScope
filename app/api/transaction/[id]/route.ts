import { NextResponse } from "next/server";
import { getAuthenticatedUser, serverErrorResponse } from "@/app/lib/api";
import { createSupabaseServerClient } from "@/app/lib/supabaseServer";

export async function DELETE(request: Request) {
  const idRaw = new URL(request.url).pathname.split("/").pop();
  const id = idRaw ? Number(idRaw) : NaN;

  if (!Number.isInteger(id)) {
    return NextResponse.json({ error: "Invalid transaction id" }, { status: 400 });
  }

  const supabase = createSupabaseServerClient();
  const { user, response } = await getAuthenticatedUser(supabase);

  if (response) {
    return response;
  }

  const { error } = await supabase
    .from("Transaction")
    .delete()
    .eq("id", id)
    .eq("userId", user.id);

  if (error) {
    return serverErrorResponse("Failed to delete transaction.", error);
  }

  return NextResponse.json({ success: true });
}
