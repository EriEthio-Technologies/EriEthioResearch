import type React from "react"

interface BillingToggleProps {
  isAnnual: boolean
  setIsAnnual: (value: boolean) => void
}

export const BillingToggle: React.FC<BillingToggleProps> = ({ isAnnual, setIsAnnual }) => {
  return (
    <div className="flex justify-center items-center space-x-4">
      <span className={`text-lg ${!isAnnual ? "text-cyan-400" : "text-gray-400"}`}>Monthly</span>
      <button
        className="w-16 h-8 bg-gray-700 rounded-full p-1 duration-300 ease-in-out"
        onClick={() => setIsAnnual(!isAnnual)}
      >
        <div
          className={`bg-cyan-400 w-6 h-6 rounded-full shadow-md transform duration-300 ease-in-out ${
            isAnnual ? "translate-x-8" : ""
          }`}
        ></div>
      </button>
      <span className={`text-lg ${isAnnual ? "text-cyan-400" : "text-gray-400"}`}>Annual</span>
    </div>
  )
}

