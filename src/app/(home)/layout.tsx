"use client"

import { ReactNode } from "react"

import Sidebar from "../components/Sidebar";




export default function HomeLayout({ children }: { children: ReactNode }) {
  
  


 return (
  <div className="min-h-screen bg-gradient-to-br from-dark-purple-bg to-deep-purple-bg flex">
  <Sidebar logoText="TrackWise" />
  <main className="flex-1 p-4 sm:p-6 lg:p-8 md:ml-64 mt-16 md:mt-0">
    {children}
  </main>
</div>
 );
}