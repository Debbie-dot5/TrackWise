"use client"

import { useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { addExpenseSchema, AddExpenseFormData, addCategorySchema, AddCategoryFormData } from "@/lib/schema"
import { useExpenseStore } from "@/stores/expense-store"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { AlertCircle } from "lucide-react"
import { ToastContainer, toast } from "react-toastify"
import { format } from "date-fns"
import { useSupabaseSubscriptions } from "@/hooks/useSupabaseSubscription"
import MoneyVibes from "@/app/components/MoneyHealth"
//import IncomeExpenseChart from "@/app/components/IncomeChart"
export default function DashboardPage() {
  const { profile, categories, expenses, budgetGoals, monthlyIncome, loading, fetchUserProfile, fetchCategories, fetchExpenses,fetchBudgetGoals, addCategory, addExpense, getSpentByCategory } = useExpenseStore()
  

  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false)
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false)

  // Forms
  const expenseForm = useForm<AddExpenseFormData>({ resolver: zodResolver(addExpenseSchema), defaultValues: { amount: 0, category: "", note: "", date: new Date() } })
  const categoryForm = useForm<AddCategoryFormData>({ resolver: zodResolver(addCategorySchema), defaultValues: { name: "", emoji: "✨" } })

  // Fetch data and set up subscriptions
  useSupabaseSubscriptions({fetchCategories, fetchExpenses,  fetchUserProfile, fetchBudgetGoals})
  // useEffect(() => {
  //   fetchUserProfile()
  //   fetchCategories()
  //   fetchExpenses()

  //   const fetchUser = async () => {
  //     const { data: { user } } = await supabase.auth.getUser()
  //     if (!user) return

  //     const expenseSub = supabase
  //       .channel("expenses")
  //       .on("postgres_changes", { event: "*", schema: "public", table: "expenses", filter: `user_id=eq.${user.id}` }, () => fetchExpenses())
  //       .subscribe()

  //     const categorySub = supabase
  //       .channel("categories")
  //       .on("postgres_changes", { event: "*", schema: "public", table: "categories", filter: `user_id=eq.${user.id}` }, () => fetchCategories())
  //       .subscribe()

  //     return () => {
  //       supabase.removeChannel(expenseSub)
  //       supabase.removeChannel(categorySub)
  //     }
  //   }
  //   fetchUser()
  // }, [userName, fetchUserProfile, fetchCategories, fetchExpenses])

  // Handlers
  
  
  const handleAddExpense = async (data: AddExpenseFormData) => {
    const { success, error } = await addExpense({
      amount: parseFloat(data.amount.toFixed(2)),
      category: data.category,
      note: data.note || "",
      date: format(data.date, "yyyy-MM-dd"),
    })
    if (success) {
      expenseForm.reset()
      setIsAddExpenseOpen(false)
      toast.success("Expense added! 🎉")
    } else {
      toast.error(error || "Failed to add expense")
    }
  }

  const handleAddCategory = async (data: AddCategoryFormData) => {
    if (categories.some((cat) => cat.name.toLowerCase() === data.name.toLowerCase())) {
      categoryForm.setError("name", { message: "Category name already exists" })
      toast.error("Category name already exists")
      return
    }
    const { success, error } = await addCategory(data.name, data.emoji)
    if (success) {
      categoryForm.reset({ name: "", emoji: "✨" })
      setIsAddCategoryOpen(false)
      toast.success("Category added! ✨")
    } else {
      toast.error(error || "Failed to add category")
    }
  }
  
  // Heads-up when spending exceeds income
  
  
  
  //const handleEditIncome = 

  // Calculate total spending
  const totalSpending = useMemo(() => {
    return expenses.reduce((sum, expense) => sum + expense.amount, 0)
  }, [expenses])

  const spendingByCategory = useMemo(() => {
    return categories.map((category) => ({
      name: category.name,
      emoji: category.emoji,
      spent: getSpentByCategory(category.name),
      budget: budgetGoals.find((bg) => bg.category === category.name)?.amount || 0,
    }))
  }, [budgetGoals, categories, getSpentByCategory])

  // Notify when spending exceeds income (debounced by id)
  if (totalSpending > monthlyIncome) {
    toast.warning("Your spending has exceeded your monthly income! Please rebudget.", { toastId: "spend-vs-income" })
  } else {
    toast.dismiss("spend-vs-income")
  }

  // Prompt to add categories if none exist
  //if (!loading && categories.length === 0) {
  //  toast.info("No categories yet. Add one to start!", { toastId: "no-categories" })
  //}




