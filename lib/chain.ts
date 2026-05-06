import { createClient } from "@/lib/supabase/server"
import { getSteps } from "./api"

export type StepResult = {
  step_number: number
  prompt: string
  output: string
}

export async function runChain(
  flavorId: string,
  imageUrl: string
): Promise<StepResult[]> {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()
  const token = session?.access_token

  const steps = await getSteps(flavorId)
  const sorted = steps.sort((a, b) => a.step_number - b.step_number)

  let input = imageUrl
  const results: StepResult[] = []

  for (const step of sorted) {
    const res = await fetch("https://api.almostcrackd.ai/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        ...(token ? { "Authorization": `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ prompt: step.prompt, input }),
    })

    if (!res.ok) {
      const body = await res.text()
      throw new Error(`Step ${step.step_number} failed: ${res.status} — ${body}`)
    }

    const data = await res.json()
    const output = data.output as string
    results.push({ step_number: step.step_number, prompt: step.prompt, output })
    input = output
  }

  return results
}
