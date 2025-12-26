import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

type CookieRecord = { name: string; value: string };

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

async function readCookies(): Promise<CookieRecord[]> {
  const cookieStore = await cookies();
  return cookieStore.getAll().map(({ name, value }) => ({ name, value }));
}

// Use in Server Actions and Route Handlers where cookie mutations are allowed.
export function createSupabaseServerClient() {
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

// Use in Server Components where cookies are read-only.
export function createSupabaseServerComponentClient() {
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
  
