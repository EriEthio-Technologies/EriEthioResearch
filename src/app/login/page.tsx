"use client"

import { useState } from "react"
import { NavigationBar } from "../../components/NavigationBar"
import { LoginForm } from "../../components/LoginForm"
import { RegistrationForm } from "../../components/RegistrationForm"

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true)

  return (
    <main className="min-h-screen flex flex-col bg-[#0A0A0A]">
      <div className="flex-grow p-8">
        <h1 className="text-4xl md:text-6xl font-bold text-center mb-12">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-magenta-400">
            {isLogin ? "Login" : "Register"}
          </span>
        </h1>

        {isLogin ? <LoginForm /> : <RegistrationForm />}

        <div className="text-center mt-4">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-cyan-400 hover:text-magenta-400 transition-colors"
          >
            {isLogin ? "Need an account? Register" : "Already have an account? Login"}
          </button>
        </div>
      </div>

      <NavigationBar />
    </main>
  )
}

