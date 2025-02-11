interface PricingCardProps {
  tier: string;
  price: number;
  features: string[];
  highlighted?: boolean;
}

export function PricingCard({ tier, price, features, highlighted = false }: PricingCardProps) {
  return (
    <div className={`rounded-lg shadow-xl overflow-hidden transform transition-all duration-300 ${
      highlighted ? 'scale-105 ring-2 ring-blue-500 bg-gray-800' : 'bg-gray-800 hover:scale-102'
    }`}>
      <div className="px-6 py-8">
        <h3 className="text-2xl font-semibold text-white">{tier}</h3>
        <p className="mt-4">
          <span className="text-5xl font-extrabold text-white">${price}</span>
          <span className="text-xl text-gray-300">/month</span>
        </p>
        <ul className="mt-8 space-y-4">
          {features.map((feature, index) => (
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
        <button className={`w-full rounded-md py-3 px-4 text-white font-semibold transition duration-300 ${
          highlighted
            ? 'bg-blue-500 hover:bg-blue-600'
            : 'bg-gray-600 hover:bg-gray-500'
        }`}>
          Get Started
        </button>
      </div>
    </div>
  );
}

