"use client"

import type React from "react"
import { useEffect, useRef } from "react"

export const TerminalAnimation: React.FC = () => {
  const terminalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const terminal = terminalRef.current
    if (!terminal) return

    const text = "Initializing SecuredAI v1.0..."
    let index = 0

    const typeWriter = () => {
      if (index < text.length) {
        terminal.innerHTML += text.charAt(index)
        index++
        setTimeout(typeWriter, 100)
      }
    }

    typeWriter()
  }, [])

  return (
    <div ref={terminalRef} className="font-mono text-green-400 bg-black p-4 rounded-lg mt-4 h-16 overflow-hidden"></div>
  )
}

