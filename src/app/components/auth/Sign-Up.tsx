"use client"

import { useState } from "react"
import Link from "next/link"
import { Eye, EyeOff, Chrome } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { signUpSchema, SignUpFormData } from "@/lib/schema"
import { supabase } from "@/lib/supabase"
import { useAuthStore } from "@/stores/auth-store"
import { ToastContainer, toast } from 'react-toastify';



import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const {signUp} = useAuthStore()

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  })

  const notify = () => toast("Check your email for verification!");


  const onSubmit  = async (data: SignUpFormData) => {
    const result = await signUp(data.email, data.password)
    if (result.success) {
      notify()
      console.log("check email")
      // Redirect to onboarding or dashboard
      // if user exist, prompt them to signin else check email
    } else {
      setError("root", {
        message: result.error || "Sign up failed",
      })
    }
  }

  // const onSubmit: SubmitHandler<SignUpFormData> = async (data) => {

  //   const result = await signUp(data.email, data.password)
  //   if (result.success){
  //     console.log("Signup successful, redirecting to onboarding...")
  //   }else {
  //     setError("root", {
  //       message: result.error || "Sign up failed",
  //     })
  //   }
    // try {
    //   const { error } = await supabase.auth.signUp({
    //     email: data.email,
    //     password: data.password,
    //     options: {
    //       emailRedirectTo: `${location.origin}/auth/callback`,
    //     },
    //   })

    //   if (error) throw new Error(error.message)

    //   console.log("Signup successful:", data.email)
    // } catch (error: any) {
    //   setError("root", {
    //     message: error.message || "Signup failed",
    //   })
    // }
  


 
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-dark-purple-bg to-deep-purple-bg p-4">
      <ToastContainer/>
      <Card className="w-full max-w-md mx-auto shadow-lg rounded-xl bg-card">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-foreground">Join the Money Crew! 🎉</CardTitle>
          <CardDescription className="text-muted-foreground">
            Let&#39;s get you set up to track your expenses like a pro.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
           

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input {...register("email")} id="email" type="email" placeholder="your.email@example.com" />
              {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  {...register("password")}
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Make it strong! 💪"
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Input
                  {...register("confirmPassword")}
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="One more time! ✨"
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 text-lg bg-vibrant-purple hover:bg-vibrant-pink text-white rounded-full"
            >
              {isSubmitting ? "Creating account..." : "Create Account"}
            </Button>

            {/* Error */}
            {errors.root && <p className="text-sm text-red-500 text-center">{errors.root.message}</p>}

            {/* Divider */}
            <div className="relative flex items-center justify-center my-4">
              <span className="absolute inset-x-0 h-px bg-border" />
              <span className="relative bg-card px-4 text-sm text-muted-foreground">Or continue with</span>
            </div>

            {/* Google Auth */}
            <Button
              type="button"
              variant="outline"
              onClick={async () => {
                const { error } = await supabase.auth.signInWithOAuth({
                  provider: "google",
                  options: {
                    redirectTo: `${location.origin}/auth/callback`,
                  },
                })
                if (error) console.error("Google sign-in error", error.message)
              }}
              className="w-full py-3 text-lg border-2 flex items-center justify-center gap-2"
            >
              <Chrome className="h-5 w-5" />
              Continue with Google
            </Button>

            <div className="mt-4 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/auth/signin" className="underline text-primary hover:text-vibrant-pink font-medium">
                Sign In
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
