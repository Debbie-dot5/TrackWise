import type React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface OnboardingLayoutProps {
  title: string
  description: string
  children: React.ReactNode
  step: number
  totalSteps: number
}

export function OnboardingLayout({ title, description, children, step, totalSteps }: OnboardingLayoutProps) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-dark-purple-bg to-deep-purple-bg p-4">
      <Card className="w-full max-w-md mx-auto shadow-lg rounded-xl bg-card">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-foreground">{title}</CardTitle>
          <CardDescription className="text-muted-foreground">{description}</CardDescription>
          <div className="text-sm text-muted-foreground mt-2">
            Step {step} of {totalSteps}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">{children}</CardContent>
      </Card>
    </div>
  )
}
