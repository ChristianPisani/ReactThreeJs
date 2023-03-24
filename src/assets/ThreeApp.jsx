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
    Color,
    Object3D
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
import {
    Island
} from "./Island.jsx";
import {
    Water
} from "./Water.jsx";
import {
    Car
} from "./Car.jsx";
import {
    CornFieldArea
} from "./CornFieldArea.jsx";
import {
    CornfieldChunks
} from "./CornFieldChunks.jsx";


const cornDistance = 4;

export const ThreeApp = () => {
    const [playerPosRef, setPlayerPosRef] = useState();
    const [isCameraFollow, setIsCameraFollow] = useState(true);

    const lightTarget = useRef(new Object3D());

    return (
        <>
            <label htmlFor={"camera-checkbox"}>Toggle camera follow</label>
            <input
                type={"checkbox"} id={"camera-checkbox"} checked={isCameraFollow} onChange={(e) => setIsCameraFollow(e.target.checked)} />

            <Canvas
                className={"threeCanvas"}
                shadows
            >
                <ambientLight
                    intensity={0.5}/>

                <Physics
                    broadphase={"SAP"}
                    frictionGravity={[0, 0, 0]}
                    gravity={[0, -9.8, 0]}
                    iterations={10}
                    tolerance={19}
                    allowSleep={true}
                    solver={"Split"}
                    stepSize={1.0 / 60.0}>
<Debug>
                    <Ground></Ground>
                    {/*
                        cornField && cornField.length > 0 && cornField.map((cornChunk, index) => (
                            <CornFieldChunk
                                key={"chunk" + index}
                                playerPosRef={playerPosRef}
                                cornField={cornChunk}></CornFieldChunk>
                        ))
                    */}
                    {/*<Player
                        tileSize={cornDistance}
                        setPlayerRef={setPlayerPosRef}></Player>*/}
                    <Car isCameraFollow={isCameraFollow}
                        scale={[1, 1, 1]}
                        offset={[0, -0.5, -0.5]}
                        setPlayerRef={setPlayerPosRef}></Car>
                    <Water></Water>
                    <CornfieldChunks
                        playerPosRef={playerPosRef}></CornfieldChunks>
                    <OrbitControls></OrbitControls>
</Debug>
                </Physics>
            </Canvas>
        </>
    );
}

function Ground() {


    /*const [groundRef] = usePlane(() => ({
        mass: 0,
        position: [0, 0, 0],
        args: [1000, 2, 1000],
        rotation: [-Math.PI / 2, 0, 0],
        collisionFilterGroup: 2,
        collisionFilterMask: [1, 80],
        material: slipperyMaterial
    }))*/

    return (
        <>

            <Island></Island>
            {/*<Plane
                ref={groundRef}
                receiveShadow
                castShadow
                scale={[1000, 1000, 1000]}
                material={new THREE.MeshLambertMaterial({color: "#624f14"})}></Plane>*/}
        </>
    )
}