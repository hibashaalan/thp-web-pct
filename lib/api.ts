import { createClient } from "@/lib/supabase/server"
import type { Flavor, Step } from "@/types"

// Flavors

export async function getFlavors(): Promise<Flavor[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("flavors")
    .select("id, name")
    .order("name")
  if (error) throw new Error(error.message)
  return data
}

export async function getFlavor(id: string): Promise<Flavor> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("flavors")
    .select("id, name")
    .eq("id", id)
    .single()
  if (error) throw new Error(error.message)
  return data
}

export async function createFlavor(name: string): Promise<Flavor> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("flavors")
    .insert({ name })
    .select("id, name")
    .single()
  if (error) throw new Error(error.message)
  return data
}

export async function updateFlavor(id: string, name: string): Promise<Flavor> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("flavors")
    .update({ name })
    .eq("id", id)
    .select("id, name")
    .single()
  if (error) throw new Error(error.message)
  return data
}

export async function deleteFlavor(id: string): Promise<void> {
  const supabase = await createClient()
  const { error } = await supabase.from("flavors").delete().eq("id", id)
  if (error) throw new Error(error.message)
}

// Steps

export async function getSteps(flavorId: string): Promise<Step[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("steps")
    .select("id, flavor_id, step_number, prompt")
    .eq("flavor_id", flavorId)
    .order("step_number")
  if (error) throw new Error(error.message)
  return data
}

export async function createStep(flavorId: string, prompt: string): Promise<Step> {
  const supabase = await createClient()
  const { data: existing } = await supabase
    .from("steps")
    .select("step_number")
    .eq("flavor_id", flavorId)
    .order("step_number", { ascending: false })
    .limit(1)

  const nextNum = (existing?.[0]?.step_number ?? 0) + 1

  const { data, error } = await supabase
    .from("steps")
    .insert({ flavor_id: flavorId, prompt, step_number: nextNum })
    .select("id, flavor_id, step_number, prompt")
    .single()
  if (error) throw new Error(error.message)
  return data
}

export async function updateStep(id: string, prompt: string): Promise<Step> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("steps")
    .update({ prompt })
    .eq("id", id)
    .select("id, flavor_id, step_number, prompt")
    .single()
  if (error) throw new Error(error.message)
  return data
}

export async function deleteStep(id: string): Promise<void> {
  const supabase = await createClient()
  const { error } = await supabase.from("steps").delete().eq("id", id)
  if (error) throw new Error(error.message)
}

export async function moveStepUp(stepId: string): Promise<Step> {
  const supabase = await createClient()
  const { data: step } = await supabase
    .from("steps")
    .select("*")
    .eq("id", stepId)
    .single()
  if (!step) throw new Error("Step not found")

  const { data: above } = await supabase
    .from("steps")
    .select("*")
    .eq("flavor_id", step.flavor_id)
    .eq("step_number", step.step_number - 1)
    .single()
  if (!above) return step

  await supabase.from("steps").update({ step_number: -1 }).eq("id", step.id)
  await supabase.from("steps").update({ step_number: step.step_number }).eq("id", above.id)
  const { data: updated } = await supabase
    .from("steps")
    .update({ step_number: above.step_number })
    .eq("id", step.id)
    .select("id, flavor_id, step_number, prompt")
    .single()
  return updated ?? step
}

export async function moveStepDown(stepId: string): Promise<Step> {
  const supabase = await createClient()
  const { data: step } = await supabase
    .from("steps")
    .select("*")
    .eq("id", stepId)
    .single()
  if (!step) throw new Error("Step not found")

  const { data: below } = await supabase
    .from("steps")
    .select("*")
    .eq("flavor_id", step.flavor_id)
    .eq("step_number", step.step_number + 1)
    .single()
  if (!below) return step

  await supabase.from("steps").update({ step_number: -1 }).eq("id", step.id)
  await supabase.from("steps").update({ step_number: step.step_number }).eq("id", below.id)
  const { data: updated } = await supabase
    .from("steps")
    .update({ step_number: below.step_number })
    .eq("id", step.id)
    .select("id, flavor_id, step_number, prompt")
    .single()
  return updated ?? step
}
