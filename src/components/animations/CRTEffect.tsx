"use client"

import { useEffect, useRef } from "react"

export function CRTEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    const drawScanline = (y: number) => {
      ctx.fillStyle = "rgba(255,255,255,0.1)"
      ctx.fillRect(0, y, canvas.width, 1)
    }

    let scanlinePosition = 0

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw scanlines
      for (let i = 0; i < canvas.height; i += 3) {
        drawScanline(i)
      }

      // Moving scanline effect
      drawScanline(scanlinePosition)
      scanlinePosition = (scanlinePosition + 1) % canvas.height

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-50"
      style={{ mixBlendMode: "overlay" }}
    />
  )
}

