import * as THREE
    from 'three';
import * as CANNON
    from 'cannon';
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
    Plane,
    Box
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
import {
    CornPlantSimple
} from "./CornPlantSimple.jsx";
import {
    CornFieldChunk
} from "./CornFieldChunk.jsx";


const cornDistance = 8;

const shadowCameraDist = 300;

export const ThreeApp = () => {
    const [cornField, setCornField] = useState([]);
    const [playerPosRef, setPlayerPosRef] = useState();

    useEffect(() => {
        const createChunk = (i, j, chunkSize) => {
            const cornField = [];

            for (let x = 0; x < chunkSize; x++) {
                cornField.push([]);
                for (let y = 0; y < chunkSize; y++) {
                    const randomScale = Math.random() * 3 + 1;

                    cornField[x].push({
                        position: {
                            x: (x + i * chunkSize) * cornDistance,
                            y: 0,
                            z: (y + j * chunkSize) * cornDistance
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

            return cornField;
        }

        const cornFieldChunks = [];
        const chunkSize = 5;

        for (let i = -10; i < 10; i++) {
            for (let j = -10; j < 10; j++) {
                cornFieldChunks.push({
                    x: i,
                    y: j,
                    size: chunkSize,
                    spacing: cornDistance,
                    chunk: createChunk(i, j, chunkSize)
                });
            }
        }

        cornFieldChunks.push(cornField);

        setCornField(cornFieldChunks);
    }, [])

    return (
        <Canvas
            className={"threeCanvas"}
            shadows
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

            <Physics
                tolerance={1}
                maxSubSteps={1}
                allowSleep={true}
                gravity={[0, -400, 0]}
                solver={"Split"}
                stepSize={1 / 60}
                quatNormalizeFast={true}
                iterations={1}>
                <Player
                    tileSize={cornDistance}
                    setPlayerRef={setPlayerPosRef}></Player>

                <Ground></Ground>
                {
                    cornField && cornField.length > 0 && cornField.map((cornChunk, index) => (
                        <CornFieldChunk
                            key={"chunk" + index}
                            playerPosRef={playerPosRef}
                            cornField={cornChunk}></CornFieldChunk>
                    ))
                }
                <OrbitControls></OrbitControls>
            </Physics>
        </Canvas>
    );
}

function Ground() {
    const slipperyMaterial = new CANNON.Material('slippery');
    slipperyMaterial.friction = 0;

    const [groundRef] = usePlane(() => ({
        mass: 0,
        position: [0, 0, 0],
        args: [1000, 2, 1000],
        rotation: [-Math.PI / 2, 0, 0],
        collisionFilterGroup: 2,
        collisionFilterMask: [1, 80],
        material: slipperyMaterial,
        friction: 0
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