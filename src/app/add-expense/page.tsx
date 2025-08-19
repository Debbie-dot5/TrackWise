"use client"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ChevronLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
//import { DatePicker } from "@/components/ui/date-picker"
import { useExpenseStore } from "@/stores/expense-store"
import { addExpenseSchema, AddExpenseFormData } from "@/lib/schema"
//import { addExpenseSchema, type AddExpenseFormData } from "@/lib/validations"

// Predefined categories
const predefinedCategories = [
  { name: "Food", emoji: "🍔" },
  { name: "Transport", emoji: "🚌" },
  { name: "Skin care", emoji: "🧴" },
  { name: "Impulse", emoji: "🛍️" },
  { name: "Subscription", emoji: "📺" },
  { name: "Church", emoji: "⛪" },
  { name: "School", emoji: "📚" },
  { name: "Data", emoji: "📶" },
  { name: "Other", emoji: "✨" },
]

export default function AddExpensePage() {
  const { addExpense } = useExpenseStore()
  const router = useRouter()

  // React Hook Form with Zod validation
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    setError,
    reset,
  } = useForm<AddExpenseFormData>({
    resolver: zodResolver(addExpenseSchema),
    defaultValues: {
      date: new Date(),
    },
  })

  const onSubmit = async (data: AddExpenseFormData) => {
    const result = await addExpense({
      amount: data.amount,
      category: data.category,
      note: data.note || "",
      date: data.date.toISOString().split("T")[0], // Convert to YYYY-MM-DD format
    })

    if (result.success) {
      reset() // Clear the form
      router.push("/dashboard")
    } else {
      setError("root", {
        message: result.error || "Failed to add expense",
      })
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-dark-purple-bg to-deep-purple-bg p-4">
      <Card className="w-full max-w-md mx-auto shadow-lg rounded-xl bg-card">
        <CardHeader className="text-center relative">
          <Link href="/dashboard" className="absolute left-4 top-4 text-muted-foreground hover:text-primary">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ChevronLeft className="h-5 w-5" />
              <span className="sr-only">Back to Dashboard</span>
            </Button>
          </Link>
          <CardTitle className="text-3xl font-bold text-foreground mt-4">Track New Expense 💰</CardTitle>
          <CardDescription className="text-muted-foreground">
            Every naira counts! Log your spending here.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Amount Field */}
            <div className="space-y-2">
              <Label htmlFor="amount" className="text-foreground">
                Amount (₦)
              </Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="e.g., 5000"
                {...register("amount", { valueAsNumber: true })}
                className="py-2 px-4 rounded-lg border border-border focus:ring-2 focus:ring-primary focus:border-primary bg-input text-foreground"
              />
              {errors.amount && <p className="text-sm text-destructive">{errors.amount.message}</p>}
            </div>

            {/* Category Field */}
            <div className="space-y-2">
              <Label htmlFor="category" className="text-foreground">
                Category
              </Label>
              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-full py-2 px-4 rounded-lg border border-border focus:ring-2 focus:ring-primary focus:border-primary bg-input text-foreground">
                      <SelectValue placeholder="Pick a category that fits... 🤔" />
                    </SelectTrigger>
                    <SelectContent className="bg-card text-card-foreground border border-border">
                      {predefinedCategories.map((cat) => (
                        <SelectItem key={cat.name} value={cat.name}>
                          {cat.emoji} {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.category && <p className="text-sm text-destructive">{errors.category.message}</p>}
            </div>

            {/* Note Field */}
            <div className="space-y-2">
              <Label htmlFor="note" className="text-foreground">
                Note (Optional)
              </Label>
              <Textarea
                id="note"
                placeholder="e.g., Got shawarma & drink with the squad 😋"
                {...register("note")}
                className="min-h-[80px] py-2 px-4 rounded-lg border border-border focus:ring-2 focus:ring-primary focus:border-primary bg-input text-foreground"
              />
              {errors.note && <p className="text-sm text-destructive">{errors.note.message}</p>}
            </div>

            {/* Date Field */}
            {/* <div className="space-y-2">
              <Label htmlFor="date" className="text-foreground">
                Date
              </Label>
              <Controller
                name="date"
                control={control}
                render={({ field }) => (
                  <DatePicker date={field.value} setDate={field.onChange} placeholder="Pick a date" />
                )}
              />
              {errors.date && <p className="text-sm text-destructive">{errors.date.message}</p>}
            </div> */}

            {/* Server Error */}
            {errors.root && (
              <div className="text-sm text-destructive text-center p-2 bg-destructive/10 rounded-lg">
                {errors.root.message}
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 text-lg bg-vibrant-purple hover:bg-vibrant-pink text-white rounded-full shadow-lg transition-all duration-200 ease-in-out transform hover:scale-105"
            >
              {isSubmitting ? "Tracking..." : "Track This 💰"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
