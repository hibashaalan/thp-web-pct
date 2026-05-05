import { getSteps } from "./api"
import axios from "axios"

export const runChain = async (flavorId: string, image: string) => {
  let output = image

  const steps = await getSteps(flavorId)

  const sorted = steps.sort((a, b) => a.step_number - b.step_number)

  for (const step of sorted) {
    const res = await axios.post(
      "https://api.almostcrackd.ai/generate",
      {
        prompt: step.prompt,
        input: output,
      }
    )

    output = res.data.output
  }

  return output
}