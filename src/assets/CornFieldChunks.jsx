/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.1.4 .\\CornFieldChunks.glb
*/

import React, {
    useRef
} from 'react'
import {
    useGLTF
} from '@react-three/drei'
import {
    CornFieldArea
} from "./CornFieldArea.jsx";

export function CornfieldChunks(props) {
    const {
        nodes
    } = useGLTF('/CornFieldChunks.glb')

    const {playerPosRef} = props;

    return (
        <group {...props}
               dispose={null}>
            {nodes && Object.keys(nodes).map(nodeKey =>
                <CornFieldArea
                    playerPosRef={playerPosRef}
                    mesh={nodes[nodeKey]}></CornFieldArea>)}
        </group>
    )
}

useGLTF.preload('/CornFieldChunks.glb')
