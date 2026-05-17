import { NextResponse } from "next/server";
import {
  getAuthenticatedUser,
  invalidDataResponse,
  readJsonBody,
  serverErrorResponse,
} from "@/app/lib/api";
import { CategorySchema } from "@/app/lib/validation";
import { createSupabaseServerClient } from "@/app/lib/supabaseServer";

export async function GET() {
  const supabase = createSupabaseServerClient();
  const { user, response } = await getAuthenticatedUser(supabase);

  if (response) {
    return response;
  }

  const { data, error } = await supabase
    .from("Category")
    .select("id, name, type")
    .eq("userId", user.id)
    .order("name", { ascending: true });

  if (error) {
    return serverErrorResponse("Failed to fetch categories.", error);
  }

  return NextResponse.json({ categories: data ?? [] });
}

export async function POST(request: Request) {
  const { body, errorResponse } = await readJsonBody(request);
  if (errorResponse) {
    return errorResponse;
  }

  const result = CategorySchema.safeParse(body);

  if (!result.success) {
    return invalidDataResponse(result.error.format());
  }

  const supabase = createSupabaseServerClient();
  const { user, response } = await getAuthenticatedUser(supabase);

  if (response) {
    return response;
  }

  const { name, type } = result.data;

  const { data, error } = await supabase
    .from("Category")
    .upsert(
      {
        name,
        type,
        userId: user.id,
        updatedAt: new Date().toISOString(),
      },
      { onConflict: "userId,name,type" }
    )
    .select("id, name, type")
    .single();

  if (error) {
    return serverErrorResponse("Failed to save category.", error);
  }

  return NextResponse.json({ category: data }, { status: 201 });
}
