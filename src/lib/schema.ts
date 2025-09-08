
import { z } from 'zod';

// Sign-up schema
export const signUpSchema = z.object({
  
  email: z.string().email(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export type SignUpFormData = z.infer<typeof signUpSchema>;


// Sign-in schema
export const signInSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

export type SignInFormData = z.infer<typeof signInSchema>;


// forgot password schema
export const ForgotPasswordSchema = z.object({
  email: z.string().email(),
});

export type ForgotFields = z.infer<typeof ForgotPasswordSchema>;

// Reset password schema

export const ResetPaswordschema = z.object({

  password: z.string().min(6),
  confirmPassword: z.string().min(6),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],

});

export type resetFields = z.infer<typeof ResetPaswordschema>;


// profile setup schema

export const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
   school: z.string().min(2, "School must be at least 2 characters"),
  age: z
    .string()
    .min(1, "Age is required")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Age must be a valid number greater than 0",
    }),
});

export type ProfileForm = z.infer<typeof profileSchema>;













// add expense schema 
export const addExpenseSchema = z.object({
  amount: z
    .number()
    .min(0.01, "Amount must be at least 0.01")
    .max(99999999.99, "Amount cannot exceed 99,999,999.99")
    .refine((val) => Number(val.toFixed(2)) === val, "Amount must have at most 2 decimal places"),
  category: z.string().min(1, "Category is required"),
  note: z.string().optional(),
  date: z.date().refine((date) => date <= new Date(), "Date cannot be in the future"),
})

export type AddExpenseFormData = z.infer<typeof addExpenseSchema>

// Schema for editing an existing expense
export const editExpenseSchema = z.object({
  id: z.string().min(1, "Expense ID is required"),
  amount: z
    .number()
    .min(0.01, "Amount must be at least 0.01")
    .max(99999999.99, "Amount cannot exceed 99,999,999.99")
    .refine((val) => Number(val.toFixed(2)) === val, "Amount must have at most 2 decimal places"),
  category: z.string().min(1, "Category is required"),
  note: z.string().optional(),
  date: z.date().refine((date) => date <= new Date(), "Date cannot be in the future"),
})

export type EditExpenseFormData = z.infer<typeof editExpenseSchema>

// Schema for adding a new category
export const addCategorySchema = z.object({
  name: z
    .string()
    .min(1, "Category name is required")
    .max(50, "Category name cannot exceed 50 characters")
    .regex(/^[a-zA-Z0-9\s-]+$/, "Category name can only contain letters, numbers, spaces, or hyphens"),
  emoji: z
    .string()
    .min(1, "Emoji is required")
    .max(10, "Emoji cannot exceed 10 characters")
    .regex(/^\p{Emoji}+$/u, "Must be a valid emoji"),
})

export type AddCategoryFormData = z.infer<typeof addCategorySchema>




 // Schema for Budget Form (Dynamic based on monthlyIncome and categories)

// export const createBudgetSchema = (monthlyIncome: number, categories: string[]) =>
//   z.object({
//     budgets: z.record(
//       z.enum(categories as [string, ...string[]]),
//       z.number().nonnegative("Budget must be non-negative")
//     ).refine(
//       (data) => {
//         const totalBudget = Object.values(data).reduce((sum, val) => sum + val, 0)
//         return totalBudget <= monthlyIncome
//       },
//       {
//         message: `Total budget cannot exceed monthly income (₦${monthlyIncome.toLocaleString()})`,
//         path: ["budgets"],
//       }
//     ),
//   })

// export type BudgetFormData = z.infer<ReturnType<typeof createBudgetSchema>>