// import { useState } from "react"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Pencil, Trash2 } from "lucide-react"
// import { format, parse, subWeeks, startOfWeek, startOfMonth } from "date-fns"
// import { Expense, Category } from "@/lib/types"
// import { EditExpenseFormData } from "@/lib/schema"
// //import EditExpenseModal from "./EditExpenseModal"

// interface TransactionHistoryProps {
//   expenses: Expense[]
//   categories: Category[]
//   updateExpense: (id: string, data: { amount: number; category: string; note: string; date: string }) => Promise<{ success: boolean; error?: string }>
//   deleteExpense: (id: string) => Promise<{ success: boolean; error?: string }>
// }

// export default function TransactionHistory({ expenses, categories, updateExpense, deleteExpense }: TransactionHistoryProps) {
//   const [historyFilter, setHistoryFilter] = useState<"all" | "week" | "month">("all")

//   const filteredExpenses = expenses
//     .filter((exp) => {
//       const expDate = parse(exp.date, "yyyy-MM-dd", new Date())
//       const now = new Date()
//       if (historyFilter === "week") return expDate >= startOfWeek(subWeeks(now, 1))
//       if (historyFilter === "month") return expDate >= startOfMonth(now)
//       return true
//     })
//     .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

//   return (
//     <Card className="shadow-lg rounded-xl bg-card text-card-foreground border border-border">
//       <CardHeader>
//         <CardTitle className="text-xl font-bold text-foreground">Transaction History</CardTitle>
//         <div className="flex gap-2">
//           <Button
//             variant={historyFilter === "all" ? "default" : "outline"}
//             onClick={() => setHistoryFilter("all")}
//             className="bg-vibrant-purple hover:bg-vibrant-pink text-white rounded-full"
//           >
//             All
//           </Button>
//           <Button
//             variant={historyFilter === "week" ? "default" : "outline"}
//             onClick={() => setHistoryFilter("week")}
//             className="bg-vibrant-purple hover:bg-vibrant-pink text-white rounded-full"
//           >
//             This Week
//           </Button>
//           <Button
//             variant={historyFilter === "month" ? "default" : "outline"}
//             onClick={() => setHistoryFilter("month")}
//             className="bg-vibrant-purple hover:bg-vibrant-pink text-white rounded-full"
//           >
//             This Month
//           </Button>
//         </div>
//       </CardHeader>
//       <CardContent>
//         {filteredExpenses.length === 0 ? (
//           <p className="text-muted-foreground">No expenses in this period.</p>
//         ) : (
//           <div className="space-y-2">
//             {filteredExpenses.map((exp) => (
//               <div key={exp.id} className="flex justify-between items-center border-b border-border py-2">
//                 <div>
//                   <span className="text-foreground">{categories.find((cat) => cat.name === exp.category)?.emoji || "💸"} {exp.category}</span>
//                   <p className="text-sm text-muted-foreground">{exp.note || "No note"} - {exp.date}</p>
//                 </div>
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