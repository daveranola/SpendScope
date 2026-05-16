import { NextResponse } from "next/server";
import {
  getAuthenticatedUser,
  invalidDataResponse,
  readJsonBody,
  serverErrorResponse,
} from "@/app/lib/api";
import { createSupabaseServerClient } from "@/app/lib/supabaseServer";
import { TransactionSchema } from "@/app/lib/validation";

export async function POST(request: Request) {
  const { body, errorResponse } = await readJsonBody(request);
  if (errorResponse) {
    return errorResponse;
  }

  const result = TransactionSchema.safeParse(body);
  if (!result.success) {
    return invalidDataResponse(result.error.format());
  }

  const { amount, description = "", category, type, goalId } = result.data;
  const supabase = createSupabaseServerClient();
  const { user, response } = await getAuthenticatedUser(supabase);

  if (response) {
    return response;
  }

  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from("Transaction")
    .insert({
      amount: type === "EXPENSE" ? -Math.abs(amount) : Math.abs(amount),
      description,
      category,
      type,
      goalId: goalId ?? null,
      userId: user.id,
      createdAt: now,
      updatedAt: now,
    })
    .select()
    .single();

  if (error) {
    return serverErrorResponse("Failed to create transaction.", error);
  }

  return NextResponse.json(
    {
      transaction: {
        id: data.id,
        amount: data.amount,
        description: data.description,
        category: data.category,
        type: data.type,
      },
    },
    { status: 201 }
  );
}
