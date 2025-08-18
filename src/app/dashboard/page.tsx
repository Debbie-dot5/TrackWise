"use client"

import { useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Pie, PieChart, Cell, ResponsiveContainer } from "recharts"
import { PlusCircle } from "lucide-react"
import Link from "next/link"
import { useExpenseStore } from "@/stores/expense-store"

export default function DashboardPage() {
  const {
    //expenses,
    //budgetGoals,
    categories,
    monthlyIncome,
    userName,
    loading,
    fetchExpenses,
    fetchBudgetGoals,
    fetchCategories,
    fetchUserProfile,
    getSpentByCategory,
    getBudgetForCategory,
    getTotalSpent,
  } = useExpenseStore()

  useEffect(() => {
    fetchUserProfile()
    fetchExpenses()
    fetchBudgetGoals()
    fetchCategories()
  }, [fetchUserProfile, fetchExpenses, fetchBudgetGoals, fetchCategories])

  const categoriesWithSpending = useMemo(() => {
    return categories
      .map((category, index) => {
        const spent = getSpentByCategory(category.name)
        const budget = getBudgetForCategory(category.name)
        const colors = [
          "hsl(var(--chart-1))",
          "hsl(var(--chart-2))",
          "hsl(var(--chart-3))",
          "hsl(var(--chart-4))",
          "hsl(var(--chart-5))",
          "hsl(var(--chart-6))",
          "hsl(var(--chart-7))",
        ]

        return {
          name: category.name,
          emoji: category.emoji,
          spent,
          budget,
          color: colors[index % colors.length],
        }
      })
      .filter((cat) => cat.budget > 0) // Only show categories with budgets
  }, [categories, getSpentByCategory, getBudgetForCategory])

  const totalSpent = getTotalSpent()
  const spentPercentage = monthlyIncome > 0 ? (totalSpent / monthlyIncome) * 100 : 0

  const chartData = categoriesWithSpending
    .filter((cat) => cat.spent > 0) // Only show categories with spending
    .map((cat) => ({
      name: cat.name,
      value: cat.spent,
      fill: cat.color,
    }))

  const getAlerts = () => {
    const alerts = []
    const overspentCategories = categoriesWithSpending.filter((cat) => cat.spent > cat.budget)
    const underbudgetCategories = categoriesWithSpending.filter((cat) => cat.spent < cat.budget * 0.5)

    if (overspentCategories.length > 0) {
      overspentCategories.forEach((cat) => {
        alerts.push(`You're vibing a bit too hard on ${cat.name} ${cat.emoji} — let's check that! 😩`)
      })
    }

    if (underbudgetCategories.length > 0) {
      underbudgetCategories.forEach((cat) => {
        alerts.push(`${cat.name} spending is chill this month ${cat.emoji} 👌`)
      })
    }

    if (alerts.length === 0) {
      alerts.push("Your money's looking good! Keep up the great work! ✨")
    }

    return alerts
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
    <div className="min-h-screen bg-gradient-to-br from-dark-purple-bg to-deep-purple-bg p-4 sm:p-6 lg:p-8">
      {/* Top Section */}
      <Card className="mb-6 shadow-lg rounded-xl bg-card text-card-foreground border border-border">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-foreground">
            Hey {userName || "there"}, here&apos;s how your money&apos;s vibing 💸
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center text-lg font-medium text-foreground">
            <span>Total Income This Month:</span>
            <span className="text-chart-4">₦{monthlyIncome.toLocaleString()}</span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Spent: ₦{totalSpent.toLocaleString()}</span>
              <span>Income: ₦{monthlyIncome.toLocaleString()}</span>
            </div>
            <Progress value={spentPercentage} className="h-3 rounded-full bg-muted [&>*]:bg-primary" />
            <p className="text-sm text-muted-foreground mt-1">
              {spentPercentage.toFixed(1)}% of your income spent so far.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Expense Summary by Category */}
      <h2 className="text-xl font-bold text-foreground mb-4">Your Spending Zones 🗺️</h2>
      {categoriesWithSpending.length > 0 ? (
        <div className="flex overflow-x-auto pb-4 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
          <div className="flex gap-4 min-w-max">
            {categoriesWithSpending.map((category) => {
              const percentageSpent = category.budget > 0 ? (category.spent / category.budget) * 100 : 0
              const isOverBudget = category.spent > category.budget
              return (
                <Card
                  key={category.name}
                  className={`min-w-[200px] w-[200px] shadow-md rounded-xl transition-all duration-200 ease-in-out bg-card text-card-foreground border ${
                    isOverBudget ? "border-destructive" : "border-border"
                  }`}
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-semibold flex items-center gap-2 text-foreground">
                      {category.emoji} {category.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="text-sm text-foreground">
                      Spent:{" "}
                      <span className={`font-bold ${isOverBudget ? "text-destructive" : "text-primary"}`}>
                        ₦{category.spent.toLocaleString()}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Budget: <span className="font-medium">₦{category.budget.toLocaleString()}</span>
                    </div>
                    <Progress
                      value={percentageSpent}
                      className={`h-2 rounded-full ${isOverBudget ? "bg-destructive/20 [&>*]:bg-destructive" : "bg-primary/20 [&>*]:bg-primary"}`}
                    />
                    {isOverBudget && (
                      <p className="text-xs text-destructive font-medium mt-1">
                        Over budget by ₦{(category.spent - category.budget).toLocaleString()}! 🚨
                      </p>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      ) : (
        <Card className="p-6 shadow-md rounded-xl bg-card text-card-foreground border border-border">
          <p className="text-center text-muted-foreground">
            No spending categories found. Complete your onboarding to set up your budget categories!
          </p>
        </Card>
      )}

      {/* Chart Section */}
      <Card className="mt-6 shadow-lg rounded-xl bg-card text-card-foreground border border-border">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-foreground">Your Spending Breakdown 📊</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center p-4">
          {chartData.length > 0 ? (
            <ChartContainer
              config={{
                spent: {
                  label: "Amount Spent",
                },
                ...Object.fromEntries(categoriesWithSpending.map((cat) => [cat.name, { color: cat.color }])),
              }}
              className="h-[300px] w-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <ChartTooltip cursor={false} content={<ChartTooltipContent nameKey="name" hideLabel />} />
                  <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center">
              <p className="text-muted-foreground text-center">
                No expenses recorded yet.
                <br />
                Start tracking your spending to see your breakdown!
              </p>
            </div>
          )}
          <Link href="/add-expense" passHref>
            <Button className="mt-6 py-3 px-6 text-lg bg-primary hover:bg-primary/90 text-primary-foreground rounded-full shadow-lg transition-all duration-200 ease-in-out transform hover:scale-105 flex items-center gap-2">
              <PlusCircle className="h-5 w-5" />
              Add New Expense
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Alerts / Suggestions */}
      <div className="mt-6 space-y-3">
        <h2 className="text-xl font-bold text-foreground">Money Vibes Check! ✨</h2>
        {getAlerts().map((alert, index) => (
          <Card key={index} className="p-4 shadow-md rounded-xl bg-card text-card-foreground border border-border">
            <p className="text-foreground">{alert}</p>
          </Card>
        ))}
      </div>

      {/* Navigation to other sections */}
      <div className="mt-8 w-full max-w-md mx-auto grid grid-cols-2 gap-4">
        <Link href="/edit-budget" passHref>
          <Button
            variant="outline"
            className="w-full py-3 text-md border-2 border-primary text-primary hover:bg-primary/10 bg-transparent rounded-full shadow-sm"
          >
            Edit Budget 🛠️
          </Button>
        </Link>
        <Link href="/history" passHref>
          <Button
            variant="outline"
            className="w-full py-3 text-md border-2 border-primary text-primary hover:bg-primary/10 bg-transparent rounded-full shadow-sm"
          >
            Transaction History 📖
          </Button>
        </Link>
        <Link href="/alerts" passHref>
          <Button
            variant="outline"
            className="w-full py-3 text-md border-2 border-primary text-primary hover:bg-primary/10 bg-transparent rounded-full shadow-sm"
          >
            Alerts & Reminders 🔔
          </Button>
        </Link>
        <Link href="/settings" passHref>
          <Button
            variant="outline"
            className="w-full py-3 text-md border-2 border-primary text-primary hover:bg-primary/10 bg-transparent rounded-full shadow-sm"
          >
            Settings ⚙️
          </Button>
        </Link>
        <Link href="/tips" passHref>
          <Button
            variant="outline"
            className="w-full py-3 text-md border-2 border-primary text-primary hover:bg-primary/10 bg-transparent rounded-full shadow-sm"
          >
            Money Tips 💡
          </Button>
        </Link>
        <Link href="/goals" passHref>
          <Button
            variant="outline"
            className="w-full py-3 text-md border-2 border-primary text-primary hover:bg-primary/10 bg-transparent rounded-full shadow-sm"
          >
            Goal Tracker 🎯
          </Button>
        </Link>
      </div>
    </div>
  )
}
