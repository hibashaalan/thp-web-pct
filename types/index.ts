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

export type User = {
  id: string
  email: string
  is_superadmin: boolean
  is_matrix_admin: boolean
}

export type Caption = {
  id: string
  flavor_id: string
  image_url: string
  output: string
  created_at: string
}
