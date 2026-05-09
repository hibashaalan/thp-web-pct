import { createAdminClient } from "@/lib/supabase/admin"
import type { Flavor } from "@/types"

export async function getFlavors(): Promise<Flavor[]> {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from("humor_flavors")
    .select("id, slug, description")
    .order("slug")
  if (error) throw new Error(error.message)
  return data
}

export async function getFlavor(id: number): Promise<Flavor> {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from("humor_flavors")
    .select("id, slug, description")
    .eq("id", id)
    .single()
  if (error) throw new Error(error.message)
  return data
}

export async function createFlavor(slug: string, description: string, userId: string): Promise<Flavor> {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from("humor_flavors")
    .insert({ slug, description, created_by_user_id: userId, modified_by_user_id: userId })
    .select("id, slug, description")
    .single()
  if (error) throw new Error(error.message)
  return data
}

export async function updateFlavor(id: number, slug: string, description: string): Promise<Flavor> {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from("humor_flavors")
    .update({ slug, description })
    .eq("id", id)
    .select("id, slug, description")
    .single()
  if (error) throw new Error(error.message)
  return data
}

export async function deleteFlavor(id: number): Promise<void> {
  const supabase = createAdminClient()
  const { error } = await supabase.from("humor_flavors").delete().eq("id", id)
  if (error) throw new Error(error.message)
}
