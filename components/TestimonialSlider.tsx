"use client"

import type React from "react"
import { motion } from "framer-motion"

export const TestimonialSlider: React.FC = () => {
  const testimonials = [
    {
      name: "John Doe",
      role: "CTO, TechCorp",
      text: "EriEthio Research has revolutionized our AI security protocols.",
    },
    {
      name: "Jane Smith",
      role: "CEO, AI Innovations",
      text: "Their model optimization techniques have saved us millions.",
    },
    {
      name: "Alex Johnson",
      role: "Lead Developer, AutomateNow",
      text: "The automation solutions provided by EriEthio are unparalleled.",
    },
  ]

  return (
    <section className="py-12 overflow-hidden">
      <h2 className="text-3xl font-bold mb-6 text-center">Testimonials</h2>
      <motion.div
        className="flex space-x-6 px-4"
        animate={{ x: [0, -100] }}
        transition={{
          x: { duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" },
          opacity: { duration: 0.2 },
        }}
      >
        {testimonials.map((testimonial, index) => (
          <div key={index} className="flex-shrink-0 w-80 bg-gray-800 p-6 rounded-lg shadow-lg">
            <p className="mb-4">{testimonial.text}</p>
            <p className="font-semibold">{testimonial.name}</p>
            <p className="text-gray-400">{testimonial.role}</p>
          </div>
        ))}
      </motion.div>
    </section>
  )
}

