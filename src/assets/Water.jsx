/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.1.4 .\\Water.glb
*/

import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'

export function Water(props) {
  const { nodes, materials } = useGLTF('/Water.glb')
  return (
    <group {...props} dispose={null}>
      <mesh geometry={nodes.Plane006.geometry} material={materials.Water} position={[0.42, -20.2, 10.83]} />
    </group>
  )
}

useGLTF.preload('/Water.glb')