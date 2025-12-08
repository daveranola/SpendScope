import { NextResponse } from "next/server";
import { GoalSchema } from "@/app/lib/validation";
import { createSupabaseServerClient } from "@/app/lib/supabaseServer";

export async function GET() {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("Goal")
    .select("id, title, targetAmount, isCompleted, userId, createdAt, updatedAt")
    .eq("userId", user.id)
    .order("createdAt", { ascending: false });

  if (error) {
    console.error("Supabase goal fetch error:", error);
    return NextResponse.json({ error: error.message ?? "Failed to fetch goals." }, { status: 500 });
  }

  return NextResponse.json({ goals: data ?? [] });
}

export async function POST(request: Request) {
  const body = await request.json();
  const result = GoalSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      { error: "Invalid data", details: result.error.format() },
      { status: 400 }
    );
  }

  const supabase = createSupabaseServerClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { title, targetAmount } = result.data;

  const { data, error } = await supabase
    .from("Goal")
    .insert({
      title,
      targetAmount,
      isCompleted: false,
      userId: user.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
    .select("id, title, targetAmount, isCompleted")
    .single();

  if (error) {
    console.error("Supabase goal insert error:", error);
    return NextResponse.json({ error: error.message ?? "Failed to create goal." }, { status: 500 });
  }

  return NextResponse.json({ goal: data }, { status: 201 });
}
