import { create } from "zustand"
import { supabase } from "@/lib/supabase"
import type { Expense, BudgetGoal, Category } from "@/lib/types"

interface ExpenseState {
  expenses: Expense[]
  budgetGoals: BudgetGoal[]
  categories: Category[]
  monthlyIncome: number
  userName: string
  loading: boolean

  // Actions
  fetchExpenses: () => Promise<void>
  addExpense: (expense: Omit<Expense, "id" | "user_id" | "created_at">) => Promise<{ success: boolean; error?: string }>
  updateExpense: (id: string, updates: Partial<Expense>) => Promise<{ success: boolean; error?: string }>
  deleteExpense: (id: string) => Promise<{ success: boolean; error?: string }>

  fetchBudgetGoals: () => Promise<void>
  updateBudgetGoal: (category: string, amount: number) => Promise<{ success: boolean; error?: string }>

  fetchCategories: () => Promise<void>
  addCategory: (name: string, emoji: string) => Promise<{ success: boolean; error?: string }>

  fetchUserProfile: () => Promise<void>
  updateMonthlyIncome: (income: number) => Promise<{ success: boolean; error?: string }>

  // Computed values
  getTotalSpent: () => number
  getSpentByCategory: (category: string) => number
  getBudgetForCategory: (category: string) => number
}

export const useExpenseStore = create<ExpenseState>((set, get) => ({
  expenses: [],
  budgetGoals: [],
  categories: [],
  monthlyIncome: 0,
  userName: "",
  loading: false,

  fetchExpenses: async () => {
    set({ loading: true })
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from("expenses")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching expenses:", error)
        return
      }

      set({ expenses: data || [], loading: false })
    } catch (error) {
      console.error("Error fetching expenses:", error)
      set({ loading: false })
    }
  },

  addExpense: async (expense) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return { success: false, error: "User not authenticated" }

      const { data, error } = await supabase
        .from("expenses")
        .insert({
          ...expense,
          user_id: user.id,
        })
        .select()
        .single()

      if (error) {
        return { success: false, error: error.message }
      }

      // Update local state
      set((state) => ({
        expenses: [data, ...state.expenses],
      }))

      return { success: true }
    } catch (error) {
      return { success: false, error: "An unexpected error occurred" }
    }
  },

  updateExpense: async (id, updates) => {
    try {
      const { data, error } = await supabase.from("expenses").update(updates).eq("id", id).select().single()

      if (error) {
        return { success: false, error: error.message }
      }

      // Update local state
      set((state) => ({
        expenses: state.expenses.map((expense) => (expense.id === id ? { ...expense, ...data } : expense)),
      }))

      return { success: true }
    } catch (error) {
      return { success: false, error: "An unexpected error occurred" }
    }
  },

  deleteExpense: async (id) => {
    try {
      const { error } = await supabase.from("expenses").delete().eq("id", id)

      if (error) {
        return { success: false, error: error.message }
      }

      // Update local state
      set((state) => ({
        expenses: state.expenses.filter((expense) => expense.id !== id),
      }))

      return { success: true }
    } catch (error) {
      return { success: false, error: "An unexpected error occurred" }
    }
  },

  fetchBudgetGoals: async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase.from("budget_goals").select("*").eq("user_id", user.id)

      if (error) {
        console.error("Error fetching budget goals:", error)
        return
      }

      set({ budgetGoals: data || [] })
    } catch (error) {
      console.error("Error fetching budget goals:", error)
    }
  },

  updateBudgetGoal: async (category, amount) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return { success: false, error: "User not authenticated" }

      const { data, error } = await supabase
        .from("budget_goals")
        .upsert({
          user_id: user.id,
          category,
          amount,
        })
        .select()
        .single()

      if (error) {
        return { success: false, error: error.message }
      }

      // Update local state
      set((state) => {
        const existingIndex = state.budgetGoals.findIndex((bg) => bg.category === category)
        if (existingIndex >= 0) {
          const updated = [...state.budgetGoals]
          updated[existingIndex] = data
          return { budgetGoals: updated }
        } else {
          return { budgetGoals: [...state.budgetGoals, data] }
        }
      })

      return { success: true }
    } catch (error) {
      return { success: false, error: "An unexpected error occurred" }
    }
  },

  fetchCategories: async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase.from("categories").select("*").eq("user_id", user.id)

      if (error) {
        console.error("Error fetching categories:", error)
        return
      }

      set({ categories: data || [] })
    } catch (error) {
      console.error("Error fetching categories:", error)
    }
  },

  addCategory: async (name, emoji) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return { success: false, error: "User not authenticated" }

      const { data, error } = await supabase
        .from("categories")
        .insert({
          user_id: user.id,
          name,
          emoji,
        })
        .select()
        .single()

      if (error) {
        return { success: false, error: error.message }
      }

      // Update local state
      set((state) => ({
        categories: [...state.categories, data],
      }))

      return { success: true }
    } catch (error) {
      return { success: false, error: "An unexpected error occurred" }
    }
  },

  fetchUserProfile: async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from("user_profiles")
        .select("name, monthly_income")
        .eq("id", user.id)
        .single()

      if (error) {
        console.error("Error fetching user profile:", error)
        return
      }

      set({
        userName: data?.name || "",
        monthlyIncome: data?.monthly_income || 0,
      })
    } catch (error) {
      console.error("Error fetching user profile:", error)
    }
  },

  updateMonthlyIncome: async (income) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return { success: false, error: "User not authenticated" }

      const { error } = await supabase.from("user_profiles").update({ monthly_income: income }).eq("id", user.id)

      if (error) {
        return { success: false, error: error.message }
      }

      set({ monthlyIncome: income })
      return { success: true }
    } catch (error) {
      return { success: false, error: "An unexpected error occurred" }
    }
  },

  getTotalSpent: () => {
    const { expenses } = get()
    return expenses.reduce((sum, expense) => sum + expense.amount, 0)
  },

  getSpentByCategory: (category) => {
    const { expenses } = get()
    return expenses.filter((expense) => expense.category === category).reduce((sum, expense) => sum + expense.amount, 0)
  },

  getBudgetForCategory: (category) => {
    const { budgetGoals } = get()
    const goal = budgetGoals.find((bg) => bg.category === category)
    return goal?.amount || 0
  },
}))
