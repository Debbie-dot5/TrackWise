"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Header } from "@/app/components/Header"
import {TrendingDown, Zap, CheckCircle, Lightbulb, Smile, Rocket } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center  bg-gradient-to-br from-dark-purple-bg to-deep-purple-bg text-foreground pt-16">
    <Header />  
      {/* Hero Section */}
      <main className="flex flex-col items-center justify-center flex-1 w-full max-w-4xl px-4 py-12 sm:py-16 lg:py-24 text-center">
        <div className="relative w-64 h-64 mb-8 sm:w-80 sm:h-80">
          <Image
            src="/illustrations/landing.svg"
            alt="Person using phone"
            layout="fill"
            objectFit="contain"
            className="drop-shadow-xl animate-float"
          />
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-light-text leading-tight mb-6 ">
          Your Money, Your Rules! 
        </h1>
        <p className="text-lg sm:text-xl text-muted-text mb-10 max-w-2xl">
          Tired of money disappearing like jollof rice at a party? Track your expenses, set smart budgets, and make your
          naira work for you. No stress, just success! 
        </p>
        <Link href="/auth/signup" passHref>
          <Button className="py-4 px-8 text-xl bg-vibrant-purple hover:bg-vibrant-pink text-primary-foreground rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl">
            Get Started 
            <Rocket/>
          </Button>
        </Link>
      </main>
      {/* Problem/Solution Section */}
      <section className="w-full  px-4 py-12 sm:py-16 lg:py-20 bg-card rounded-t-3xl shadow-lg border border-border">
        <h2 className="text-3xl sm:text-4xl font-bold text-foreground text-center mb-20">
          Feeling the Money Squeeze? We Get It! 😩
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-4xl mx-auto">
          <div className="flex flex-col items-center text-center p-4 ">
            <Image 
            width={86}
            height={86}
            src="/illustrations/naira.svg"
            alt="naira"
             /> 
            {/* <DollarSign className="h-16 w-16 text-vibrant-pink mb-4" /> */}
            <h3 className="text-xl font-semibold text-foreground mb-2">Rising Costs Got You Down?</h3>
            <p className="text-muted-foreground">
              Everything&#39;s getting pricier, and your allowance just isn&#39;t stretching like it used to. It&#39;s tough out
              there!
            </p>
          </div>
          <div className="flex flex-col items-center text-center p-4">
            <TrendingDown className="h-16 w-16 text-vibrant-orange mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">Impulsive Spending Habits?</h3>
            <p className="text-muted-foreground">
              That spontaneous shawarma or new outfit seemed like a good idea at the time... until your wallet cried.
            </p>
          </div>
          <div className="flex flex-col items-center text-center p-4">
            <Zap className="h-16 w-16 text-vibrant-blue mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">Unpredictable Income Flow?</h3>
            <p className="text-muted-foreground">
              Allowance, freelance gigs, part-time hustle – your money comes in waves. How do you plan for that?
            </p>
          </div>
          <div className="flex flex-col items-center text-center p-4">
            <CheckCircle className="h-16 w-16 text-vibrant-purple mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">Trackwise is Your Solution!</h3>
            <p className="text-muted-foreground">
              We help you navigate these challenges with smart tools, friendly nudges, and zero judgment. Take control!
            </p>
          </div>
        </div>
      </section>
      {/* Enhanced Features Showcase */}
      <section className="w-full px-4 mt-20 py-12 sm:py-16 lg:py-20 bg-gradient-to-r from-deep-purple-bg to-dark-purple-bg">
        <h2 className="text-3xl sm:text-4xl font-bold text-foreground text-center mb-20">
          Why Trackwise is Your New Bestie ?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="p-6 text-center shadow-md rounded-xl bg-card border border-secondary transform hover:scale-105 transition-transform duration-200">
            <CardContent className="flex flex-col items-center justify-center p-0">
              <span className="text-5xl mb-4">📊</span>
              <h3 className="text-xl font-semibold text-foreground mb-2">Track Everything</h3>
              <p className="text-muted-foreground">
                From shawarma to subscriptions, know exactly where your money goes. No more &quot;where did my money go?&quot;
                moments!
              </p>
            </CardContent>
          </Card>
          <Card className="p-6 text-center shadow-md rounded-xl bg-card border border-secondary transform hover:scale-105 transition-transform duration-200">
            <CardContent className="flex flex-col items-center justify-center p-0">
              <span className="text-5xl mb-4">🎯</span>
              <h3 className="text-xl font-semibold text-foreground mb-2">Smart Budgets</h3>
              <p className="text-muted-foreground">
                Set realistic goals for food, transport, and fun. We&#39;ll nudge you gently if you&#39;re vibing too hard. 😉
              </p>
            </CardContent>
          </Card>
          <Card className="p-6 text-center shadow-md rounded-xl bg-card border border-secondary transform hover:scale-105 transition-transform duration-200">
            <CardContent className="flex flex-col items-center justify-center p-0">
              <span className="text-5xl mb-4">✨</span>
              <h3 className="text-xl font-semibold text-foreground mb-2">Friendly Vibes</h3>
              <p className="text-muted-foreground">
                No boring spreadsheets! Our app is designed to be fun, supportive, and totally Gen Z-approved.
              </p>
            </CardContent>
          </Card>
          <Card className="p-6 text-center shadow-md rounded-xl bg-card border border-secondary transform hover:scale-105 transition-transform duration-200">
            <CardContent className="flex flex-col items-center justify-center p-0">
              <Lightbulb className="h-16 w-16 text-[hsl(var(--chart-4))] mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">Smart Alerts & Tips</h3>
              <p className="text-muted-foreground">
                Get timely alerts when you&#39;re nearing your budget limits and cool tips to save more.
              </p>
            </CardContent>
          </Card>
          <Card className="p-6 text-center shadow-md rounded-xl bg-card border border-secondary transform hover:scale-105 transition-transform duration-200">
            <CardContent className="flex flex-col items-center justify-center p-0">
              <Smile className="h-16 w-16 text-[hsl(var(--chart-5))] mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">Empowering & Non-Judgmental</h3>
              <p className="text-muted-foreground">
                We&#39;re here to support your financial journey, not judge it. Learn, grow, and thrive!
              </p>
            </CardContent>
          </Card>
          <Card className="p-6 text-center shadow-md rounded-xl bg-card border border-secondary transform hover:scale-105 transition-transform duration-200">
            <CardContent className="flex flex-col items-center justify-center p-0">
              <Image
                src="/illustrations/iphone.svg"
                alt="Mobile friendly icon"
                width={64}
                height={64}
                className="mb-4"
              />
              <h3 className="text-xl font-semibold text-foreground mb-2">Mobile-First & PWA Ready</h3>
              <p className="text-muted-foreground">
                Access Trackwise seamlessly on your phone, just like a native app. Track on the go!
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
      {/* Final Call to Action Section */}
      <section className="w-full px-4 py-12 sm:py-16 lg:py-20 text-center bg-card rounded-b-3xl shadow-lg border border-border">
        <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">Ready to Be a Money Boss? 👑</h2>
        <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Join thousands of Nigerian students taking charge of their finances. It&#39;s time to make your money moves count!
        </p>
        <Link href="/auth/signup" passHref>
          <Button className="py-4 px-8 text-xl bg-vibrant-purple hover:bg-vibrant-pink text-primary-foreground rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl">
            Sign Up Now! It&#39;s Quick! ⚡
          </Button>
        </Link>
      </section>
      {/* Footer */}
      <footer className="w-full py-6 text-center text-muted-foreground text-sm bg-card border-t border-border">
        <p>&copy; {new Date().getFullYear()} MoneyBoss. All rights reserved. Made with ❤️ for Nigerian Students.</p>
      </footer>
      {/* Add a simple animation for the mascot/illustration */}
      <style jsx global>{`
        @keyframes float {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
          100% {
            transform: translateY(0px);
          }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
