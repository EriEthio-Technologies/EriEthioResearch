"use client"

import { useState } from "react"

interface Testimonial {
  id: number
  name: string
  company: string
  text: string
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "John Doe",
    company: "Tech Co",
    text: "EriEthio Research has revolutionized our AI development process.",
  },
  {
    id: 2,
    name: "Jane Smith",
    company: "AI Innovations",
    text: "Their products are cutting-edge and incredibly user-friendly.",
  },
  // Add more testimonials
]

export function TestimonialSlider() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="w-full flex-shrink-0 p-4">
              <blockquote className="text-xl italic font-semibold text-gray-200">"{testimonial.text}"</blockquote>
              <div className="mt-4 text-gray-400">
                <p className="font-bold">{testimonial.name}</p>
                <p>{testimonial.company}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <button
        onClick={prevTestimonial}
        className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full"
      >
        &lt;
      </button>
      <button
        onClick={nextTestimonial}
        className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full"
      >
        &gt;
      </button>
    </div>
  )
}

