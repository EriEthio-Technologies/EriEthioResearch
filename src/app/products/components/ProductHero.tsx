"use client"

import { Canvas } from "@react-three/fiber"
import { OrbitControls, Box } from "@react-three/drei"

interface ProductHeroProps {
  name: string
  description: string
}

export function ProductHero({ name, description }: ProductHeroProps) {
  return (
    <div className="h-[50vh] flex flex-col md:flex-row items-center justify-between">
      <div className="md:w-1/2">
        <h1 className="text-4xl font-bold mb-4">{name}</h1>
        <p className="text-xl text-gray-300">{description}</p>
      </div>
      <div className="md:w-1/2 h-full">
        <Canvas>
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
          <Box>
            <meshStandardMaterial color="hotpink" />
          </Box>
          <OrbitControls />
        </Canvas>
      </div>
    </div>
  )
}

