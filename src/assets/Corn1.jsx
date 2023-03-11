/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.1.4 .\\Corn1.glb
*/

import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'

export function Model(props) {
  const { nodes, materials } = useGLTF('/Corn1.glb')
  return (
    <group {...props} dispose={null}>
      <group position={[0, 0, 6]}>
        <mesh geometry={nodes.Circle001.geometry} material={materials['Material.001']} />
        <mesh geometry={nodes.Circle001_1.geometry} material={materials['Material.003']} />
      </group>
    </group>
  )
}

useGLTF.preload('/Corn1.glb')
