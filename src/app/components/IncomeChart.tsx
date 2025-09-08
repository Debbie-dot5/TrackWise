import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"
import { Expense } from "@/lib/types"

interface IncomeExpenseChartProps {
  monthlyIncome: number
  expenses: Expense[]
}

export default function IncomeExpenseChart({ monthlyIncome, expenses }: IncomeExpenseChartProps) {
  const totalSpending = expenses.reduce((sum, exp) => sum + exp.amount, 0)
  const chartData = [
    { name: "Income", value: monthlyIncome, fill: "hsl(var(--chart-2))" },
    { name: "Expenses", value: totalSpending, fill: "hsl(var(--chart-1))" },
  ]

  return (
    <Card className="shadow-lg rounded-xl bg-card text-card-foreground border border-border">
      <CardHeader><CardTitle className="text-xl font-bold text-foreground">Income vs Expenses</CardTitle></CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={(value: number) => `₦${value.toLocaleString("en-NG", { minimumFractionDigits: 2 })}`} />
            <Bar dataKey="value" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}