import { LoginFormSchema } from "@/app/lib/validation";
import { NextResponse } from "next/server";
import { supabaseServer } from "@/app/lib/supabaseServer";
import bcrypt from "bcrypt";

export async function POST(request: Request) {
    const body = await request.json();

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

    // extract the validated data
    const { email, password } = result.data;

    const { data, error } = await supabaseServer
        .from("User")
        .select()
        .eq("email", email)
        .single();

    if (error || !data) {
        console.error("Supabase fetch error:", error);
        return NextResponse.json(
            { error: "Invalid email or password." },
            { status: 401 }
        );
    }

    // check if password matches
    const passwordMatch = await bcrypt.compare(password, data.password);

    if (!passwordMatch) {
        return NextResponse.json(
            { error: "Invalid email or password." },
            { status: 401 }
        );
    }

    return NextResponse.json(
        {
            user: {
                id: data.id,
                name: data.name,
                email: data.email,
            },
            message: "Login successful!"
        },
        { status: 200 }
    );
}