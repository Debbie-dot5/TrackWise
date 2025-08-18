
"use client"

import { ProfileSetup } from "@/app/components/onboarding/profile-setup"
import { SelectCategories } from "@/app/components/onboarding/select-categories"
import { SetBudgetGoals } from "@/app/components/onboarding/set-budget-goals"
import { SetIncome } from "@/app/components/onboarding/set-income"
import { SuccessSummary } from "@/app/components/onboarding/success-message"
import { useOnboardingStore } from "@/stores/onboarding-store"

export default function OnboardingPage() {
  const { currentStep } = useOnboardingStore();

  const renderSteps = () => {
    switch (currentStep) {
      case 1: 
        return <ProfileSetup />;
      case 2: 
        return <SetIncome />;
      case 3: 
        return <SelectCategories />;
      case 4: 
        return <SetBudgetGoals />;
      case 5: 
        return <SuccessSummary />;
      default: 
        return <ProfileSetup />;
    }
  }

  return renderSteps();
}