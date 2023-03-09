import * as THREE
    from 'three';
import React, {
    useEffect,
    useRef,
    useState
} from "react";
import {
    Canvas,
    useFrame
} from "@react-three/fiber";
import {
    Box,
    CameraControls,
    FlyControls,
    OrbitControls,
    OrthographicCamera,
    PerspectiveCamera,
    Plane
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
    Color,
    Vector3
} from "three";
import {
    CornField
} from "./Cornfield.jsx";
import {
    CornPlant
} from "./CornPlant.jsx";
import {
    Car
} from "./Car.jsx";


const cornDistance = 6;

const Player = (props) => {
    const [position, setPosition] = useState([0, 0, 0])
    const [direction, setDirection] = useState([0, 0, 0])
    const [rotation, setRotation] = useState(0);
    const [movingForward, setMovingForward] = useState(false);
    const [movingBackwards, setMovingBackwards] = useState(false);
    const [rotatingRight, setRotatingRight] = useState(false);
    const [rotatingLeft, setRotatingLeft] = useState(false);
    const [boosting, setBoosting] = useState(false);

    const movementSpeed = 1;
    const boost = 1.5;
    const rotationSpeed = 0.05;

    const {
        cornField,
        setCornField
    } = props;

    useEffect(() => {
        const handleKeyDown = (e) => {
            switch (e.key) {
                case 'w':
                    setMovingForward(true);
                    break;
                case 's':
                    setMovingBackwards(true);
                    break;
                case 'a':
                    setRotatingLeft(true);
                    break;
                case 'd':
                    setRotatingRight(true);
                    break;
                case 'shift':
                    setBoosting(true)
                    break;
            }
        };

        const handleKeyUp = (e) => {
            switch (e.key) {
                case 'w':
                    setMovingForward(false);
                    break;
                case 's':
                    setMovingBackwards(false)
                    break;
                case 'a':
                    setRotatingLeft(false);
                    break;
                case 'd':
                    setRotatingRight(false);
                    break;
                case 'shift':
                    setBoosting(false)
                    break;
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('keyup', handleKeyUp);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('keyup', handleKeyUp);
        };
    }, []);

    const rotate2D = (x, y, theta) => {
        const xTemp = x;
        x = x * Math.cos(theta) - y * Math.sin(theta);
        y = xTemp * Math.sin(theta) + y * Math.cos(theta);

        return [x, y];
    }

    useFrame(() => {
        const forward = rotate2D(0, 1, rotation);
        setDirection([forward[0], 0, forward[1]]);
        const movementVector = new Vector3(forward[0], 0, forward[1]);

        let moveDir = -1;

        if (movingBackwards) {
            moveDir = 1;
        }

        if (boosting) {
            movementVector.multiplyScalar(boost);
        }

        if (movingForward || movingBackwards) {
            movementVector.multiplyScalar(movementSpeed * moveDir);
            const newPos = new Vector3(position[0] + movementVector.x, position[1] + movementVector.y, position[2] + movementVector.z);

            setPosition([newPos.x, newPos.y, newPos.z]);
        }

        if (rotatingLeft) {
            setRotation(rotation - rotationSpeed);
        }
        if (rotatingRight) {
            setRotation(rotation + rotationSpeed);
        }

        const x = position[0];
        const y = position[1];
        const z = position[2];

        const vectorPos = new Vector3(x, y, z);
        const cornFieldCopy = [...cornField];
        cornFieldCopy.forEach(corn => {
            const distance = vectorPos.distanceTo(new Vector3(corn.position.x, corn.position.y, corn.position.z));
            if (distance <= 10 && !corn.destroyed) {
                corn.destroyed = true;
            }
        })
        setCornField(cornFieldCopy);
    });


    return (
        <>
            <Car
                scale={[2, 2, 2]}
                position={position}
                rotation={[0, -rotation, 0]}></Car>
            <PlayerCamera position={position} direction={direction}></PlayerCamera>
        </>
    )
}

const shadowCameraDist = 300;

const PlayerCamera = (props) => {
    const cameraRef = useRef();

    const {
        position,
        direction
    } = props;

    useFrame(() => {
        if (!position || !direction) return;

        cameraRef?.current?.lookAt(position[0] - direction[0] * 10, position[1] - direction[1] * 10, position[2] - direction[2] * 10);
    });

    return (
        <PerspectiveCamera
            ref={cameraRef}
            position={position ? [position[0] + direction[0] * 10, position[1] + direction[1] * 10 + 15, position[2] + direction[2] * 10] : [0, 0, 0]}
            fov={90}
            far={1000}
            makeDefault={true}></PerspectiveCamera>
    )
}

export const ThreeApp = () => {
    const [cornField, setCornField] = useState([]);

    useEffect(() => {
        const cornField = [];

        for (let x = -50; x < 50; x++) {
            for (let y = -50; y < 50; y++) {
                const randomScale = Math.random() * 2 + 1;

                cornField.push({
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
                    variation: Math.round(Math.random() * 4) + 1
                });
            }
        }
        setCornField(cornField);
    }, [])


    return (
        <Canvas
            className={"threeCanvas"}
            shadows={"soft"}
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

            <Player
                cornField={cornField}
                setCornField={setCornField}></Player>
            <CornPlant
                variation={1}></CornPlant>
            <Plane
                receiveShadow
                castShadow
                position={[0, -0.1, 0]}
                scale={[1000, 1000, 1000]}
                material={new THREE.MeshLambertMaterial({color: "#624f14"})}
                rotation={[-Math.PI / 2, 0, 0]}></Plane>

            <CornPlant
                position={[0, 0, 0]}
                plants={cornField}/>
            <OrbitControls></OrbitControls>
        </Canvas>
    );
}