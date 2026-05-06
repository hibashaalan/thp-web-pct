"use client"

import { useTransition } from "react"
import { logoutAction } from "@/app/actions"

export default function LogoutButton() {
  const [pending, startTransition] = useTransition()

  return (
    <button
      onClick={() => startTransition(() => logoutAction())}
      disabled={pending}
      className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 disabled:opacity-50"
    >
      {pending ? "..." : "Sign Out"}
    </button>
  )
}
