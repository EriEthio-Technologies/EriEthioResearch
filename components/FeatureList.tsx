import type React from "react"

export const FeatureList: React.FC = () => {
  const features = [
    "Advanced AI-powered threat detection",
    "Real-time security monitoring",
    "Automated incident response",
    "Machine learning-based anomaly detection",
    "Secure API integration",
  ]

  return (
    <ul className="font-mono space-y-4">
      {features.map((feature, index) => (
        <li key={index} className="flex items-center">
          <span className="text-cyan-400 mr-2">$</span>
          {feature}
        </li>
      ))}
    </ul>
  )
}

