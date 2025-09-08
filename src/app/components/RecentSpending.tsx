// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Pencil, Trash2 } from "lucide-react"
// import { Expense, Category } from "@/lib/types"
// import { EditExpenseFormData } from "@/lib/schema"
// //import EditExpenseModal from "./EditExpenseModal"

// interface RecentSpendingProps {
//   expenses: Expense[]
//   categories: Category[]
//   updateExpense: (id: string, data: { amount: number; category: string; note: string; date: string }) => Promise<{ success: boolean; error?: string }>
//   deleteExpense: (id: string) => Promise<{ success: boolean; error?: string }>
// }

// export default function RecentSpending({ expenses, categories, updateExpense, deleteExpense }: RecentSpendingProps) {
//   return (
//     <Card className="shadow-lg rounded-xl bg-card text-card-foreground border border-border">
//       <CardHeader><CardTitle className="text-xl font-bold text-foreground">Recent Spending (Last 5)</CardTitle></CardHeader>
//       <CardContent>
//         {expenses.length === 0 ? (
//           <p className="text-muted-foreground">No expenses yet. Add one to start!</p>
//         ) : (
//           <div className="space-y-2">
//             {expenses.slice(0, 5).map((exp) => (
//               <div key={exp.id} className="flex justify-between items-center border-b border-border py-2">
//                 <span className="text-foreground">{categories.find((cat) => cat.name === exp.category)?.emoji || "💸"} {exp.category} - {exp.note || "No note"} ({exp.date})</span>
//                 <div className="flex items-center gap-2">
//                   <span className="text-primary">₦{exp.amount.toLocaleString("en-NG", { minimumFractionDigits: 2 })}</span>
//                   <EditExpenseModal.Trigger asChild>
//                     <Button variant="ghost" size="icon" onClick={() => {
//                       const expenseData: EditExpenseFormData = {
//                         id: exp.id,
//                         amount: exp.amount,
//                         category: exp.category,
//                         note: exp.note || "",
//                         date: new Date(exp.date),
//                       }
//                       // Trigger is handled by EditExpenseModal
//                     }}>
//                       <Pencil className="h-4 w-4" />
//                     </Button>
//                   </EditExpenseModal.Trigger>
//                   <Button variant="ghost" size="icon" onClick={async () => {
//                     const { success, error } = await deleteExpense(exp.id)
//                     if (!success) alert(error || "Failed to delete expense")
//                   }}>
//                     <Trash2 className="h-4 w-4 text-destructive" />
//                   </Button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </CardContent>
//     </Card>
//   )
// }