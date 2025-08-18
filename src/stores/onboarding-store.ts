import { create } from "zustand"
import { supabase } from "@/lib/supabase"

interface OnboardingFormData {
  name: string
  school: string
  age: number | ""
  monthlyIncome: number | ""
  selectedCategories: { name: string; emoji?: string }[]
  budgetGoals: { [categoryName: string]: number }
}

interface OnboardingState {
  formData: OnboardingFormData
  loading: boolean
  currentStep: number

  // Actions
  updateFormData: (data: Partial<OnboardingFormData>) => void
  setCurrentStep: (step: number) => void
  nextStep: () => void
  prevStep: () => void
  createProfile: () => Promise<{ success: boolean; error?: string }>
  createDefaultCategories: () => Promise<{ success: boolean; error?: string }>
  saveCategories: () => Promise<{ success: boolean; error?: string }>
  saveBudgetGoals: () => Promise<{ success: boolean; error?: string }>
  completeOnboarding: () => Promise<{ success: boolean; error?: string }>
  resetOnboarding: () => void
}

const initialFormData: OnboardingFormData = {
  name: "",
  school: "",
  age: "",
  monthlyIncome: "",
  selectedCategories: [],
  budgetGoals: {},
}

const defaultCategories = [
  { name: "Food", emoji: "🍔" },
  { name: "Transport", emoji: "🚌" },
  { name: "Skin care", emoji: "🧴" },
  { name: "Impulse", emoji: "🛍️" },
  { name: "Subscription", emoji: "📺" },
  { name: "Church", emoji: "⛪" },
  { name: "School", emoji: "📚" },
  { name: "Data", emoji: "📶" },
]

