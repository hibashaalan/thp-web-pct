import { requireAdmin } from "@/lib/auth"
import FlavorForm from "@/components/FlavorForm"
import FlavorList from "@/components/FlavorList"

export default async function FlavorsPage() {
  await requireAdmin()

  return (
    <div className="space-y-8">
      {/* Welcome banner */}
      <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800/50 rounded-xl p-5">
        <h1 className="text-xl font-bold text-purple-900 dark:text-purple-100 mb-1">
          Humor Flavor Admin
        </h1>
        <p className="text-sm text-purple-700 dark:text-purple-300 leading-relaxed">
          This tool lets you build and test <strong>humor flavors</strong> — AI prompt chains that turn images into funny captions.
          Each flavor is a sequence of steps that guide the AI&apos;s style, tone, and output format.
        </p>
        <ol className="mt-3 text-sm text-purple-700 dark:text-purple-300 space-y-1 list-decimal list-inside">
          <li>Create a flavor with a name and description below</li>
          <li>Open the flavor and add prompt chain steps</li>
          <li>Click <strong>Test Flavor</strong> to generate captions from an image</li>
        </ol>
      </div>

      {/* Create flavor */}
      <div>
        <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-3">Create New Flavor</h2>
        <FlavorForm />
      </div>

      {/* Flavor list */}
      <div>
        <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-3">Your Flavors</h2>
        <FlavorList />
      </div>
    </div>
  )
}
