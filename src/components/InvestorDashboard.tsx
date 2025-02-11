import type React from "react"

export const InvestorDashboard: React.FC = () => {
  const financialMetrics = [
    { label: "Revenue", value: "$10M" },
    { label: "Growth", value: "25%" },
    { label: "Customers", value: "500+" },
  ]

  const teamMembers = [
    { name: "John Doe", role: "CEO" },
    { name: "Jane Smith", role: "CTO" },
    { name: "Alice Johnson", role: "CFO" },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Financial Metrics</h2>
        <ul>
          {financialMetrics.map((metric, index) => (
            <li key={index} className="mb-2">
              <span className="font-bold">{metric.label}:</span> {metric.value}
            </li>
          ))}
        </ul>
      </div>
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Team</h2>
        <ul>
          {teamMembers.map((member, index) => (
            <li key={index} className="mb-2">
              <span className="font-bold">{member.name}</span> - {member.role}
            </li>
          ))}
        </ul>
      </div>
      <div className="col-span-1 md:col-span-2">
        <h2 className="text-2xl font-bold mb-4">Reports</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a href="#" className="block p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors">
            Q2 2023 Financial Report
          </a>
          <a href="#" className="block p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors">
            2023 Investor Pitch Deck
          </a>
        </div>
      </div>
    </div>
  )
}

