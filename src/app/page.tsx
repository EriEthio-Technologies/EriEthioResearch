"use client"

import { PricingCard } from "@/components/ui/PricingCard"

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 p-4">
      <h1 className="text-4xl font-bold text-white mb-8">Welcome to EriEthio Research</h1>
      <div className="grid gap-8 md:grid-cols-3">
        <PricingCard
          tier="Basic"
          price={99}
          features={[
            "Access to basic research tools",
            "Limited data analysis",
            "Standard support"
          ]}
        />
        <PricingCard
          tier="Pro"
          price={199}
          features={[
            "Advanced research tools",
            "Full data analysis",
            "Priority support",
            "Custom reports"
          ]}
          highlighted
        />
        <PricingCard
          tier="Enterprise"
          price={499}
          features={[
            "All Pro features",
            "Dedicated support",
            "Custom solutions",
            "API access",
            "Team collaboration"
          ]}
        />
      </div>
    </div>
  )
}