/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.1.4 .\\jungle.glb
*/

import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'

export function Jungle(props) {
  const { nodes, materials } = useGLTF('/jungle.glb')
  return (
    <group {...props} dispose={null}>
      <mesh receiveShadow castShadow geometry={nodes.Plane001_1.geometry} material={materials.TreeTrunk} />
      <mesh receiveShadow castShadow geometry={nodes.Plane001_2.geometry} material={materials.Leaves} />
    </group>
  )
}

useGLTF.preload('/jungle.glb')
