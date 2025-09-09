"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useRouter } from "next/navigation"
import { 
  Coins, 
  HouseIcon, 
  BookOpen, 
  Bell, 
  Settings, 
  Lightbulb, 
  Flag,
  LogOut 
} from "lucide-react"
import { useAuthStore } from "@/stores/auth-store"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: HouseIcon },
  { href: "/budget", label: "Budget & Expenses", icon: Coins },
  { href: "/history", label: "Transaction History", icon: BookOpen },
  { href: "/alerts", label: "Alerts & Reminders", icon: Bell },
  { href: "/settings", label: "Settings", icon: Settings },
  { href: "/moneytips", label: "Money Tips", icon: Lightbulb },
  { href: "/goals", label: "Goal Tracker", icon: Flag },
]

export function AppSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { signOut } = useAuthStore()

  const handleLogout = async () => {
    try {
      const { error } = await signOut()
      if (error) {
        console.log(error.message)
      }
      router.push("/auth/signin")
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  return (
    <Sidebar variant="sidebar" collapsible="offcanvas" className="bg-card border-r border-border">
      <SidebarHeader className="p-4">
        <Link
          href="/"
          className="text-2xl font-bold text-vibrant-purple hover:text-vibrant-pink transition-colors"
        >
          TrackWise
        </Link>
      </SidebarHeader>
      
      <SidebarContent className="p-2">
        <SidebarGroup>
          <SidebarGroupLabel className="text-muted-foreground">Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive = pathname === item.href
                const Icon = item.icon
                
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton 
                      asChild 
                      isActive={isActive}
                      className={`${
                        isActive 
                          ? "bg-primary text-primary-foreground" 
                          : "text-foreground hover:bg-primary/10"
                      } rounded-lg transition-all duration-200`}
                    >
                      <Link href={item.href}>
                        <Icon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              onClick={handleLogout} 
              className="text-destructive hover:bg-destructive/10 rounded-lg transition-all duration-200"
            >
              <LogOut className="h-4 w-4" />
              <span>Log Out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
