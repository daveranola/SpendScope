import { NextResponse } from "next/server";
import type { User } from "@supabase/supabase-js";
import type { createSupabaseServerClient } from "@/app/lib/supabaseServer";

type SupabaseServerClient = ReturnType<typeof createSupabaseServerClient>;

export async function readJsonBody(request: Request) {
  try {
    return { body: await request.json(), errorResponse: null };
  } catch {
    return {
      body: null,
      errorResponse: NextResponse.json({ error: "Invalid JSON request body." }, { status: 400 }),
    };
  }
}

export function invalidDataResponse(details: unknown) {
  return NextResponse.json({ error: "Invalid data", details }, { status: 400 });
}

export function unauthorizedResponse() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export function serverErrorResponse(message: string, error?: unknown) {
  if (error) {
    console.error(message, error);
  }

  return NextResponse.json({ error: message }, { status: 500 });
}

export async function getAuthenticatedUser(
  supabase: SupabaseServerClient,
): Promise<{ user: User; response: null } | { user: null; response: NextResponse }> {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return { user: null, response: unauthorizedResponse() };
  }

  return { user, response: null };
}
