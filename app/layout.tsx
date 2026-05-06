import "./globals.css"
import { cookies } from "next/headers"
import Navbar from "@/components/Navbar"

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const store = await cookies()
  const theme = store.get("theme")?.value ?? "system"
  const htmlClass = theme === "dark" ? "dark" : theme === "light" ? "light" : ""

  return (
    <html className={htmlClass} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var t=document.cookie.match(/(?:^|; )theme=([^;]*)/)?.[1]||'system';if(t==='dark'||(t==='system'&&window.matchMedia('(prefers-color-scheme:dark)').matches)){document.documentElement.classList.add('dark');}else{document.documentElement.classList.remove('dark');}})();`,
          }}
        />
      </head>
      <body className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100">
        <Navbar />
        <main className="max-w-4xl mx-auto px-4 py-8">{children}</main>
      </body>
    </html>
  )
}
