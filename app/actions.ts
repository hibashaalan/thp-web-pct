"use server"

import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { createFlavor, updateFlavor, deleteFlavor } from "@/lib/api"

export async function logoutAction(): Promise<void> {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect("/login")
}

export async function createFlavorAction(
  slug: string,
  description: string
): Promise<{ error?: string }> {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user?.id) return { error: "Not authenticated" }
    await createFlavor(slug, description, user.id)
    revalidatePath("/flavors")
    return {}
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Failed to create flavor" }
  }
}

export async function updateFlavorAction(
  id: number,
  slug: string,
  description: string
): Promise<{ error?: string }> {
  try {
    await updateFlavor(id, slug, description)
    revalidatePath("/flavors")
    return {}
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Failed to update flavor" }
  }
}

export async function deleteFlavorAction(
  id: number
): Promise<{ error?: string }> {
  try {
    await deleteFlavor(id)
    revalidatePath("/flavors")
    return {}
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Failed to delete flavor" }
  }
}

export async function setThemeAction(
  theme: "light" | "dark" | "system"
): Promise<void> {
  const store = await cookies()
  store.set("theme", theme, { path: "/", maxAge: 60 * 60 * 24 * 365 })
}
