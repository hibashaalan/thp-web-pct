export type Flavor = {
  id: string
  name: string
}

export type Step = {
  id: string
  flavor_id: string
  step_number: number
  prompt: string
}