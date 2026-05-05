"use client"

import { runChain } from "@/lib/chain"

export default function TestPage({ params }) {
  const { id } = params

  const handleRun = async () => {
    const result = await runChain(id, "image_url_here")
    console.log(result)
  }

  return (
    <div>
      <h2>Test Humor Flavor</h2>
      <button onClick={handleRun}>Generate Captions</button>
    </div>
  )
}