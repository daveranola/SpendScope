import { NextResponse } from 'next/server';
import { SignupFormSchema } from '@/app/lib/validation';
import { supabaseServer } from '@/app/lib/supabaseServer';
import bcrypt from 'bcrypt';

export async function POST(request: Request) {
  const body = await request.json();

  // 1) validate with Zod
  const result = SignupFormSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      {
        error: 'Invalid data',
        details: result.error.format(),
      },
      { status: 400 }
    );
  }

  const { name, email, password } = result.data;

  // 2) NEVER store raw password – hash it first
  const passwordHash = await bcrypt.hash(password, 10);

  // 3) Insert into Supabase "User" table
  const { data, error } = await supabaseServer
    .from('User')
    .insert({
      name,
      email,
      password: passwordHash, 
    })
    // return all of table rows
    .select()
    // the exact row we insert
    .single();

  if (error) {
    console.error('Supabase insert error:', error);
    return NextResponse.json(
      { error: 'Failed to create user.' },
      { status: 500 }
    );
  }

  return NextResponse.json(
    {
      user: {
        id: data.id,
        name: data.name,
        email: data.email,
      },
    },
    { status: 201 }
  );
}
