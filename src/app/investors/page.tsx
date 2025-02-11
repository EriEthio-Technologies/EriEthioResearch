"use client"

import { useState } from "react"
import { NavigationBar } from "../../components/NavigationBar"
import { LoginForm } from "../../components/LoginForm"
import { InvestorDashboard } from "../../components/InvestorDashboard"

export default function InvestorPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  return (
    <main className="min-h-screen flex flex-col bg-[#0A0A0A]">
      <div className="flex-grow p-8">
        <h1 className="text-4xl md:text-6xl font-bold text-center mb-12">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-magenta-400">
            Investor Relations
          </span>
        </h1>

        {isLoggedIn ? <InvestorDashboard /> : <LoginForm onLogin={() => setIsLoggedIn(true)} />}
      </div>

      <NavigationBar />
    </main>
  )
}

