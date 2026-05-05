import StepList from "@/components/StepList"
import StepForm from "@/components/StepForm"

export default function FlavorDetail({ params }) {
  const { id } = params

  return (
    <div>
      <h2>Flavor Details</h2>
      <StepForm flavorId={id} />
      <StepList flavorId={id} />
    </div>
  )
}