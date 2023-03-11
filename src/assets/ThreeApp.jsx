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
    OrbitControls,
    Plane
} from "@react-three/drei";
import {
    Color
} from "three";
import {
    CornPlant
} from "./CornPlant.jsx";
import {
    Player
} from "./Player.jsx";
import {
    Debug,
    Physics,
    useBox,
    usePlane
} from "@react-three/cannon";


const cornDistance = 8;

const shadowCameraDist = 300;

export const ThreeApp = () => {
    const [cornField, setCornField] = useState([]);

    useEffect(() => {
        const cornField = [];

        for (let x = 0; x < 30; x++) {
            cornField.push([]);

            for (let y = 0; y < 30; y++) {
                
                const randomScale = Math.random() * 3 + 1;

                cornField[x].push({
                    position: {
                        x: x * cornDistance,
                        y: 0,
                        z: y * cornDistance
                    },
                    rotation: {
                        x: Math.random() * 0.5,
                        y: Math.random() * 360,
                        z: Math.random() * 0.5
                    },
                    scale: {
                        x: randomScale,
                        y: randomScale,
                        z: randomScale
                    },
                    variation: Math.round(Math.random() * 2) + 1
                });
            }
        }
        setCornField(cornField);
    }, [])

    return (
        <Canvas
            className={"threeCanvas"}
        >
            <ambientLight
                intensity={0.5}/>
            <directionalLight
                castShadow
                position={[-50, 100, -100]}
                color={new Color(1.5, 1.2, 1.2)}
                shadow-camera-top={shadowCameraDist}
                shadow-camera-bottom={-shadowCameraDist}
                shadow-camera-left={shadowCameraDist}
                shadow-camera-right={-shadowCameraDist}
                shadow-camera-far={1000}
                shadow-mapSize-height={1024}
                shadow-mapSize-width={1024}
            />

            <Physics broadphase={"SAP"}>
                <Debug
                    color="red"
                    scale={1.1}>
                    <Player
                        cornField={cornField}
                        setCornField={setCornField}></Player>

                    <Ground></Ground>
                    <CornPlant
                        position={[0, 0, 0]}
                        plants={cornField?.flatMap(x => [...x])}
                        setPlants={setCornField}
                    />
                    <OrbitControls></OrbitControls>
                </Debug>
            </Physics>
        </Canvas>
    );
}

function Ground() {
    const [groundRef] = usePlane(() => ({
        mass: 0,
        position: [0, 0, 0],
        args: [1000, 1000, 1000],
        rotation: [-Math.PI / 2, 0, 0],
        collisionFilterGroup: 2,
        collisionFilterMask: 1
    }))

    return (
        <Plane
            ref={groundRef}
            receiveShadow
            castShadow
            scale={[1000, 1000, 1000]}
            material={new THREE.MeshLambertMaterial({color: "#624f14"})}></Plane>
    )
}