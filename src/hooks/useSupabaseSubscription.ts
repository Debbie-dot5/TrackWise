
import { supabase } from "@/lib/supabase"
import { useEffect } from "react"

interface SubscriptionProps {
  fetchCategories?: () => void
  fetchExpenses?: () => void
  fetchUserProfile?: () => void
  fetchBudgetGoals?: () => void
}

export const useSupabaseSubscriptions = ({ fetchCategories, fetchExpenses, fetchUserProfile, fetchBudgetGoals }: SubscriptionProps) => {
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const subscriptions: ReturnType<typeof supabase.channel>[] = []
      if (fetchExpenses) {
        fetchExpenses()
        subscriptions.push(
          supabase
            .channel("expenses")
            .on("postgres_changes", { event: "*", schema: "public", table: "expenses", filter: `user_id=eq.${user.id}` }, () => fetchExpenses())
            .subscribe()
        )
      }
      if (fetchCategories) {
        fetchCategories()
        subscriptions.push(
          supabase
            .channel("categories")
            .on("postgres_changes", { event: "*", schema: "public", table: "categories", filter: `user_id=eq.${user.id}` }, () => fetchCategories())
            .subscribe()
        )
      }
      if (fetchUserProfile) {
        fetchUserProfile()
        subscriptions.push(
          supabase
            .channel("user_profiles")
            .on("postgres_changes", { event: "*", schema: "public", table: "user_profiles", filter: `id=eq.${user.id}` }, () => fetchUserProfile())
            .subscribe()
        )
      }
      if (fetchBudgetGoals) {
        fetchBudgetGoals()
        subscriptions.push(
          supabase
            .channel("budget_goals")
            .on("postgres_changes", { event: "*", schema: "public", table: "budget_goals", filter: `user_id=eq.${user.id}` }, () => fetchBudgetGoals())
            .subscribe()
        )
      }
    //   if (fetchGoals) {
    //     fetchGoals()
    //     subscriptions.push(
    //       supabase
    //         .channel("goals")
    //         .on("postgres_changes", { event: "*", schema: "public", table: "goals", filter: `user_id=eq.${user.id}` }, () => fetchGoals())
    //         .subscribe()
    //     )
    //   }

      return () => subscriptions.forEach((sub) => supabase.removeChannel(sub))
    }
    fetchUser()
    return () => {
      // If fetchUser returned a cleanup function asynchronously, it will be handled there.
      // Here we ensure channels are removed if effect re-runs before user is fetched.
    }
  }, [fetchCategories, fetchExpenses, fetchUserProfile, fetchBudgetGoals])
}