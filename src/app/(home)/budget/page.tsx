"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { addExpenseSchema, AddExpenseFormData, editExpenseSchema, EditExpenseFormData } from "@/lib/schema"
import { useExpenseStore } from "@/stores/expense-store"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { format, parse } from "date-fns"
import { Pencil, Trash2 } from "lucide-react"
import { ToastContainer, toast } from 'react-toastify';

export default function BudgetExpensesPage() {
  const { categories, expenses, loading, fetchCategories, fetchExpenses, addExpense, updateExpense, deleteExpense } = useExpenseStore()


  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false)
  const [isEditExpenseOpen, setIsEditExpenseOpen] = useState(false)
  const [, setEditingExpense] = useState<EditExpenseFormData | null>(null)

  // Forms
  const expenseForm = useForm<AddExpenseFormData>({ resolver: zodResolver(addExpenseSchema), defaultValues: { amount: 0, category: "", note: "", date: new Date() } })
  const editExpenseForm = useForm<EditExpenseFormData>({ resolver: zodResolver(editExpenseSchema), defaultValues: { id: "", amount: 0, category: "", note: "", date: new Date() } })

  // Fetch data and set up subscriptions
  useEffect(() => {
    fetchCategories()
    fetchExpenses()

    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      /// just incase i forget how to use supabase subcriptions 
      //define a supabase variable
      // create a channel
      // create a callback using the .on method
      // 
      const expenseSub = supabase
        .channel("expenses")
        .on("postgres_changes", { event: "*", schema: "public", table: "expenses", filter: `user_id=eq.${user.id}` }, () => fetchExpenses())
        .subscribe()

      const categorySub = supabase
        .channel("categories")
        .on("postgres_changes", { event: "*", schema: "public", table: "categories", filter: `user_id=eq.${user.id}` }, () => fetchCategories())
        .subscribe()

      return () => {
        supabase.removeChannel(expenseSub)
        supabase.removeChannel(categorySub)
      }
    }
    fetchUser()
  }, [fetchCategories, fetchExpenses])


  // Inform user if no categories available
  useEffect(() => {
    if (!loading && categories.length === 0) {
      toast.info('No categories yet. Add one to start!', { toastId: 'no-categories-budget' })
    }
  }, [loading, categories.length])

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
      toast.success('Expense added! 🎉')
    } else {
      toast.error(error || 'Failed to add expense')
    }
  }

  const handleEditExpense = async (data: EditExpenseFormData) => {
    const { success, error } = await updateExpense(data.id, {
      amount: parseFloat(data.amount.toFixed(2)),
      category: data.category,
      note: data.note || "",
      date: format(data.date, "yyyy-MM-dd"),
    })
    if (success) {
      editExpenseForm.reset()
      setIsEditExpenseOpen(false)
      setEditingExpense(null)
      toast.success('Expense updated! 🎉')
    } else {
      toast.error(error || 'Failed to update expense')
    }
  }

  const handleDeleteExpense = async (id: string) => {
    const { success, error } = await deleteExpense(id)
    if (success) {
      toast.success('Expense deleted! 🗑️')
    } else {
      toast.error(error || 'Failed to delete expense')
    }
  }

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
      <h1 className="text-2xl font-bold text-foreground">Budget & Expenses</h1>

      {/* Add Buttons */}
      <div className="flex gap-4">
        <Dialog open={isAddExpenseOpen} onOpenChange={setIsAddExpenseOpen}>
          <DialogTrigger asChild>
            <Button disabled={categories.length === 0} className="bg-vibrant-purple hover:bg-vibrant-pink text-white rounded-full">
              Add Expense 💸
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

        {/* <Dialog open={isAddCategoryOpen} onOpenChange={setIsAddCategoryOpen}>
          <DialogTrigger asChild>
            <Button className="bg-vibrant-purple hover:bg-vibrant-pink text-white rounded-full">Add Category ✨</Button>
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
        </Dialog> */}
      </div>

      {/* Expenses List */}
      <Card className="shadow-lg rounded-xl bg-card text-card-foreground border border-border">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-foreground">Recent Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          {expenses.length === 0 ? (
            <p className="text-muted-foreground">No expenses yet. Add one to start!</p>
          ) : (
            <div className="space-y-2">
              {expenses.slice(0, 5).map((expense) => (
                <div key={expense.id} className="flex justify-between items-center border-b border-border py-2">
                  <span className="text-foreground">
                    {categories.find((cat) => cat.name === expense.category)?.emoji || "💸"} {expense.category} - {expense.note || "No note"} ({expense.date})
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-primary">₦{expense.amount.toLocaleString("en-NG", { minimumFractionDigits: 2 })}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        editExpenseForm.reset({
                          id: expense.id,
                          amount: expense.amount,
                          category: expense.category,
                          note: expense.note,
                          date: parse(expense.date, "yyyy-MM-dd", new Date()),
                        })
                        setEditingExpense({ id: expense.id, amount: expense.amount, category: expense.category, note: expense.note, date: parse(expense.date, "yyyy-MM-dd", new Date()) })
                        setIsEditExpenseOpen(true)
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteExpense(expense.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
              {expenses.length > 5 && <p className="text-sm text-muted-foreground">Showing 5 of {expenses.length} expenses</p>}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Expense Modal */}
      <Dialog open={isEditExpenseOpen} onOpenChange={setIsEditExpenseOpen}>
        <DialogContent className="bg-card text-card-foreground border border-border rounded-xl">
          <DialogHeader>
            <DialogTitle>Edit Expense</DialogTitle>
          </DialogHeader>
          <form onSubmit={editExpenseForm.handleSubmit(handleEditExpense)} className="space-y-4">
            <div>
              <Label htmlFor="amount">Amount (₦)</Label>
              <Input id="amount" type="number" step="0.01" min="0.01" max="99999999.99" {...editExpenseForm.register("amount", { valueAsNumber: true })} className="border-border" />
              {editExpenseForm.formState.errors.amount && <p className="text-sm text-destructive">{editExpenseForm.formState.errors.amount.message}</p>}
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Select onValueChange={(value) => editExpenseForm.setValue("category", value, { shouldValidate: true })} defaultValue={editExpenseForm.watch("category")}>
                <SelectTrigger className="border-border">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.name} value={cat.name}>{cat.emoji} {cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {editExpenseForm.formState.errors.category && <p className="text-sm text-destructive">{editExpenseForm.formState.errors.category.message}</p>}
            </div>
            <div>
              <Label htmlFor="note">Note (Optional)</Label>
              <Input id="note" {...editExpenseForm.register("note")} className="border-border" />
            </div>
            <div>
              <Label htmlFor="date">Date</Label>
              <Input id="date" type="date" {...editExpenseForm.register("date", { valueAsDate: true })} className="border-border" />
              {editExpenseForm.formState.errors.date && <p className="text-sm text-destructive">{editExpenseForm.formState.errors.date.message}</p>}
            </div>
            <Button type="submit" disabled={loading} className="w-full bg-vibrant-purple hover:bg-vibrant-pink text-white rounded-full">Save</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}