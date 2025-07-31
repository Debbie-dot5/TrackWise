"use client"

import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { signUpSchema, SignUpFormData } from "@/lib/schema";
import { supabase } from "@/utils/supabaseClient";
//import { useRouter } from "next/navigation";
import Image from "next/image";


export default function SignUp() {
    


    const {
        register, 
        handleSubmit, 
        setError,
        formState: {errors, isSubmitting},
    } = useForm<SignUpFormData>({
       
        resolver: zodResolver(signUpSchema),
    });

    const onSubmit: SubmitHandler<SignUpFormData> = async (data: SignUpFormData) => {

        try {
            const { error } = await supabase.auth.signUp({
                email: data.email,
                password: data.password,
                options: {
                    emailRedirectTo: "http://localhost:3000/auth/callback"
                }
            });
            console.log(data);

            if (error) {
                throw new Error(error.message);
            }

            console.log('Signup successful:', data.email);
            console.log("Check your email for a confirmation link");

            // Redirect to profile page after successful signup
            // router.push("/setup-profile");

            
        } catch (error: any) {
            setError("root", {
             message: error.message || "Signup failed",
            })
            // console.error('Signup failed:', error.response?.data || error.message)
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <p className="text-gray-500">Create an account to get started</p>
            <input {...register("email")} type="email" placeholder='Email'/>
            {errors.email && <span className="text-red-500">{errors.email.message}</span>}
            <input {...register("password")} type="password" placeholder='Password'/>
            {errors.password && <span className="text-red-500">{errors.password.message}</span>}
            <input {...register("confirmPassword")} type="password" placeholder='Confirm Password'/>
            {errors.confirmPassword && <span className="text-red-500">{errors.confirmPassword.message}</span>}
            <button disabled={isSubmitting} type='submit'>
                {isSubmitting ? "Signing up......" : "Sign Up" }
            </button>
           
            {errors.root && <span className="text-red-500">{errors.root.message}</span>}



            <button
            type="button"
            onClick={async () => {
                const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${location.origin}/auth/callback`,
                },
                });

                if (error) console.error("Google sign-in error", error.message);
            }}
            className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-2 rounded mt-4"
            >
            <Image src="/google-icon.svg" alt="Google" width={20} height={20} className="w-5 h-5" />
            Continue with Google
         </button>

        </form>
        
    )
}