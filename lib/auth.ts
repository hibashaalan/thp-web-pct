import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { getMe } from "./api"
import type { User } from "@/types"

export type { User }

export const isAdmin = (user: User | null | undefined): boolean =>
  !!(user?.is_superadmin || user?.is_matrix_admin)

export async function getSession(): Promise<User | null> {
  const store = await cookies()
  const token = store.get("token")?.value
  if (!token) return null
  try {
    return await getMe()
  } catch {
    return null
  }
}

export async function requireAdmin(): Promise<User> {
  const user = await getSession()
  if (!user || !isAdmin(user)) redirect("/login")
  return user
}
