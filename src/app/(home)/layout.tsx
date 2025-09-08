"use client"

import { ReactNode, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Menu, X, LogOut, Coins, HouseIcon, BookOpen, Bell, Settings, Lightbulb, Flag} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useAuthStore } from "@/stores/auth-store"
import { usePathname } from "next/navigation"
import { ToastContainer, toast } from 'react-toastify';



export default function HomeLayout({ children }: { children: ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const router = useRouter()
  const path = usePathname()

  const navItems = [
    { href: "/dashboard", label: "Dashboard", emoji: <HouseIcon/> },
    { href: "/budget", label: "Budget & Expenses", emoji: <Coins/> },
    { href: "/history", label: "Transaction History", emoji: <BookOpen/> },
    { href: "/alerts", label: "Alerts & Reminders", emoji: <Bell/>  },
    { href: "/settings", label: "Settings", emoji: <Settings/> },
    { href: "/moneytips", label: "Money Tips", emoji: <Lightbulb/>  },
    { href: "/goals", label: "Goal Tracker", emoji: <Flag/>  },
  ]

  const notify = () => toast("Failed to log out. Please try again.");
  
  const {signOut} = useAuthStore()

  const handleLogout = async () => {
    try {
        const {error} = await signOut()
       if (error) {
        console.log(error.message)
       }

         router.push("/auth/signin")
        
    } catch (error) {
         console.error("Logout error:", error)
        notify()
    }
} 
  
//   const handleLogout = async () => {
//     try {
//       const { error } = await signOut()
//       if (error) throw error
//       router.push("/login")
//     } catch (error) {
//       console.error("Logout error:", error)
//       alert("Failed to log out. Please try again.")
//     }
//   }

 return (
   <>
     <ToastContainer />
     <div className="min-h-screen bg-gradient-to-br from-dark-purple-bg to-deep-purple-bg flex">
       {/* Desktop Sidebar */}
       <aside className="hidden md:block w-64 bg-card border-r border-border p-4 relative">
         <Card className="bg-card border-none shadow-none h-full">
           <Link
             href="/"
             className="text-2xl text-center mb-6 font-bold text-vibrant-purple hover:text-vibrant-pink transition-colors"
           >
             TrackWise
           </Link>
           <div className="flex flex-col gap-2 ">
             {navItems.map((item) => {
               const isActive = path === item.href;

               return (
                 <Link key={item.href} href={item.href}>
                   <Button
                     variant="ghost"
                     className={`w-full mb-2 justify-start text-foreground ${
                       isActive
                         ? "bg-primary text-primary-foreground"
                         : "text-foreground hover:bg-primary/10"
                     }  rounded-lg transition-all duration-200`}
                   >
                     {item.emoji} {item.label}
                   </Button>
                 </Link>
               );
             })}
             <Button
               variant="ghost"
               className="w-full absolute bottom-40 left-4  justify-start text-destructive hover:bg-destructive/20 rounded-lg transition-all duration-200"
               onClick={handleLogout}
             >
               <LogOut className="h-5 w-5 mr-2" /> Log Out
             </Button>
           </div>
         </Card>
       </aside>

       {/* Mobile Drawer */}
       <div className="md:hidden">
         <Button
           variant="ghost"
           className="fixed top-4 left-4 z-50 text-foreground bg-card/80 rounded-full"
           onClick={() => setIsSidebarOpen(true)}
         >
           <Menu className="h-6 w-6" />
         </Button>
         
         {isSidebarOpen && (
           <div className="fixed inset-0 bg-black/50 z-40 flex">
             <Card className="w-64 bg-card border-r border-border p-4">
               <div className="flex justify-between items-center mb-4">
                 <Link
                   href="/"
                   className="text-2xl text-center mb-6 font-bold text-vibrant-purple hover:text-vibrant-pink transition-colors"
                 >
                   TrackWise
                 </Link>{" "}
                 <Button
                   variant="ghost"
                   className="text-foreground hover:bg-primary/10 rounded-full"
                   onClick={() => setIsSidebarOpen(false)}
                 >
                   <X className="h-6 w-6" />
                 </Button>
               </div>
               <div className="flex flex-col gap-2">
                 {navItems.map((item) => (
                   <Link
                     key={item.href}
                     href={item.href}
                     onClick={() => setIsSidebarOpen(false)}
                   >
                     <Button
                       variant="ghost"
                       className="w-full justify-start text-foreground hover:bg-primary/10 rounded-lg transition-all duration-200"
                     >
                       {item.emoji} {item.label}
                     </Button>
                   </Link>
                 ))}
                 <Button
                   variant="ghost"
                   className="w-full justify-start text-destructive hover:bg-destructive/10 rounded-lg transition-all duration-200"
                   onClick={handleLogout}
                 >
                   <LogOut className="h-5 w-5 mr-2" /> Log Out
                 </Button>
               </div>
             </Card>
             <div className="flex-1" onClick={() => setIsSidebarOpen(false)} />
           </div>
         )}
       </div>

       {/* Main Content */}

       <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
     </div>
   </>
 );
}