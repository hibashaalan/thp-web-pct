import FlavorList from "@/components/FlavorList"
import FlavorForm from "@/components/FlavorForm"

export default function FlavorsPage() {
  return (
    <div>
      <h2>All Humor Flavors</h2>
      <FlavorForm />
      <FlavorList />
    </div>
  )
}