/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.1.4 .\\CornPlant.glb
*/

import React, {
    useEffect,
    useRef
} from 'react'
import {
    Box,
    useGLTF
} from '@react-three/drei'
import {
    Object3D
} from "three";


export function CornPlantSimple(props) {
    const plant1Gltf = useGLTF('/Corn1.glb')

    const {
        plants,
        setPlants
    } = props;

    const leavesType1Ref = useRef();

    const stalkType1Ref = useRef();

    const tempObject = new Object3D();

    useEffect(() => {
        if (leavesType1Ref?.current == null || stalkType1Ref?.current == null) return;

        let i = 0;
        plants?.forEach(plant => {
            const id = i++;
            if (plant.destroyed) {
                tempObject.scale.set(0, 0, 0);
            } else {
                const {
                    position,
                    rotation,
                    scale
                } = plant;

                tempObject.position.set(position.x, position.y, position.z);
                tempObject.scale.set(scale.x, scale.y, scale.z);
                tempObject.rotation.set(rotation.x, rotation.y, rotation.z);
            }
            tempObject.updateMatrix();

            leavesType1Ref.current.setMatrixAt(id, tempObject.matrix);
            stalkType1Ref.current.setMatrixAt(id, tempObject.matrix);
            leavesType1Ref.current.instanceMatrix.needsUpdate = true;
            stalkType1Ref.current.instanceMatrix.needsUpdate = true;
        });
    }, [plants]);

    return (
        <>
            <group {...props} >
                <group>
                    <instancedMesh
                        castShadow
                        receiveShadow
                        ref={leavesType1Ref}
                        args={[null, null, plants?.length ?? 1]}
                        geometry={plant1Gltf.nodes.Circle009.geometry}
                        material={plant1Gltf.materials['Material.001']}/>
                    <instancedMesh
                        castShadow
                        receiveShadow
                        ref={stalkType1Ref}
                        args={[null, null, plants?.length ?? 1]}
                        geometry={plant1Gltf.nodes.Circle009_1.geometry}
                        material={plant1Gltf.materials['Material.003']}/>
                </group>
            </group>
        </>);
}

useGLTF.preload('/Corn1.glb')