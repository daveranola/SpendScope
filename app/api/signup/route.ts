import { NextResponse } from "next/server";
import { SignupFormSchema } from "@/app/lib/validation";
import { createSupabaseServerClient } from "@/app/lib/supabaseServer";

export async function POST(request: Request) {
  const body = await request.json();

  // 1) validate with Zod
  const result = SignupFormSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      {
        error: "Invalid data",
        details: result.error.format(),
      },
      { status: 400 }
    );
  }

  const { name, email, password } = result.data;

  const supabase = createSupabaseServerClient();

  // 2) Use Supabase Auth to sign up (handles hashing, user storage, etc.)
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      // store name in user_metadata
      data: { name },
    },
  });

  if (error) {
    console.error("Supabase signUp error:", error);
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
