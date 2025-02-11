"use client"

import { useState } from "react"
import { NavigationBar } from "../../components/NavigationBar"
import { PricingCard } from "../../components/PricingCard"
import { BillingToggle } from "../../components/BillingToggle"

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(false)

  const pricingTiers = [
    {
      name: "Basic",
      price: isAnnual ? 99 : 9,
      features: ["$ ai_security --level=basic", "$ model_optimization --speed=1x", "$ automation_tasks --limit=100"],
    },
    {
      name: "Pro",
      price: isAnnual ? 199 : 19,
      features: [
        "$ ai_security --level=advanced",
        "$ model_optimization --speed=2x",
        "$ automation_tasks --limit=500",
        "$ priority_support --response_time=24h",
      ],
    },
    {
      name: "Enterprise",
      price: "Custom",
      features: [
        "$ ai_security --level=maximum",
        "$ model_optimization --speed=unlimited",
        "$ automation_tasks --limit=unlimited",
        "$ priority_support --response_time=1h",
        "$ custom_integration --enabled=true",
      ],
    },
  ]

  return (
    <main className="min-h-screen flex flex-col bg-[#0A0A0A]">
      <div className="flex-grow p-8">
        <h1 className="text-4xl md:text-6xl font-bold text-center mb-12">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-magenta-400">
            Pricing Plans
          </span>
        </h1>

        <BillingToggle isAnnual={isAnnual} setIsAnnual={setIsAnnual} />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {pricingTiers.map((tier, index) => (
            <PricingCard key={index} {...tier} isAnnual={isAnnual} />
          ))}
        </div>
      </div>

      <NavigationBar />
    </main>
  )
}

