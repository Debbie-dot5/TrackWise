"use client"

import type React from "react"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { OnboardingLayout } from "./onboarding-layout"
import { useOnboardingStore } from "@/stores/onboarding-store"

export  function ProfileSetup() {
  
  const { formData, updateFormData, nextStep } = useOnboardingStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.name && formData.school && formData.age && formData.age > 0) {
      nextStep()
    } else {
      alert("Oops! Please fill in all your details to continue. 😅")
    }
  }

  return (
    <OnboardingLayout
      title="Tell Us About You! 🌟"
      description="Just a few deets to get your money journey started."
      step={1}
      totalSteps={5}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-foreground">
            Your Name
          </Label>
          <Input
            id="name"
            type="text"
            placeholder="e.g., Aisha Bello"
            value={formData.name}
            onChange={(e) => updateFormData({name: e.target.value})}
            required
            className="py-2 px-4 rounded-lg border border-border focus:ring-2 focus:ring-primary focus:border-primary bg-input text-foreground"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="school" className="text-foreground">
            Your School
          </Label>
          <Input
            id="school"
            type="text"
            placeholder="e.g., University of Lagos"
            value={formData.school}
            onChange={(e) => updateFormData({school: e.target.value})}

            required
            className="py-2 px-4 rounded-lg border border-border focus:ring-2 focus:ring-primary focus:border-primary bg-input text-foreground"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="age" className="text-foreground">
            Your Age
          </Label>
          <Input
            id="age"
            type="number"
            placeholder="e.g., 20"
            value={formData.age}
            onChange={(e) => updateFormData({age: Number.parseInt(e.target.value) || "" })}
            required
            min="16"
            max="99"
            className="py-2 px-4 rounded-lg border border-border focus:ring-2 focus:ring-primary focus:border-primary bg-input text-foreground"
          />
        </div>
        <Button
          type="submit"
          className="w-full py-3 text-lg bg-vibrant-purple hover:bg-vibrant-pink text-white rounded-full shadow-lg transition-all duration-200 ease-in-out transform hover:scale-105"
        >
          Next
        </Button>
      </form>
    </OnboardingLayout>
  )
}
