import type React from "react"

interface PricingCardProps {
  name: string
  price: number | string
  features: string[]
  isAnnual: boolean
}

export const PricingCard: React.FC<PricingCardProps> = ({ name, price, features, isAnnual }) => {
  return (
    <div className="bg-gray-800 p-8 rounded-lg shadow-lg border-2 border-cyan-400">
      <h2 className="text-2xl font-bold mb-4">{name}</h2>
      <p className="text-4xl font-bold mb-6">
        {typeof price === "number" ? `$${price}` : price}
        {typeof price === "number" && <span className="text-xl">{isAnnual ? "/year" : "/month"}</span>}
      </p>
      <ul className="space-y-2 mb-8">
        {features.map((feature, index) => (
          <li key={index} className="font-mono text-sm">
            {feature}
          </li>
        ))}
      </ul>
      <button className="w-full py-2 px-4 bg-gradient-to-r from-cyan-400 to-magenta-400 text-black font-bold rounded hover:from-cyan-500 hover:to-magenta-500 transition-colors">
        Get Started
      </button>
    </div>
  )
}

