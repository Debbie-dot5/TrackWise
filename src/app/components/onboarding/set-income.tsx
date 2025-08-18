"use client"

import type React from "react"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { OnboardingLayout } from "./onboarding-layout"
import { useOnboardingStore } from "@/stores/onboarding-store"



export  function SetIncome() {
   const { formData, updateFormData, nextStep, prevStep} = useOnboardingStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.monthlyIncome && formData.monthlyIncome > 0) {
      nextStep()
    } else {
      alert("Hold up! Please tell us your monthly income. It helps us help you! 😉")
    }
  }

  return (
    <OnboardingLayout
      title="What's Your Monthly Flow? 💸"
      description="Let's get a sense of your income to help you budget smarter."
      step={2}
      totalSteps={5}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="monthly-income" className="text-foreground">
            Monthly Allowance / Income (NGN)
          </Label>
          <Input
            id="monthly-income"
            type="number"
            placeholder="e.g., ₦50,000"
            value={formData.monthlyIncome}
            onChange={(e) => updateFormData({ monthlyIncome: Number.parseFloat(e.target.value) || "" })}
            required
            min="0"
            className="py-2 px-4 rounded-lg border border-border focus:ring-2 focus:ring-primary focus:border-primary bg-input text-foreground"
          />
          <p className="text-sm text-muted-foreground mt-1">
            Help tip: Estimate if it varies — we got you. No pressure! 🧘‍♀️
          </p>
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
            className="flex-1 py-3 text-lg bg-vibrant-purple hover:bg-vibrant-pink text-white rounded-full shadow-lg transition-all duration-200 ease-in-out transform hover:scale-105"
          >
            Next
          </Button>
        </div>
      </form>
    </OnboardingLayout>
  )
}
