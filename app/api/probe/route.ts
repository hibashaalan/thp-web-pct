import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()
  const token = session?.access_token

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "apikey": process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    ...(token ? { "Authorization": `Bearer ${token}` } : {}),
  }

  const body = JSON.stringify({ prompt: "describe this image", input: "https://picsum.photos/400/300" })
  const methods = ["POST", "PUT", "PATCH", "GET"] as const
  const results: Record<string, { status: number; body: string }> = {}

  for (const method of methods) {
    try {
      const res = await fetch("https://api.almostcrackd.ai/generate", {
        method,
        headers,
        ...(method !== "GET" ? { body } : {}),
      })
      results[method] = { status: res.status, body: await res.text() }
    } catch (e) {
      results[method] = { status: 0, body: String(e) }
    }
  }

  return NextResponse.json({ hasSession: !!token, results })
}
