import { createAdminClient } from "@/lib/supabase/admin"
import { NextResponse } from "next/server"

export async function GET() {
  const admin = createAdminClient()

  const [flavors, humorFlavors] = await Promise.all([
    admin.from("flavors").select("*").limit(3),
    admin.from("humor_flavors").select("*").limit(3),
  ])

  return NextResponse.json({
    flavors: flavors.data,
    flavorsError: flavors.error?.message,
    humorFlavors: humorFlavors.data,
    humorFlavorsError: humorFlavors.error?.message,
  })
}
