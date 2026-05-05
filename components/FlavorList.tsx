"use client"

import { useEffect, useState } from "react"
import { getFlavors } from "@/lib/api"
import Link from "next/link"

export default function FlavorList() {
  const [flavors, setFlavors] = useState([])

  useEffect(() => {
    getFlavors().then(setFlavors)
  }, [])

  return (
    <ul>
      {flavors.map((f) => (
        <li key={f.id}>
          <Link href={`/flavors/${f.id}`}>{f.name}</Link>
        </li>
      ))}
    </ul>
  )
}