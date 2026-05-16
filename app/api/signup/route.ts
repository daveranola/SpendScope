import { NextResponse } from "next/server";
import { invalidDataResponse, readJsonBody } from "@/app/lib/api";
import { createSupabaseServerClient } from "@/app/lib/supabaseServer";
import { SignupFormSchema } from "@/app/lib/validation";

export async function POST(request: Request) {
  const { body, errorResponse } = await readJsonBody(request);
  if (errorResponse) {
    return errorResponse;
  }

  const result = SignupFormSchema.safeParse(body);
  if (!result.success) {
    return invalidDataResponse(result.error.format());
  }

  const { name, email, password } = result.data;
  const supabase = createSupabaseServerClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name },
    },
  });

  if (error) {
    return NextResponse.json(
      { error: error.message ?? "Failed to create user." },
      { status: 400 }
    );
  }

  const user = data.user;

  return NextResponse.json(
    {
      user: {
        id: user?.id,
        email: user?.email,
        name: user?.user_metadata?.name ?? null,
      },
      message: "Sign up successful!",
    },
    { status: 201 }
  );
}
