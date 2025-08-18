"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { OnboardingLayout } from "./onboarding-layout"
import { useOnboardingStore } from "@/stores/onboarding-store"

export function SuccessSummary() {
  const { formData, prevStep, completeOnboarding, loading } = useOnboardingStore()
  const [isCompleting, setIsCompleting] = useState(false)
  const router = useRouter()

  const totalBudget = Object.values(formData.budgetGoals).reduce((sum, val) => sum + val, 0)

  const handleComplete = async () => {
    console.log("🔥 Go to Dashboard button clicked!")
    console.log("📋 Form data:", formData)

    setIsCompleting(true)

    console.log("🚀 Calling completeOnboarding...")
    const result = await completeOnboarding()
    console.log("✅ completeOnboarding result:", result)

    if (result.success) {
      console.log("🎉 Success! Redirecting to dashboard...")
      router.push("/dashboard")
    } else {
      console.log("❌ Error occurred:", result.error)
      alert(`Error completing onboarding: ${result.error}`)
    }
    setIsCompleting(false)
  }

  return (
    <OnboardingLayout
      title="You're All Set! 🎉"
      description="Awesome! Here's a quick recap of your money plan."
      step={5}
      totalSteps={5}
    >
      <div className="space-y-6 text-center">
        <p className="text-lg text-foreground">
          Hey <span className="font-bold text-primary">{formData.name}</span>, you're ready to roll!
        </p>
        <div className="bg-secondary p-4 rounded-lg shadow-inner space-y-3">
          <h3 className="text-xl font-semibold text-foreground">Your Money Snapshot 📸</h3>
          <p className="text-md text-foreground">
            Monthly Income: <span className="font-bold text-green-400">₦{formData.monthlyIncome}</span>
          </p>
          <p className="text-md text-foreground">
            Total Budgeted: <span className="font-bold text-primary">₦{totalBudget}</span>
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="text-xl font-semibold text-foreground">Your Budget Breakdown 📊</h3>
          {formData.selectedCategories.length === 0 ? (
            <p className="text-muted-foreground">No categories set. Time to explore the dashboard! 🚀</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {formData.selectedCategories.map((category) => (
                <div
                  key={category.name}
                  className="flex items-center justify-between bg-card p-3 rounded-lg shadow-sm border border-border"
                >
                  <span className="text-foreground font-medium">
                    {category.emoji} {category.name}
                  </span>
                  <Badge className="bg-vibrant-pink/20 text-vibrant-pink font-semibold px-3 py-1 rounded-full">
                    ₦{formData.budgetGoals[category.name] || 0}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4 mt-8">
          <Button
            onClick={handleComplete}
            disabled={isCompleting || loading}
            className="w-full py-3 text-lg bg-vibrant-purple hover:bg-vibrant-pink text-white rounded-full shadow-lg transition-all duration-200 ease-in-out transform hover:scale-105"
          >
            {isCompleting ? "Setting up your account..." : "Go to Dashboard! 🚀"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={prevStep}
            disabled={isCompleting || loading}
            className="w-full py-3 text-lg border-2 border-border text-foreground hover:bg-secondary hover:text-primary rounded-full shadow-lg transition-all duration-200 ease-in-out transform hover:scale-105 bg-transparent"
          >
            Go Back and Edit
          </Button>
        </div>
      </div>
    </OnboardingLayout>
  )
}
