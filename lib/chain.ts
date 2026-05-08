import { createClient } from "@/lib/supabase/server"

export type CaptionResult = Record<string, unknown>

export async function runChain(
  humorFlavorId: string,
  imageId: string
): Promise<CaptionResult> {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()
  const token = session?.access_token

  if (!token) throw new Error("Not authenticated")

  const res = await fetch("https://api.almostcrackd.ai/pipeline/generate-captions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify({ imageId, humorFlavorId }),
  })

  if (!res.ok) {
    const body = await res.text()
    throw new Error(`API error ${res.status}: ${body}`)
  }

  return res.json()
}
