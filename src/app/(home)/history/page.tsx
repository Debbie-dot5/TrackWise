// app/transactions/page.tsx
"use client"

import { useState, useMemo } from "react"
import { useExpenseStore } from "@/stores/expense-store"
import { useSupabaseSubscriptions } from "@/hooks/useSupabaseSubscription"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { format, subMonths } from "date-fns"



export default function TransactionsPage() {
  const { expenses, categories, loading, fetchExpenses, fetchCategories} = useExpenseStore()
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [monthYearFilter, setMonthYearFilter] = useState<string>('all')
 

  useSupabaseSubscriptions({ fetchCategories, fetchExpenses,})



  //const filteredExpenses = categoryFilter === "all" ? expenses : expenses.filter((exp) => exp.category === categoryFilter)

  const monthYearOptions = useMemo(() => {
    const options = [{ value: "all", label: "All Months" }]
    const now = new Date()
    for (let i = 0; i < 12; i++) {
      const date = subMonths(now, i)
      const value = format(date, "yyyy-MM")
      const label = format(date, "MMM yyyy")
      options.push({ value, label })
    }
    return options
  }, [])
  
  
  const filteredExpenses = expenses.filter((exp) => {
  const matchesCategory = categoryFilter === "all" || exp.category === categoryFilter
  const matchesMonthYear = monthYearFilter === "all" || exp.date.startsWith(monthYearFilter)
  return matchesCategory && matchesMonthYear
})



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
      <h1 className="text-2xl font-bold text-foreground">Transaction History</h1>
      <div className="flex flex-col gap-4">
       
       <div className="flex justify-between">
         <div>
          <Label htmlFor="category-filter">Filter by Category</Label>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger id="category-filter" className="border-border w-[200px]">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.name} value={cat.name}>{cat.emoji} {cat.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>


         <div>
          <Label htmlFor="month-year-filter">Filter by Month/Year</Label>
          <Select value={monthYearFilter} onValueChange={setMonthYearFilter}>
            <SelectTrigger id="month-year-filter" className="border-border w-[200px]">
              <SelectValue placeholder="All Months" />
            </SelectTrigger>

            <SelectContent>
              {monthYearOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
            
          </Select>
      </div>
       </div>

     
     
      <Card className="shadow-lg rounded-xl bg-card text-card-foreground border border-border">
        <CardHeader><CardTitle className="text-xl font-bold text-foreground">Expenses</CardTitle></CardHeader>
        <CardContent>
          {filteredExpenses.length === 0 ? (
            <p className="text-muted-foreground">No expenses found.</p>
          ) : (
            <div className="space-y-2">
              {filteredExpenses.map((exp) => (
                <div key={exp.id} className="flex justify-between items-center border-b border-border py-2">
                  <div>
                    <span className="text-foreground">{categories.find((cat) => cat.name === exp.category)?.emoji || "💸"} {exp.category}</span>
                    <p className="text-sm text-muted-foreground">{exp.note || "No note"} - {exp.date}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-primary">₦{exp.amount.toLocaleString("en-NG", { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
    </div>
  )
}