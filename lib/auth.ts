import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getMe } from "./api"
import type { User } from "@/types"

export type { User }

export const isAdmin = (user: User | null | undefined): boolean =>
  !!(user?.is_superadmin || user?.is_matrix_admin)

export async function isLoggedIn(): Promise<boolean> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return !!user
}

export async function getSession(): Promise<User | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
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
