import { NextResponse } from "next/server";
import { BudgetSchema } from "@/app/lib/validation";
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
    .from("Budget")
    .select("id, category, amount")
    .eq("userId", user.id)
    .order("category", { ascending: true });

  if (error) {
    console.error("Supabase budget fetch error:", error);
    return NextResponse.json({ error: error.message ?? "Failed to fetch budgets." }, { status: 500 });
  }

  return NextResponse.json({ budgets: data ?? [] });
}

export async function POST(request: Request) {
  const body = await request.json();
  const result = BudgetSchema.safeParse(body);

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
    console.error("Supabase budget upsert error:", error);
    return NextResponse.json({ error: error.message ?? "Failed to save budget." }, { status: 500 });
  }

  return NextResponse.json({ budget: data }, { status: 201 });
}
