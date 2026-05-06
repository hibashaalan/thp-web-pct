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
  const steps = await getSteps(flavorId)
  const sorted = steps.sort((a, b) => a.step_number - b.step_number)

  let input = imageUrl
  const results: StepResult[] = []

  for (const step of sorted) {
    const res = await fetch("https://api.almostcrackd.ai/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: step.prompt, input }),
    })

    if (!res.ok) {
      throw new Error(`Step ${step.step_number} failed: ${res.status}`)
    }

    const data = await res.json()
    const output = data.output as string
    results.push({ step_number: step.step_number, prompt: step.prompt, output })
    input = output
  }

  return results
}
