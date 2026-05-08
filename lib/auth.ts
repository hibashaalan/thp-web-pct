import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"

type Profile = {
  id: string
  is_superadmin: boolean
  is_matrix_admin: boolean
}

export const isAdmin = (profile: Profile | null | undefined): boolean =>
  !!(profile?.is_superadmin || profile?.is_matrix_admin)

export async function isLoggedIn(): Promise<boolean> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return !!user
}

export async function getSession(): Promise<Profile | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const admin = createAdminClient()
  const { data: profile } = await admin
    .from("profiles")
    .select("id, is_superadmin, is_matrix_admin")
    .eq("id", user.id)
    .single()

  return profile ?? null
}

export async function requireAdmin(): Promise<Profile> {
  let profile: Profile | null = null
  try {
    profile = await getSession()
  } catch (e) {
    console.error('[requireAdmin] getSession failed:', e)
    throw e
  }
  if (!profile || !isAdmin(profile)) redirect("/login")
  return profile
}
