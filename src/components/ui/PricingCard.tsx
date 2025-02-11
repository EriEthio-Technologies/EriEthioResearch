interface PricingTier {
  name: string
  price: string
  features: string[]
  cta: string
}

interface PricingCardProps {
  tier: PricingTier
}

export function PricingCard({ tier }: PricingCardProps) {
  return (
    <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      <div className="px-6 py-8">
        <h3 className="text-2xl font-semibold text-white">{tier.name}</h3>
        <p className="mt-4 text-5xl font-extrabold text-white">{tier.price}</p>
        <p className="mt-1 text-xl text-gray-300">per month</p>
        <ul className="mt-6 space-y-4">
          {tier.features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <svg
                className="flex-shrink-0 h-6 w-6 text-green-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="ml-3 text-base text-gray-300">{feature}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="px-6 py-8 bg-gray-700">
        <button className="w-full bg-blue-500 text-white rounded-md py-2 px-4 hover:bg-blue-600 transition duration-300">
          {tier.cta}
        </button>
      </div>
    </div>
  )
}

