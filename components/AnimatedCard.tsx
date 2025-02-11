"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"

export const AnimatedCard: React.FC<{ title: string }> = ({ title }) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      className="bg-gray-800 p-6 rounded-lg shadow-lg cursor-pointer"
      whileHover={{ scale: 1.05 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      {isHovered && (
        <motion.div
          className="absolute inset-0 bg-cyan-400 mix-blend-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        />
      )}
    </motion.div>
  )
}

