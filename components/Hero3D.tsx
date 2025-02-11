"use client"

import React, { useRef } from "react"
import type * as THREE from "three"
import { Canvas, useFrame } from "@react-three/fiber"
import { useSpring, animated } from "@react-spring/three"

const AnimatedCube = () => {
  const meshRef = useRef<THREE.Mesh>(null)
  const [active, setActive] = React.useState(false)

  const { scale } = useSpring({
    scale: active ? 1.5 : 1,
    config: { mass: 5, tension: 400, friction: 50, precision: 0.0001 },
  })

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.01
      meshRef.current.rotation.y += 0.01
    }
  })

  return (
    <animated.mesh ref={meshRef} scale={scale} onClick={() => setActive(!active)}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial wireframe color={active ? "#ff00ff" : "#00ffff"} />
    </animated.mesh>
  )
}

export const Hero3D: React.FC = () => {
  return (
    <div className="relative h-screen w-full overflow-hidden">
      <Canvas>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <AnimatedCube />
      </Canvas>
      <div className="absolute inset-0 flex items-center justify-center">
        <h1 className="text-6xl font-bold text-white text-center z-10 glitch-text">ERIETHIO RESEARCH</h1>
      </div>
      <button className="absolute bottom-10 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-cyan-400 to-magenta-400 text-black font-bold py-2 px-4 rounded hover:from-cyan-500 hover:to-magenta-500 transition-colors">
        Explore AI
      </button>
    </div>
  )
}

