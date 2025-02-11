"use client"

import type React from "react"
import { useState } from "react"

export const NewsletterSignup: React.FC = () => {
  const [email, setEmail] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle newsletter signup logic here
    console.log("Newsletter signup:", email)
    setEmail("")
  }

  return (
    <section className="py-12 px-4">
      <h2 className="text-3xl font-bold mb-6 text-center">Stay Updated</h2>
      <form onSubmit={handleSubmit} className="max-w-md mx-auto">
        <div className="flex">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="flex-grow px-4 py-2 rounded-l-lg bg-gray-800 border border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            required
          />
          <button
            type="submit"
            className="px-6 py-2 rounded-r-lg bg-gradient-to-r from-cyan-400 to-magenta-400 text-black font-semibold hover:from-cyan-500 hover:to-magenta-500 transition-colors"
          >
            Subscribe
          </button>
        </div>
      </form>
    </section>
  )
}

