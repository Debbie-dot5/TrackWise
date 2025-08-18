"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { OnboardingLayout } from "./onboarding-layout"
import { useOnboardingStore } from "@/stores/onboarding-store"



const predefinedCategories = [
  { name: "Food", emoji: "🍔" },
  { name: "Transport", emoji: "🚌" },
  { name: "Skin care", emoji: "🧴" },
  { name: "Impulse", emoji: "🛍️" },
  { name: "Subscription", emoji: "📺" },
  { name: "Church", emoji: "⛪" },
  { name: "School", emoji: "📚" },
  { name: "Data", emoji: "📶" },
]

export  function SelectCategories() {

const { formData, updateFormData, nextStep, prevStep} = useOnboardingStore();
  

  const [customCategory, setCustomCategory] = useState("")

  const toggleCategory = (category: { name: string; emoji?: string }) => {
    const isSelected = formData.selectedCategories.some((cat) => cat.name === category.name)

    if(isSelected) {
      updateFormData({
       selectedCategories:  formData.selectedCategories.filter((cat) => cat.name != category.name)
      })
    } else {
      updateFormData({
        selectedCategories: [...formData.selectedCategories, category],
      })
    }
  }

  const addCustomCategory = () => {
    if (
      customCategory.trim() &&
      !formData.selectedCategories.some((cat) => cat.name.toLowerCase() === customCategory.trim().toLowerCase())
    ) {
      const newCategory = { name: customCategory.trim(), emoji: "✨" }
      updateFormData({
        selectedCategories: [...formData.selectedCategories, newCategory],
      })
      setCustomCategory("")
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.selectedCategories.length > 0) {
      nextStep()
    } else {
      alert("Psst! Pick at least one category so we know what to track. 😉")
    }
  }

  return (
    <OnboardingLayout
      title="What Do You Spend On? 🤔"
      description="Select your main expense categories. You can add your own too!"
      step={3}
      totalSteps={5}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-3">
          <Label className="text-foreground">Common Categories</Label>
          <div className="flex flex-wrap gap-2">
            {predefinedCategories.map((category) => (
              <Badge
                key={category.name}
                variant={formData.selectedCategories.some((cat) => cat.name === category.name) ? "default" : "outline"}
                className={`cursor-pointer px-4 py-2 text-base rounded-full shadow-sm transition-all duration-200 ease-in-out ${
                  formData.selectedCategories.some((cat) => cat.name === category.name)
                    ? "bg-primary text-primary-foreground hover:bg-vibrant-pink"
                    : "border-border text-foreground hover:bg-secondary"
                }`}
                onClick={() => toggleCategory(category)}
              >
                {category.emoji} {category.name}
              </Badge>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <Label htmlFor="custom-category" className="text-foreground">
            Add Your Own Category! 🎨
          </Label>
          <div className="flex gap-2">
            <Input
              id="custom-category"
              type="text"
              placeholder="e.g., 💅 Nails, 🎮 Gaming"
              value={customCategory}
              onChange={(e) => setCustomCategory(e.target.value)}
              className="flex-1 py-2 px-4 rounded-lg border border-border focus:ring-2 focus:ring-primary focus:border-primary bg-input text-foreground"
            />
            <Button
              type="button"
              onClick={addCustomCategory}
              variant="outline"
              className="px-4 py-2 rounded-full border-2 border-primary text-primary hover:bg-secondary bg-transparent"
            >
              Add
            </Button>
          </div>
          {formData.selectedCategories.length > 0 && (
            <div className="mt-3">
              <Label className="text-foreground">Your Selected Categories:</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.selectedCategories.map((category) => (
                  <Badge
                    key={category.name}
                    variant="default"
                    className="px-4 py-2 text-base rounded-full bg-vibrant-purple text-white"
                  >
                    {category.emoji} {category.name}
                  </Badge>
                ))}
              </div>
            </div>
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
            className="flex-1 py-3 text-lg bg-vibrant-purple hover:bg-vibrant-pink text-white rounded-full shadow-lg transition-all duration-200 ease-in-out transform hover:scale-105"
          >
            Next
          </Button>
        </div>
      </form>
    </OnboardingLayout>
  )
}
