import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()
  const token = session?.access_token

  const res = await fetch("https://api.almostcrackd.ai/pipeline/generate-captions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token ?? ""}`,
    },
    body: JSON.stringify({ imageId: "probe-test", humorFlavorId: "probe-test" }),
  })

  const body = await res.text()
  return NextResponse.json({ hasSession: !!token, status: res.status, body })
}
