import { cookies } from "next/headers"
import type { Flavor, Step, User, Caption } from "@/types"

const BASE_URL = "https://api.almostcrackd.ai"

async function getToken(): Promise<string | undefined> {
  const store = await cookies()
  return store.get("token")?.value
}

async function request<T>(
  path: string,
  init?: RequestInit,
  skipAuth = false
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(init?.headers as Record<string, string>),
  }

  if (!skipAuth) {
    const token = await getToken()
    if (token) headers["Authorization"] = `Bearer ${token}`
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    cache: "no-store",
    ...init,
    headers,
  })

  if (!res.ok) {
    const body = await res.text()
    throw new Error(`API ${res.status} on ${path}: ${body}`)
  }

  if (res.status === 204) return undefined as T
  return res.json()
}

// Auth
export const login = (email: string, password: string): Promise<{ token: string }> =>
  request("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  }, true)

export const getMe = (): Promise<User> =>
  request("/me")

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
