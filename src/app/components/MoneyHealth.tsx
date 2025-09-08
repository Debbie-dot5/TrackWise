import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Category, BudgetGoal, Expense } from "@/lib/types"

interface MoneyVibesProps {
  categories: Category[]
  budgetGoals: BudgetGoal[]
  monthlyIncome: number
  expenses: Expense[]
  getSpentByCategory: (category: string) => number
}

export default function MoneyVibes({ categories, budgetGoals, monthlyIncome, expenses, getSpentByCategory }: MoneyVibesProps) {
  const totalSpending = expenses.reduce((sum, exp) => sum + exp.amount, 0)
  const spendingByCategory = categories.map((cat) => ({
    name: cat.name,
    spent: getSpentByCategory(cat.name),
    budget: budgetGoals.find((bg) => bg.category === cat.name)?.amount || 0,
  }))

  const moneyVibes = (() => {
    const overBudgetCats = spendingByCategory.filter((cat) => cat.spent > cat.budget && cat.budget > 0)
    const savings = monthlyIncome - totalSpending
    if (overBudgetCats.length > 0) {
      return `🚨 Overspent in ${overBudgetCats.map((cat) => cat.name).join(", ")}! Consider cutting back on these categories.`
    } else if (savings > 0.3 * monthlyIncome) {
      return `💸 You're saving ₦${savings.toLocaleString("en-NG", { minimumFractionDigits: 2 })}! Great job—consider investing or saving for a goal.`
    } else if (savings < 0) {
      return `⚠️ You're overspending by ₦${Math.abs(savings).toLocaleString("en-NG", { minimumFractionDigits: 2 })}! Review your expenses to stay on track.`
    } else {
      return "😎 Your spending is balanced. Keep tracking to maintain control!"
    }
  })()

  return (
    <Card className="shadow-lg rounded-xl bg-card text-card-foreground border border-border">
      <CardHeader><CardTitle className="text-xl font-bold text-foreground">Spending Alerts</CardTitle></CardHeader>
      <CardContent>
        <p className="text-foreground">{moneyVibes}</p>
      </CardContent>
    </Card>
  )
}