import { NextResponse } from "next/server";
import { invalidDataResponse, readJsonBody, serverErrorResponse } from "@/app/lib/api";
import { createSupabaseServerClient } from "@/app/lib/supabaseServer";
import { LoginFormSchema } from "@/app/lib/validation";

export async function POST(request: Request) {
  const { body, errorResponse } = await readJsonBody(request);
  if (errorResponse) {
    return errorResponse;
  }

  const result = LoginFormSchema.safeParse(body);
  if (!result.success) {
    return invalidDataResponse(result.error.format());
  }

  const { email, password } = result.data;
  const supabase = createSupabaseServerClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return NextResponse.json(
      { error: error.message ?? "Invalid email or password." },
      { status: 401 }
    );
  }

  if (!data.session || !data.user) {
    return serverErrorResponse(
      "Login failed: no session returned. Confirm email or check Supabase Auth settings."
    );
  }

  const user = data.user;

  return NextResponse.json(
    {
      user: {
        id: user.id,
        email: user.email,
        name: user.user_metadata?.name ?? null,
      },
      message: "Login successful!",
    },
    { status: 200 }
  );
}
