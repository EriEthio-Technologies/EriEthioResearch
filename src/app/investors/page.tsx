"use client"

import { useState } from "react"
import { LoginForm } from "@/components/LoginForm"
import { InvestorDashboard } from "@/components/InvestorDashboard"
import { NavBar } from "@/components/navigation/NavBar"

export default function InvestorsPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center mb-12">
          Investor Portal
        </h1>

        {isLoggedIn ? <InvestorDashboard /> : <LoginForm onLogin={() => setIsLoggedIn(true)} />}
      </div>

      <NavBar />
    </div>
  )
}

