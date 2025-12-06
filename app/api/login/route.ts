import { NextResponse } from "next/server";
import { LoginFormSchema } from "@/app/lib/validation";
import { createSupabaseServerClient } from "@/app/lib/supabaseServer";

export async function POST(request: Request) {
  const body = await request.json();

  // 1) validate with Zod
  const result = LoginFormSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      {
        error: "Invalid data",
        details: result.error.format(),
      },
      { status: 400 }
    );
  }

  const { email, password } = result.data;

  const supabase = createSupabaseServerClient();

  // Try to sign in with Supabase Auth
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error("Supabase signIn error:", error);
    return NextResponse.json(
      { error: error.message ?? "Invalid email or password." },
      { status: 401 }
    );
  }

  if (!data.session || !data.user) {
    console.error("Supabase signIn missing session/user:", data);
    return NextResponse.json(
      { error: "Login failed: no session returned. Confirm email or check Supabase Auth settings." },
      { status: 500 }
    );
  }

  const user = data.user;

  // Supabase has now set auth cookies for this user
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
