import { NextResponse } from "next/server";
import { CategorySchema } from "@/app/lib/validation";
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
    .from("Category")
    .select("id, name, type")
    .eq("userId", user.id)
    .order("name", { ascending: true });

  if (error) {
    console.error("Supabase category fetch error:", error);
    return NextResponse.json({ error: error.message ?? "Failed to fetch categories." }, { status: 500 });
  }

  return NextResponse.json({ categories: data ?? [] });
}

export async function POST(request: Request) {
  const body = await request.json();
  const result = CategorySchema.safeParse(body);

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
    console.error("Supabase category upsert error:", error);
    return NextResponse.json({ error: error.message ?? "Failed to save category." }, { status: 500 });
  }

  return NextResponse.json({ category: data }, { status: 201 });
}
