import { PricingCard } from "@/components/ui/PricingCard";

export default function SyntheticV0PageForDeployment() {
  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">Choose Your Plan</h2>
          <p className="text-xl text-gray-300">Select the perfect plan for your research needs</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <PricingCard
            tier="Basic"
            price={99}
            features={[
              "Basic research tools",
              "Limited data analysis",
              "Standard support",
              "Monthly reports",
              "Basic API access"
            ]}
          />
          <PricingCard
            tier="Pro"
            price={199}
            features={[
              "Advanced research tools",
              "Full data analysis",
              "Priority support",
              "Custom reports",
              "Extended API access",
              "Team collaboration"
            ]}
            highlighted={true}
          />
          <PricingCard
            tier="Enterprise"
            price={499}
            features={[
              "All Pro features",
              "Dedicated support",
              "Custom solutions",
              "Unlimited API access",
              "Advanced team management",
              "Custom integrations",
              "24/7 priority support"
            ]}
          />
        </div>
      </div>
    </div>
  );
} 