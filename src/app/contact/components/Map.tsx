"use client"

import { Canvas } from "@react-three/fiber"
import { OrbitControls, Box, Text } from "@react-three/drei"

export function Map() {
  return (
    <div className="h-[400px] w-full">
      <Canvas>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Box args={[3, 0.1, 3]} position={[0, -0.05, 0]}>
          <meshStandardMaterial color="#4a4a4a" />
        </Box>
        <Box args={[0.2, 0.2, 0.2]} position={[0, 0.1, 0]}>
          <meshStandardMaterial color="#ff0000" />
        </Box>
        <Text position={[0, 0.3, 0]} fontSize={0.2} color="#ffffff" anchorX="center" anchorY="middle">
          EriEthio HQ
        </Text>
        <OrbitControls enableZoom={false} />
      </Canvas>
    </div>
  )
}

