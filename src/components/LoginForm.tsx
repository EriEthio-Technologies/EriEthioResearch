"use client"

import type React from "react"
import { useState } from "react"
import { OAuthButtons } from "./OAuthButtons"

export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle login logic here
    console.log("Login:", { email, password })
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto">
      <div className="mb-4">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="user@domain.com"
          className="w-full px-3 py-2 bg-gray-800 border border-cyan-400 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          required
        />
      </div>
      <div className="mb-4">
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full px-3 py-2 bg-gray-800 border border-cyan-400 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          required
        />
      </div>
      <button
        type="submit"
        className="w-full py-2 px-4 bg-gradient-to-r from-cyan-400 to-magenta-400 text-white font-bold rounded-md hover:from-cyan-500 hover:to-magenta-500 transition-colors"
      >
        Login
      </button>
      <div className="mt-4 text-center">
        <a href="#" className="text-cyan-400 hover:text-magenta-400 transition-colors">
          FORGOT ACCESS CODE?
        </a>
      </div>
      <OAuthButtons />
    </form>
  )
}

