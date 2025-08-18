import { create } from "zustand"
import { persist } from "zustand/middleware"
import { supabase } from "@/lib/supabase"
import type { User } from "@supabase/supabase-js"

type AuthState = {
  user: User | null
  loading: boolean

  // Actions
  signUp: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>
  updatePassword: (newPassword: string) => Promise<{ success: boolean; error?: string }>
  setUser: (user: User | null) => void
  setLoading: (loading: boolean) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      loading: true,

      signUp: async (email, password) => {
        set({ loading: true })
        try {
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
          emailRedirectTo: `${location.origin}/auth/callback`,
         },
          })

          if (error) {
            set({ loading: false })
            return { success: false, error: error.message }
          }

          // Create minimal user profile - details will be filled during onboarding
          // if (data.user) {
          //   const { error: profileError } = await supabase.from("user_profiles").insert({
          //     id: data.user.id,
          //     name: "", // Will be filled during onboarding
          //     email: email,
          //     school: "", // Will be filled during onboarding
          //     age: null, // Will be filled during onboarding
          //     monthly_income: 0,
          //   })

          //   if (profileError) {
          //     console.error("Profile creation error:", profileError)
          //   }
          // }

          set({ user: data.user, loading: false })
          return { success: true }
        } catch (error) {
          console.log(error)
          set({ loading: false })
          return { success: false, error: "An unexpected error occurred" }
        }
      },


    //   signInWithOAuth: async (provider) => {},

      signIn: async (email, password) => {
        set({ loading: true })
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          })

          if (error) {
            set({ loading: false })
            return { success: false, error: error.message }
          }

          set({ user: data.user, loading: false })
          return { success: true }
        } catch (error) {
          console.log(error)
          set({ loading: false })
          return { success: false, error: "An unexpected error occurred" }
        }
      },

      signOut: async () => {
        set({ loading: true })
        await supabase.auth.signOut()
        set({ user: null, loading: false })
      },

      resetPassword: async (email) => {
        try {
          const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/auth/reset-password`,
          })

          if (error) {
            return { success: false, error: error.message }
          }

          return { success: true }
        } catch (error) {
          console.log(error)
          return { success: false, error: "An unexpected error occurred" }
        }
      },

      updatePassword: async (newPassword) => {
        try {
          const { error } = await supabase.auth.updateUser({
            password: newPassword,
          })

          if (error) {
            return { success: false, error: error.message }
          }

          return { success: true }
        } catch (error) {
          console.log(error)
          return { success: false, error: "An unexpected error occurred" }
        }
      },

      setUser: (user) => set({ user }),
      setLoading: (loading) => set({ loading }),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ user: state.user }), // Only persist user data
    },
  ),
)
