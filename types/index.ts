export type Flavor = {
  id: number
  slug: string
  description: string | null
}

export type Step = {
  id: number
  humor_flavor_id: number
  order_by: number
  humor_flavor_step_type_id: number | null
  llm_input_type_id: number | null
  llm_output_type_id: number | null
  llm_model_id: number | null
  llm_temperature: number | null
  description: string | null
  llm_system_prompt: string | null
  llm_user_prompt: string | null
}

export type LookupType = {
  id: number
  slug: string
  description: string | null
}

export type Model = {
  id: number
  name: string
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
