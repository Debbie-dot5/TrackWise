// src/lib/types.ts

export type  Expense = {
  id: string
  user_id: string
  amount: number
  category: string
  note: string
  date: string
  created_at: string
}

export type  UserProfile = {
  id: string
  name: string
  email: string
  school: string
  age: number
  monthly_income: number
  created_at: string
}

export type  BudgetGoal = {
  id: string
  user_id: string
  category: string
  amount: number
  created_at: string
}

export type  Category ={
  id: string
  user_id: string
  name: string
  emoji: string
  created_at: string
}
