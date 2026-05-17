import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

type CookieRecord = { name: string; value: string };

function getSupabaseConfig() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing Supabase environment variables.");
  }

  return { supabaseUrl, supabaseAnonKey };
}

async function readCookies(): Promise<CookieRecord[]> {
  const cookieStore = await cookies();
  return cookieStore.getAll().map(({ name, value }) => ({ name, value }));
}

export function createSupabaseServerClient() {
  const { supabaseUrl, supabaseAnonKey } = getSupabaseConfig();

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      async getAll() {
        return readCookies();
      },
      async setAll(cookiesToSet) {
        const cookieStore = await cookies();
        cookiesToSet.forEach(({ name, value, options }) => {
          cookieStore.set({ name, value, ...options });
        });
      },
    },
  });
}

export function createSupabaseServerComponentClient() {
  const { supabaseUrl, supabaseAnonKey } = getSupabaseConfig();

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      async getAll() {
        return readCookies();
      },
      async setAll() {
        // No-op: Next.js forbids cookie mutations in Server Components.
      },
    },
  });
}
  
