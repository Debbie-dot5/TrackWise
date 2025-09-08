// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { AlertCircle } from "lucide-react"
// import { Category, BudgetGoal } from "@/lib/types"

// interface SpendingCategoryCardsProps {
//   categories: Category[]
//   budgetGoals: BudgetGoal[]
//   getSpentByCategory: (category: string) => number
// }

// export default function SpendingCategoryCards({ categories, budgetGoals, getSpentByCategory }: SpendingCategoryCardsProps) {
//   const spendingByCategory = categories.map((cat) => ({
//     name: cat.name,
//     emoji: cat.emoji,
//     spent: getSpentByCategory(cat.name),
//     budget: budgetGoals.find((bg) => bg.category === cat.name)?.amount || 0,
//   }))

//   return (
//     <Card className="shadow-lg rounded-xl bg-card text-card-foreground border border-border">
//       <CardHeader><CardTitle className="text-xl font-bold text-foreground">Spending Categories</CardTitle></CardHeader>
//       <CardContent>
//         {spendingByCategory.length === 0 ? (
//           <p className="text-muted-foreground">No categories yet. Add one to start!</p>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//             {spendingByCategory.map((cat) => (
//               <Card key={cat.name} className={`p-4 ${cat.spent > cat.budget && cat.budget > 0 ? "border-destructive" : "border-border"}`}>
//                 <div className="flex items-center gap-2">
//                   <span className="text-lg font-semibold text-foreground">{cat.emoji} {cat.name}</span>
//                   {cat.spent > cat.budget && cat.budget > 0 && <AlertCircle className="h-5 w-5 text-destructive" />}
//                 </div>
//                 <p className="text-sm text-foreground">Spent: ₦{cat.spent.toLocaleString("en-NG", { minimumFractionDigits: 2 })}</p>
//                 <p className="text-sm text-muted-foreground">Budget: ₦{cat.budget.toLocaleString("en-NG", { minimumFractionDigits: 2 })}</p>
//                 {cat.spent > cat.budget && cat.budget > 0 && (
//                   <p className="text-sm text-destructive">Overbudget by ₦{(cat.spent - cat.budget).toLocaleString("en-NG", { minimumFractionDigits: 2 })}!</p>
//                 )}
//               </Card>
//             ))}
//           </div>
//         )}
//       </CardContent>
//     </Card>
//   )
// }