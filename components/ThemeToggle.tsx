"use client"

import { useState } from "react"

type Theme = "light" | "system" | "dark"

const labels: Record<Theme, string> = {
  light: "Light",
  system: "System",
  dark: "Dark",
}

export default function ThemeToggle({ initialTheme }: { initialTheme: Theme }) {
  const [theme, setTheme] = useState<Theme>(initialTheme)

  const apply = (t: Theme) => {
    setTheme(t)
    document.cookie = `theme=${t};path=/;max-age=31536000`
    const root = document.documentElement
    if (t === "dark") {
      root.classList.add("dark")
    } else if (t === "light") {
      root.classList.remove("dark")
    } else {
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        root.classList.add("dark")
      } else {
        root.classList.remove("dark")
      }
    }
  }

  return (
    <div className="flex gap-0.5 text-xs border border-gray-200 dark:border-gray-700 rounded p-0.5">
      {(["light", "system", "dark"] as Theme[]).map((t) => (
        <button
          key={t}
          onClick={() => apply(t)}
          className={`px-2 py-1 rounded transition-colors ${
            theme === t
              ? "bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900"
              : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
          }`}
        >
          {labels[t]}
        </button>
      ))}
    </div>
  )
}
