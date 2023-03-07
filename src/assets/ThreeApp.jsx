import * as THREE
    from 'three';
import React, {
    useEffect,
    useRef,
    useState
} from "react";
import {
    Canvas
} from "@react-three/fiber";
import {
    Box,
    OrbitControls
} from "@react-three/drei";
import DirectionalLightNode
    from "three/addons/nodes/lighting/DirectionalLightNode.js";
import AmbientLightNode
    from "three/addons/nodes/lighting/AmbientLightNode.js";
import {
    JungleTree
} from "./Jungletree.jsx";
import {
    Jungle
} from "./Jungle.jsx";
import {
    JungleGround
} from "./JungleGround.jsx";
import {
    Color
} from "three";

export const ThreeApp = () => {

    useEffect(() => {

    }, [])

    return (
        <Canvas
            className={"threeCanvas"}
            shadows
            camera={{
                position: [-100, 250, 500],
                fov: 90,
                far: 10000
            }}
        >
            <ambientLight intensity={0.5}/>
            <directionalLight
                castShadow
                position={[-100, 250, 400]}
                color={new Color(1.5, 1.2, 1.2)}
                />
            <JungleGround
                castShadow
                receiveShadow
                position={[0, 0, 0]}></JungleGround>
            <Jungle
                castShadow
                receiveShadow
                position={[0, 0, 0]}></Jungle>
            <OrbitControls></OrbitControls>
        </Canvas>
    );
}