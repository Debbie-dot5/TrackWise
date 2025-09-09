"use client";

import { ReactNode, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, LogOut, Coins, HouseIcon, BookOpen, Bell, Settings, Lightbulb, Flag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuthStore } from "@/stores/auth-store";
import { toast } from "react-toastify";

interface NavItem {
  href: string;
  label: string;
  emoji: ReactNode;
}

interface SidebarProps {
  logoText?: string;
}

export default function Sidebar({ logoText = "TrackWise" }: SidebarProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();
  const path = usePathname();
  const { signOut } = useAuthStore();

  const navItems: NavItem[] = [
    { href: "/dashboard", label: "Dashboard", emoji: <HouseIcon /> },
    { href: "/budget", label: "Budget & Expenses", emoji: <Coins /> },
    { href: "/history", label: "Transaction History", emoji: <BookOpen /> },
    { href: "/alerts", label: "Alerts & Reminders", emoji: <Bell /> },
    { href: "/settings", label: "Settings", emoji: <Settings /> },
    { href: "/moneytips", label: "Money Tips", emoji: <Lightbulb /> },
    { href: "/goals", label: "Goal Tracker", emoji: <Flag /> },
  ];

  const handleLogout = async () => {
    try {
      const { error } = await signOut();
      if (error) {
        console.log(error.message);
        toast.error("Failed to log out. Please try again.");
        return;
      }
      router.push("/auth/signin");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to log out. Please try again.");
    }
  };

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 w-full bg-card border-b border-border z-50 p-4 flex justify-between items-center">
        <Link
          href="/"
          className="text-xl font-bold text-vibrant-purple hover:text-vibrant-pink transition-colors"
        >
          {logoText}
        </Link>
        {!isSidebarOpen && (
          <Button
            variant="ghost"
            className="text-foreground bg-card/80 rounded-full p-2"
            onClick={() => setIsSidebarOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6" />
          </Button>
        )}
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 bg-card border-r-2 border-border shadow-lg p-4 h-screen fixed top-0 left-0 ">
        <Card className="bg-card border-none shadow-none h-full">
          <Link
            href="/"
            className="text-2xl text-center mb-6 font-bold text-vibrant-purple hover:text-vibrant-pink transition-colors"
          >
            {logoText}
          </Link>
          <div className="flex flex-col gap-2">
            {navItems.map((item) => {
              const isActive = path === item.href;
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant="ghost"
                    className={`w-full mb-2 justify-start text-foreground ${
                      isActive ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-primary/10"
                    } rounded-lg transition-all duration-200`}
                  >
                    {item.emoji} <span className="ml-2">{item.label}</span>
                  </Button>
                </Link>
              );
            })}
            <Button
              variant="ghost"
              className="w-full justify-start text-destructive hover:bg-destructive/20 rounded-lg transition-all duration-200"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5 mr-2" /> Log Out
            </Button>
          </div>
        </Card>
      </aside>

      {/* Mobile Sidebar (Drawer) */}
      {isSidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-40 flex"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
          onKeyDown={(e) => {
            if (e.key === "Escape") setIsSidebarOpen(false);
          }}
        >
          <Card
            className="sidebar-card w-64 bg-card border-r-2 border-border shadow-lg p-4 h-full fixed top-0 left-0 transform transition-transform duration-200 will-change-transform"
            style={{ transform: isSidebarOpen ? "translateX(0)" : "translateX(-100%)" }}
          >
            <div className="flex justify-between items-center mb-4">
              <Link
                href="/"
                className="text-2xl font-bold text-vibrant-purple hover:text-vibrant-pink transition-colors"
              >
                {logoText}
              </Link>
              <Button
                variant="ghost"
                className="text-foreground hover:bg-primary/10 rounded-full p-2 z-10"
                onClick={() => setIsSidebarOpen(false)}
                aria-label="Close menu"
              >
                <X className="h-6 w-6 text-foreground" />
              </Button>
            </div>
            <div className="flex flex-col gap-2">
              {navItems.map((item) => {
                const isActive = path === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    <Button
                      variant="ghost"
                      className={`w-full justify-start ${isActive ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-primary/10"} rounded-lg transition-all duration-200`}
                      aria-current={isActive ? "page" : undefined}
                    >
                      {item.emoji} <span className="ml-2">{item.label}</span>
                    </Button>
                  </Link>
                );
              })}
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
    </>
  );
}