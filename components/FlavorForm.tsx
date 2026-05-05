"use client"

import { createFlavor } from "@/lib/api"
import { useState } from "react"

export default function FlavorForm() {
  const [name, setName] = useState("")

  const handleSubmit = async () => {
    await createFlavor(name)
    setName("")
  }

  return (
    <div>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Flavor name"
      />
      <button onClick={handleSubmit}>Create</button>
    </div>
  )
}