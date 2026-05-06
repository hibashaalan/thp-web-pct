"use server"

import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import {
  createFlavor,
  updateFlavor,
  deleteFlavor,
  createStep,
  updateStep,
  deleteStep,
  moveStepUp,
  moveStepDown,
} from "@/lib/api"
import { runChain } from "@/lib/chain"
import type { StepResult } from "@/lib/chain"

export async function logoutAction(): Promise<void> {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect("/login")
}

export async function createFlavorAction(
  name: string
): Promise<{ error?: string }> {
  try {
    await createFlavor(name)
    revalidatePath("/flavors")
    return {}
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Failed to create flavor" }
  }
}

export async function updateFlavorAction(
  id: string,
  name: string
): Promise<{ error?: string }> {
  try {
    await updateFlavor(id, name)
    revalidatePath("/flavors")
    return {}
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Failed to update flavor" }
  }
}

export async function deleteFlavorAction(
  id: string
): Promise<{ error?: string }> {
  try {
    await deleteFlavor(id)
    revalidatePath("/flavors")
    return {}
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Failed to delete flavor" }
  }
}

export async function createStepAction(
  flavorId: string,
  prompt: string
): Promise<{ error?: string }> {
  try {
    await createStep(flavorId, prompt)
    revalidatePath(`/flavors/${flavorId}`)
    return {}
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Failed to create step" }
  }
}

export async function updateStepAction(
  stepId: string,
  flavorId: string,
  prompt: string
): Promise<{ error?: string }> {
  try {
    await updateStep(stepId, prompt)
    revalidatePath(`/flavors/${flavorId}`)
    return {}
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Failed to update step" }
  }
}

export async function deleteStepAction(
  stepId: string,
  flavorId: string
): Promise<{ error?: string }> {
  try {
    await deleteStep(stepId)
    revalidatePath(`/flavors/${flavorId}`)
    return {}
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Failed to delete step" }
  }
}

export async function moveStepUpAction(
  stepId: string,
  flavorId: string
): Promise<{ error?: string }> {
  try {
    await moveStepUp(stepId)
    revalidatePath(`/flavors/${flavorId}`)
    return {}
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Failed to reorder" }
  }
}

export async function moveStepDownAction(
  stepId: string,
  flavorId: string
): Promise<{ error?: string }> {
  try {
    await moveStepDown(stepId)
    revalidatePath(`/flavors/${flavorId}`)
    return {}
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Failed to reorder" }
  }
}

export async function runChainAction(
  flavorId: string,
  imageUrl: string
): Promise<{ results?: StepResult[]; error?: string }> {
  try {
    const results = await runChain(flavorId, imageUrl)
    return { results }
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Failed to run chain" }
  }
}

export async function setThemeAction(
  theme: "light" | "dark" | "system"
): Promise<void> {
  const store = await cookies()
  store.set("theme", theme, { path: "/", maxAge: 60 * 60 * 24 * 365 })
}
