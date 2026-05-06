import { createClient } from "@/lib/supabase/server"
import type { Flavor, Step, Caption } from "@/types"

const BASE_URL = "https://api.almostcrackd.ai"
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

async function getToken(): Promise<string | undefined> {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()
  return session?.access_token
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const token = await getToken()

  const res = await fetch(`${BASE_URL}${path}`, {
    cache: "no-store",
    ...init,
    headers: {
      "Content-Type": "application/json",
      "apikey": ANON_KEY,
      ...(token ? { "Authorization": `Bearer ${token}` } : {}),
      ...(init?.headers as Record<string, string>),
    },
  })

  if (!res.ok) {
    const body = await res.text()
    throw new Error(`API ${res.status} on ${path}: ${body}`)
  }

  if (res.status === 204) return undefined as T
  return res.json()
}

// Flavors
export const getFlavors = (): Promise<Flavor[]> =>
  request("/flavors")

export const getFlavor = (id: string): Promise<Flavor> =>
  request(`/flavors/${encodeURIComponent(id)}`)

export const createFlavor = (name: string): Promise<Flavor> =>
  request("/flavors", {
    method: "POST",
    body: JSON.stringify({ name }),
  })

export const updateFlavor = (id: string, name: string): Promise<Flavor> =>
  request(`/flavors/${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: JSON.stringify({ name }),
  })

export const deleteFlavor = (id: string): Promise<void> =>
  request(`/flavors/${encodeURIComponent(id)}`, { method: "DELETE" })

// Steps
export const getSteps = (flavorId: string): Promise<Step[]> =>
  request(`/steps?flavor_id=${encodeURIComponent(flavorId)}`)

export const createStep = (flavorId: string, prompt: string): Promise<Step> =>
  request("/steps", {
    method: "POST",
    body: JSON.stringify({ flavor_id: flavorId, prompt }),
  })

export const updateStep = (id: string, prompt: string): Promise<Step> =>
  request(`/steps/${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: JSON.stringify({ prompt }),
  })

export const deleteStep = (id: string): Promise<void> =>
  request(`/steps/${encodeURIComponent(id)}`, { method: "DELETE" })

export const moveStepUp = (stepId: string): Promise<Step> =>
  request(`/steps/${encodeURIComponent(stepId)}/move-up`, { method: "POST" })

export const moveStepDown = (stepId: string): Promise<Step> =>
  request(`/steps/${encodeURIComponent(stepId)}/move-down`, { method: "POST" })

// Captions
export const getCaptions = (flavorId: string): Promise<Caption[]> =>
  request(`/captions?flavor_id=${encodeURIComponent(flavorId)}`)
