import { NextResponse } from "next/server";
import {
  getAuthenticatedUser,
  invalidDataResponse,
  readJsonBody,
  serverErrorResponse,
} from "@/app/lib/api";
import { GoalSchema } from "@/app/lib/validation";
import { createSupabaseServerClient } from "@/app/lib/supabaseServer";

export async function GET() {
  const supabase = createSupabaseServerClient();
  const { user, response } = await getAuthenticatedUser(supabase);

  if (response) {
    return response;
  }

  const { data, error } = await supabase
    .from("Goal")
    .select("id, title, targetAmount, isCompleted, userId, createdAt, updatedAt")
    .eq("userId", user.id)
    .order("createdAt", { ascending: false });

  if (error) {
    return serverErrorResponse("Failed to fetch goals.", error);
  }

  return NextResponse.json({ goals: data ?? [] });
}

export async function POST(request: Request) {
  const { body, errorResponse } = await readJsonBody(request);
  if (errorResponse) {
    return errorResponse;
  }

  const result = GoalSchema.safeParse(body);

  if (!result.success) {
    return invalidDataResponse(result.error.format());
  }

  const supabase = createSupabaseServerClient();
  const { user, response } = await getAuthenticatedUser(supabase);

  if (response) {
    return response;
  }

  const { title, targetAmount } = result.data;
  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from("Goal")
    .insert({
      title,
      targetAmount,
      isCompleted: false,
      userId: user.id,
      createdAt: now,
      updatedAt: now,
    })
    .select("id, title, targetAmount, isCompleted")
    .single();

  if (error) {
    return serverErrorResponse("Failed to create goal.", error);
  }

  return NextResponse.json({ goal: data }, { status: 201 });
}
