"use client"

import { useState, type ReactNode } from "react"

interface FlipCardProps {
  frontContent: ReactNode
  backContent: ReactNode
}

export function FlipCard({ frontContent, backContent }: FlipCardProps) {
  const [isFlipped, setIsFlipped] = useState(false)

  return (
    <div
      className="flip-card w-64 h-64 perspective-1000"
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
    >
      <div
        className={`relative w-full h-full transition-transform duration-500 transform-style-preserve-3d ${isFlipped ? "rotate-y-180" : ""}`}
      >
        <div className="absolute w-full h-full backface-hidden bg-gray-800 text-white p-4 rounded-lg">
          {frontContent}
        </div>
        <div className="absolute w-full h-full backface-hidden bg-gray-700 text-white p-4 rounded-lg rotate-y-180">
          {backContent}
        </div>
      </div>
    </div>
  )
}

