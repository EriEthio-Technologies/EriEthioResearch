import type React from "react"

export const NeonLogo: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <h1 className={`text-4xl md:text-6xl font-bold text-center py-8 ${className}`}>
      <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-magenta-400 animate-pulse">
        ERIETHIO RESEARCH
      </span>
    </h1>
  )
}

