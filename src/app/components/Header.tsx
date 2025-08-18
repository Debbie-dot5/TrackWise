import Link from "next/link"
import { Button } from "@/components/ui/button"
import { UserRound } from "lucide-react"

export  function Header() {
  return (
    <header className="w-full bg-card/80 backdrop-blur-md fixed top-0 z-50 shadow-sm">
      <div className="container mx-auto flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-2xl font-bold text-vibrant-purple hover:text-vibrant-pink transition-colors">
          TrackWise
        </Link>
        <nav className="flex items-center space-x-4">
          <Link href="/auth/signin" passHref>
            <Button variant="ghost" className="text-foreground hover:bg-secondary hover:text-primary">
              Sign In
            </Button>
          </Link>
          <Link href="/auth/signup" passHref>
            <Button className="bg-vibrant-purple hover:bg-vibrant-pink text-white rounded-full px-4 py-2 shadow-md">
              Sign Up
              <UserRound/>
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  )
}
