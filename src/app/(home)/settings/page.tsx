// app/settings/page.tsx
"use client"

import { useState, useEffect } from "react"
import { useExpenseStore } from "@/stores/expense-store"
import { useSupabaseSubscriptions } from "@/hooks/useSupabaseSubscription"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"


const profileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  monthlyIncome: z.number().min(0, "Monthly income must be non-negative"),
  email: z.string().email("Invalid email"),
})

type ProfileFormData = z.infer<typeof profileSchema>

export default function SettingsPage() {
  const { profile, fetchUserProfile, updateUserProfile, loading } = useExpenseStore()
  
  const [theme, setTheme] = useState<"light" | "dark">("light")
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: "", monthlyIncome: 0 },
  })

  useSupabaseSubscriptions({ fetchUserProfile })

  useEffect(() => {
    if (profile) {
      reset({ name: profile.name || "", monthlyIncome: profile.monthly_income || 0, email: profile.email || "" })
    }
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null
    if (savedTheme) {
      setTheme(savedTheme)
      document.documentElement.classList.toggle("dark", savedTheme === "dark")
    }
  }, [profile, reset])

  const onSubmit = async (data: ProfileFormData) => {
    const { success, error } = await updateUserProfile({
      name: data.name,
      monthly_income: data.monthlyIncome,
      email: data.email
    })
    if (success) {
      console.log("name updated successfully")
    } else {
      console.log(error || "Failed to update profile")
     
    }
  }

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light"
    setTheme(newTheme)
    localStorage.setItem("theme", newTheme)
    document.documentElement.classList.toggle("dark", newTheme === "dark")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-purple-bg to-deep-purple-bg p-4 sm:p-6 lg:p-8 flex items-center justify-center">
        <Card className="p-8 shadow-lg rounded-xl bg-card text-card-foreground border border-border">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-foreground">Loading your data...</p>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-4">
      <h1 className="text-2xl font-bold text-foreground">Settings</h1>
      <Card className="shadow-lg rounded-xl bg-card text-card-foreground border border-border">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-foreground">Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name"  {...register("name")} className="border-border" />
              {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
            </div>
            <div>
              <Label htmlFor="monthlyIncome">Monthly Income (₦)</Label>
              <Input
                id="monthlyIncome"
                type="number"
                step="0.01"
                {...register("monthlyIncome", { valueAsNumber: true })}
                className="border-border"
              />
              {errors.monthlyIncome && <p className="text-sm text-destructive">{errors.monthlyIncome.message}</p>}
            </div>



            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...register("email")}
                className="border-border"
              />
              {errors.email && <p className="text-sm text-destructive">{errors.email?.message}</p>}
            </div>
            <Button type="submit" className="w-full bg-vibrant-purple hover:bg-vibrant-pink text-white rounded-full">
              Save
            </Button>
          </form>
        </CardContent>
      </Card>
      <Card className="shadow-lg rounded-xl bg-card text-card-foreground border border-border">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-foreground">Appearance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <Label htmlFor="theme-toggle">Dark Mode</Label>
            <Switch id="theme-toggle" checked={theme === "dark"} onCheckedChange={toggleTheme} />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}