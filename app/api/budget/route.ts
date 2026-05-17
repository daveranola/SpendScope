import { NextResponse } from "next/server";
import {
  getAuthenticatedUser,
  invalidDataResponse,
  readJsonBody,
  serverErrorResponse,
} from "@/app/lib/api";
import { BudgetSchema } from "@/app/lib/validation";
import { createSupabaseServerClient } from "@/app/lib/supabaseServer";

export async function POST(request: Request) {
  const { body, errorResponse } = await readJsonBody(request);
  if (errorResponse) {
    return errorResponse;
  }

  const result = BudgetSchema.safeParse(body);

  if (!result.success) {
    return invalidDataResponse(result.error.format());
  }

  const supabase = createSupabaseServerClient();
  const { user, response } = await getAuthenticatedUser(supabase);

  if (response) {
    return response;
  }

  const { category, amount } = result.data;

  const { data, error } = await supabase
    .from("Budget")
    .upsert(
      {
        category,
        amount,
        userId: user.id,
        updatedAt: new Date().toISOString(),
      },
      { onConflict: "userId,category" }
    )
    .select("id, category, amount")
    .single();

  if (error) {
    return serverErrorResponse("Failed to save budget.", error);
  }

  return NextResponse.json({ budget: data }, { status: 201 });
}
