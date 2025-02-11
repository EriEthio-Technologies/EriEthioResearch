"use client"

import { useState } from "react"

export function Filters() {
  return (
    <div className="flex gap-4 flex-wrap">
      <select className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2">
        <option value="">All Years</option>
        <option value="2024">2024</option>
        <option value="2023">2023</option>
        <option value="2022">2022</option>
      </select>
      <select className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2">
        <option value="">All Topics</option>
        <option value="ai-ethics">AI Ethics</option>
        <option value="machine-learning">Machine Learning</option>
        <option value="nlp">Natural Language Processing</option>
      </select>
    </div>
  )
}