//   useEffect(() => {
//   if (totalSpending > monthlyIncome) {
//     toast.warning("⚠️ Your spending has exceeded your monthly income! Please rebudget.");
//   } 

// }, [totalSpending, monthlyIncome]);




 if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-purple-bg to-deep-purple-bg p-4 sm:p-6 lg:p-8 flex items-center justify-center">
        <Card className="p-8 shadow-lg rounded-xl bg-card text-card-foreground border border-border">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-foreground">Loading your financial data...</p>
          </div>
        </Card>
      </div>
    )
  }
  return (
    <div className="space-y-6 p-4">
      <ToastContainer/>
      <h1 className="text-2xl font-bold text-foreground">Hey, { profile?.name || "user"} welcome to your dashboard!</h1>
      {/* <h1 className="text-2xl font-bold text-foreground">Dashboard</h1> */}

      {/* Overview */}
      <Card className="shadow-lg rounded-xl bg-card text-card-foreground border border-border">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-foreground">Monthly Overview</CardTitle>
        </CardHeader>
        {/* total spending should not go above monthly income and remaining budget should not go below monthly income */}
        <CardContent className="space-y-2">
          <div className="flex justify-between text-foreground">
            <span>Total Spending:</span>
           <span
            className={`font-bold ${
              totalSpending > monthlyIncome ?  "font-bold text-destructive" : "font-bold text-primary"
            }`}
          >
            ₦{totalSpending.toLocaleString("en-NG", { minimumFractionDigits: 2 })}
          </span>
          </div>
          <div className="flex justify-between text-foreground">
            <span>Remaining Budget:</span>
            <span className={
              `font bold ${
              monthlyIncome - totalSpending < 0 ? "font-bold text-destructive" : "font-bold text-primary"
              }`
        
              
              }>
              ₦{ monthlyIncome - totalSpending < 0 
              ? 0 
              : 
              (monthlyIncome - totalSpending).toLocaleString("en-NG", { minimumFractionDigits: 2 })}
            </span>
          </div>

           <div className="flex justify-between text-foreground">
            <span>Total Income:</span>
          <span className="font-bold text-primary">₦{(monthlyIncome).toLocaleString("en-NG",  {minimumFractionDigits: 2})}</span>
          </div>
        </CardContent>
      </Card>

      {/* Spending by Category */}
      <Card className="shadow-lg rounded-xl bg-card text-card-foreground border border-border">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-foreground">Spending by Category</CardTitle>
        </CardHeader>
        <CardContent>
          {spendingByCategory.length === 0 ? (
            <p className="text-muted-foreground">No categories yet. Add one to start!</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {spendingByCategory.map((cat) => (
                <Card key={cat.name} className={`p-4 ${cat.spent > cat.budget && cat.budget > 0 ? "border-destructive" : "border-border"}`}>

                <div className="flex flex-col items-center gap-2 ">
                  <span className="text-lg font-semibold text-foreground">{cat.emoji} {cat.name}</span>
                {cat.spent > cat.budget && cat.budget > 0 && <AlertCircle className="h-5 w-5 text-destructive" />}

                  <p className="font-bold text-primary">₦{cat.spent.toLocaleString("en-NG", { minimumFractionDigits: 2 })}</p>
                  <p className="text-sm text-muted-foreground">Budget: ₦{cat.budget.toLocaleString("en-NG", { minimumFractionDigits: 2 })}</p>
                 {cat.spent > cat.budget && cat.budget > 0 && (
                    <p className="text-sm text-destructive">Overbudget by ₦{(cat.spent - cat.budget).toLocaleString("en-NG", { minimumFractionDigits: 2 })}!</p>
                  )}

                </div>

                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="flex justify-center gap-4">
        <Dialog open={isAddExpenseOpen} onOpenChange={setIsAddExpenseOpen}>
          <DialogTrigger asChild>
            <Button disabled={categories.length === 0} className="bg-vibrant-purple hover:bg-vibrant-pink text-white rounded-full">
              Add Expense 
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card text-card-foreground border border-border rounded-xl">
            <DialogHeader>
              <DialogTitle>Add Expense</DialogTitle>
            </DialogHeader>
            <form onSubmit={expenseForm.handleSubmit(handleAddExpense)} className="space-y-4">
              <div>
                <Label htmlFor="amount">Amount (₦)</Label>
                <Input id="amount" type="number" step="0.01" min="0.01" max="99999999.99" {...expenseForm.register("amount", { valueAsNumber: true })} className="border-border" />
                {expenseForm.formState.errors.amount && <p className="text-sm text-destructive">{expenseForm.formState.errors.amount.message}</p>}
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Select onValueChange={(value) => expenseForm.setValue("category", value, { shouldValidate: true })} defaultValue={expenseForm.watch("category")}>
                  <SelectTrigger className="border-border">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.name} value={cat.name}>{cat.emoji} {cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {expenseForm.formState.errors.category && <p className="text-sm text-destructive">{expenseForm.formState.errors.category.message}</p>}
              </div>
              <div>
                <Label htmlFor="note">Note (Optional)</Label>
                <Input id="note" {...expenseForm.register("note")} className="border-border" />
              </div>
              <div>
                <Label htmlFor="date">Date</Label>
                <Input id="date" type="date" {...expenseForm.register("date", { valueAsDate: true })} className="border-border" />
                {expenseForm.formState.errors.date && <p className="text-sm text-destructive">{expenseForm.formState.errors.date.message}</p>}
              </div>
              <Button type="submit" disabled={loading} className="w-full bg-vibrant-purple hover:bg-vibrant-pink text-white rounded-full">Add</Button>
            </form>
          </DialogContent>
        </Dialog>

        <Dialog open={isAddCategoryOpen} onOpenChange={setIsAddCategoryOpen}>
          <DialogTrigger asChild>
            <Button className="bg-vibrant-purple hover:bg-vibrant-pink text-white rounded-full">Add Category </Button>
          </DialogTrigger>
          <DialogContent className="bg-card text-card-foreground border border-border rounded-xl">
            <DialogHeader>
              <DialogTitle>Add Category</DialogTitle>
            </DialogHeader>
            <form onSubmit={categoryForm.handleSubmit(handleAddCategory)} className="space-y-4">
              <div>
                <Label htmlFor="name">Category Name</Label>
                <Input id="name" {...categoryForm.register("name")} className="border-border" />
                {categoryForm.formState.errors.name && <p className="text-sm text-destructive">{categoryForm.formState.errors.name.message}</p>}
              </div>
              <div>
                <Label htmlFor="emoji">Emoji</Label>
                <Input id="emoji" defaultValue="✨" {...categoryForm.register("emoji")} className="border-border" />
                {categoryForm.formState.errors.emoji && <p className="text-sm text-destructive">{categoryForm.formState.errors.emoji.message}</p>}
              </div>
              <Button type="submit" disabled={loading} className="w-full bg-vibrant-purple hover:bg-vibrant-pink text-white rounded-full">Add</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

     



      {/* <IncomeExpenseChart monthlyIncome={monthlyIncome} expenses={expenses}/> */}

        <MoneyVibes 
        categories={categories} 
        budgetGoals={budgetGoals}  
        monthlyIncome={monthlyIncome} 
        expenses={expenses} 
        getSpentByCategory={getSpentByCategory}/>
    </div>
  )
}