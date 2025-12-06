import { TransactionSchema } from "@/app/lib/validation";
import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/app/lib/supabaseServer";

export async function POST(request: Request) {
    const body = await request.json();

    const result = TransactionSchema.safeParse(body);

    if (!result.success) {
        return NextResponse.json(
            {
                error: "Invalid data",
                details: result.error.format(),
            },
            { status: 400 }
        );
    }

    const { amount, description } = result.data;
    const supabase = createSupabaseServerClient();

    const {
        data: { user },
        error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
        return NextResponse.json(
            { error: "Unauthorized" },
            { status: 401 }
        );
    }

    const { data, error } = await supabase
        .from("Transaction")
        .insert({
            amount,
            description,
            userId: user.id,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        })
        .select()
        .single();

        if (error) {
            console.error("Supabase insert error:", error);
            return NextResponse.json(
                { error: error.message ?? "Failed to create transaction." },
                { status: 500 }
            );
        }

    return NextResponse.json(
        {
            transaction: {
                id: data.id,
                amount: data.amount,
                description: data.description,
            }
        },
        { status: 201 }
    );

}