export const useOnboardingStore = create<OnboardingState>((set, get) => ({
  formData: initialFormData,
  loading: false,
  currentStep: 1,

  updateFormData: (data) => {
    set((state) => ({
      formData: { ...state.formData, ...data },
    }))
  },

  setCurrentStep: (step) => set({ currentStep: step }),

  nextStep: () => {
    set((state) => ({
      currentStep: Math.min(state.currentStep + 1, 5),
    }))
  },

  prevStep: () => {
    set((state) => ({
      currentStep: Math.max(state.currentStep - 1, 1),
    }))
  },

  createProfile: async () => {
    const { formData } = get()
    set({ loading: true })

    try {
      console.log("🔍 Creating profile with data:", formData)

      const {
        data: { user },
      } = await supabase.auth.getUser()

      console.log(" Current user:", user)

      if (!user) {
        console.error(" User not authenticated")
        set({ loading: false })
        return { success: false, error: "User not authenticated" }
      }

      const profileData = {
        id: user.id,
        name: formData.name,
        email: user.email || "",
        school: formData.school,
        age: formData.age as number,
        monthly_income: formData.monthlyIncome as number,
      }

      console.log("📝 Inserting profile data:", profileData)

      const { error, data } = await supabase.from("user_profiles").insert(profileData)

      console.log("✅ Profile insert result:", { data, error })

      set({ loading: false })

      if (error) {
        console.error(" Profile creation error:", error)
        return { success: false, error: error.message }
      }

      console.log(" Profile created successfully")
      return { success: true }
    } catch (error) {
      console.error(" Unexpected error in createProfile:", error)
      set({ loading: false })
      return { success: false, error: "An unexpected error occurred" }
    }
  },

  createDefaultCategories: async () => {
    const { formData } = get()
    set({ loading: true })

    try {
      console.log(" Creating default categories")

      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        console.error(" User not authenticated for categories")
        set({ loading: false })
        return { success: false, error: "User not authenticated" }
      }

      const seletedDefaultCategories = formData.selectedCategories.filter((seletedCat) => 
       defaultCategories.some((defaultCat) => defaultCat.name === seletedCat.name)
      )
      

      console.log("📝 selected categories:", seletedDefaultCategories)


      if (seletedDefaultCategories.length > 0){
        const categoriesData = seletedDefaultCategories.map((cat) => ({
          user_id: user.id,
          name: cat.name,
          emoji: cat.emoji || defaultCategories.find((dc) => dc.name === cat.name)?.emoji || "✨",
        }))
        console.log("📝 Inserting data:", categoriesData)
  
  
        const { error, data } = await supabase.from("categories").insert(categoriesData)
        console.log("✅ Categories insert result:", { data, error })
        if (error) {
           set({ loading: false })
          console.error(" Categories creation error:", error)
          return { success: false, error: error.message }
        }
      }

         console.log("🎉 Default categories created successfully")
      return { success: true }
    } catch (error) {
      console.error(" Unexpected error in createDefaultCategories:", error)
      set({ loading: false })
      return { success: false, error: "An unexpected error occurred" }
    }
   
  },

  saveCategories: async () => {
    const { formData } = get()
    set({ loading: true })

    try {
      console.log("🏷️ Saving custom categories")

      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        console.error(" User not authenticated for custom categories")
        set({ loading: false })
        return { success: false, error: "User not authenticated" }
      }

      const customCategories = formData.selectedCategories.filter(
        (cat) => !defaultCategories.some((defaultCat) => defaultCat.name === cat.name),
      )

      console.log("📝 Custom categories to save:", customCategories)

      if (customCategories.length > 0) {
        const customCategoriesData = customCategories.map((cat) => ({
          user_id: user.id,
          name: cat.name,
          emoji: cat.emoji || "✨",
        }))

        console.log("📝 Inserting custom categories:", customCategoriesData)

        const { error, data } = await supabase.from("categories").insert(customCategoriesData)

        console.log("✅ Custom categories insert result:", { data, error })

        if (error) {
          console.error("❌ Custom categories error:", error)
          set({ loading: false })
          return { success: false, error: error.message }
        }
      } else {
        console.log("ℹ️ No custom categories to save")
      }

      set({ loading: false })
      console.log("🎉 Custom categories saved successfully")
      return { success: true }
    } catch (error) {
      console.error("💥 Unexpected error in saveCategories:", error)
      set({ loading: false })
      return { success: false, error: "An unexpected error occurred" }
    }
  },

  saveBudgetGoals: async () => {
    const { formData } = get()
    set({ loading: true })

    try {
      console.log("💰 Saving budget goals")

      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        console.error("❌ User not authenticated for budget goals")
        set({ loading: false })
        return { success: false, error: "User not authenticated" }
      }

      // Convert budget goals object to array for database insertion
      const budgetGoalsArray = Object.entries(formData.budgetGoals).map(([category, amount]) => ({
        user_id: user.id,
        category,
        amount,
      }))

      console.log("📝 Budget goals to save:", budgetGoalsArray)

      if (budgetGoalsArray.length > 0) {
        const { error, data } = await supabase.from("budget_goals").upsert(budgetGoalsArray)

        console.log("✅ Budget goals upsert result:", { data, error })

        if (error) {
          console.error("❌ Budget goals error:", error)
          set({ loading: false })
          return { success: false, error: error.message }
        }
      } else {
        console.log("ℹ️ No budget goals to save")
      }

      set({ loading: false })
      console.log("🎉 Budget goals saved successfully")
      return { success: true }
    } catch (error) {
      console.error("💥 Unexpected error in saveBudgetGoals:", error)
      set({ loading: false })
      return { success: false, error: "An unexpected error occurred" }
    }
  },

  completeOnboarding: async () => {
    set({ loading: true })

    try {
      console.log("🚀 Starting complete onboarding process")

      // Create the complete user profile
      console.log("📝 Step 1: Creating user profile")
      const profileResult = await get().createProfile()
      if (!profileResult.success) {
        console.error("❌ Profile creation failed:", profileResult.error)
        set({ loading: false })
        return profileResult
      }

      // Create default categories
      console.log("🏷️ Step 2: Creating default categories")
      const defaultCategoriesResult = await get().createDefaultCategories()
      if (!defaultCategoriesResult.success) {
        console.error("❌ Default categories creation failed:", defaultCategoriesResult.error)
        set({ loading: false })
        return defaultCategoriesResult
      }

      // Add any custom categories
      console.log("🏷️ Step 3: Saving custom categories")
      const categoriesResult = await get().saveCategories()
      if (!categoriesResult.success) {
        console.error("❌ Custom categories save failed:", categoriesResult.error)
        set({ loading: false })
        return categoriesResult
      }

      // Save budget goals
      console.log("💰 Step 4: Saving budget goals")
      const budgetResult = await get().saveBudgetGoals()
      if (!budgetResult.success) {
        console.error("❌ Budget goals save failed:", budgetResult.error)
        set({ loading: false })
        return budgetResult
      }

      set({ loading: false })
      console.log("🎉 Onboarding completed successfully!")
      return { success: true }
    } catch (error) {
      console.error("💥 Unexpected error in completeOnboarding:", error)
      set({ loading: false })
      return { success: false, error: "Failed to complete onboarding" }
    }
  },

  resetOnboarding: () => {
    set({
      formData: initialFormData,
      currentStep: 1,
      loading: false,
    })
  },
}))
