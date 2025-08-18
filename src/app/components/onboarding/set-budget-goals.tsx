"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { OnboardingLayout } from "./onboarding-layout"
import { useOnboardingStore } from "@/stores/onboarding-store"


export  function SetBudgetGoals() {

  const { formData, updateFormData, nextStep, prevStep } = useOnboardingStore();
  const [localBudgetGoals, setLocalBudgetGoals] = useState<{ [key: string]: number }>({})
  const monthlyIncome = formData.monthlyIncome || 0

  useEffect(() => {
    const initialBudgets: { [key: string]: number } = {}
    formData.selectedCategories.forEach((cat) => {
      initialBudgets[cat.name] = formData.budgetGoals[cat.name] || 0
    })
    setLocalBudgetGoals(initialBudgets)
  }, [formData.selectedCategories, formData.budgetGoals])

  const handleSliderChange = (categoryName: string, value: number[]) => {
    setLocalBudgetGoals((prev) => ({
      ...prev,
      [categoryName]: value[0],
    }))
  }

  const totalBudget = Object.values(localBudgetGoals).reduce((sum, val) => sum + val, 0)
  const remainingIncome = monthlyIncome - totalBudget
  const budgetExceeded = totalBudget > monthlyIncome

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (budgetExceeded) {
      alert(
        "Whoa there! Your total budget is more than your income. Let's adjust those numbers to keep you on track! 😬",
      )
      return
    }
    updateFormData({ ...formData, budgetGoals: localBudgetGoals })
    nextStep()
  }

  return (
    <OnboardingLayout
      title="Budget Like a Boss! 🎯"
      description="Set a monthly budget for each category. You've got this!"
      step={4}
      totalSteps={5}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {formData.selectedCategories.length === 0 && (
          <p className="text-center text-muted-foreground">
            No categories selected. Please go back to select some. 🤷‍♀️
          </p>
        )}
        {formData.selectedCategories.map((category) => (
          <div key={category.name} className="space-y-2">
            <Label className="text-foreground flex justify-between items-center">
              <span>
                {category.emoji} {category.name} Budget
              </span>
              <span className="font-bold text-primary">₦{localBudgetGoals[category.name] || 0}</span>
            </Label>
            <Slider
              min={0}
              max={monthlyIncome > 0 ? monthlyIncome : 100000} // Max slider value based on income or a default high value
              step={1000}
              value={[localBudgetGoals[category.name] || 0]}
              onValueChange={(value) => handleSliderChange(category.name, value)}
              className="[&_[role=slider]]:h-4 [&_[role=slider]]:w-4 [&_[role=slider]]:bg-primary [&_[role=slider]]:ring-ring"
            />
          </div>
        ))}

        <div className="pt-4 border-t border-border space-y-2">
          <div className="flex justify-between items-center text-lg font-semibold text-foreground">
            <span>Total Budget:</span>
            <span className={budgetExceeded ? "text-destructive" : "text-primary"}>₦{totalBudget}</span>
          </div>
          <div className="flex justify-between items-center text-lg font-semibold text-foreground">
            <span>Monthly Income:</span>
            <span className="text-green-400">₦{monthlyIncome}</span>
          </div>
          <div className="flex justify-between items-center text-lg font-semibold">
            <span>Remaining Income:</span>
            <span className={remainingIncome < 0 ? "text-destructive" : "text-vibrant-blue"}>₦{remainingIncome}</span>
          </div>
          {budgetExceeded && (
            <p className="text-sm text-destructive mt-2">
              Uh oh! Your budget is over your income. Time to tweak those numbers! 🤏
            </p>
          )}
        </div>

        <div className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={prevStep}
            className="flex-1 py-3 text-lg border-2 border-border text-foreground hover:bg-secondary hover:text-primary rounded-full shadow-lg transition-all duration-200 ease-in-out transform hover:scale-105 bg-transparent"
          >
            Back
          </Button>
          <Button
            type="submit"
            disabled={budgetExceeded}
            className="flex-1 py-3 text-lg bg-vibrant-purple hover:bg-vibrant-pink text-white rounded-full shadow-lg transition-all duration-200 ease-in-out transform hover:scale-105"
          >
            Next
          </Button>
        </div>
      </form>
    </OnboardingLayout>
  )
}
