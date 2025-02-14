"use client"

import type React from "react"
import { useRef, useEffect } from "react"
import * as THREE from "three"

export const Globe3D: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const currentMount = mountRef.current
    if (!currentMount) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({ alpha: true })

    renderer.setSize(400, 400)
    currentMount.appendChild(renderer.domElement)

    const geometry = new THREE.SphereGeometry(1, 32, 32)
    const material = new THREE.MeshBasicMaterial({
      color: 0x00ff00,
      wireframe: true,
    })
    const globe = new THREE.Mesh(geometry, material)
    scene.add(globe)

    camera.position.z = 3

    const animate = () => {
      requestAnimationFrame(animate)
      globe.rotation.x += 0.01
      globe.rotation.y += 0.01
      renderer.render(scene, camera)
    }

    animate()

    return () => {
      currentMount?.removeChild(renderer.domElement)
    }
  }, [])

  return <div ref={mountRef} className="w-full h-full" />
}

