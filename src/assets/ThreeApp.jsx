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


const Player = () => {
    const [position, setPosition] = useState([0, 0, 0]);
    const [rotation, setRotation] = useState(0);
    const [movingForward, setMovingForward] = useState(false);
    const [movingBackwards, setMovingBackwards] = useState(false);
    const [rotatingRight, setRotatingRight] = useState(false);
    const [rotatingLeft, setRotatingLeft] = useState(false);

    const movementSpeed = 0.75;
    const rotationSpeed = 0.05;

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
        const movementVector = new Vector3(forward[0], 0, forward[1]);

        if (movingForward) {
            movementVector.multiplyScalar(-movementSpeed);
            const newPos = new Vector3(position[0] + movementVector.x, position[1] + movementVector.y, position[2] + movementVector.z);

            setPosition([newPos.x, newPos.y, newPos.z]);
        }
        if (movingBackwards) {
            movementVector.multiplyScalar(movementSpeed);
            const newPos = new Vector3(position[0] + movementVector.x, position[1] + movementVector.y, position[2] + movementVector.z);

            setPosition([newPos.x, newPos.y, newPos.z]);
        }
        if (rotatingLeft) {
            setRotation(rotation - rotationSpeed);
        } 
        if (rotatingRight) {
            setRotation(rotation + rotationSpeed);
        }
    });


    return (
        <Car
            scale={[2,2,2]}
            position={position}
            rotation={[0, -rotation, 0]}></Car>
    )
}

export const ThreeApp = () => {
    return (
        <Canvas
            className={"threeCanvas"}
            shadows={"soft"}
            shadow-map-size={[2048, 2048]}

            camera={{
                position: [-1, 5, 5],
                fov: 90,
                far: 10000
            }}
        >
            <ambientLight
                intensity={0.5}/>
            <directionalLight
                castShadow
                position={[-100, 250, 400]}
                color={new Color(1.5, 1.2, 1.2)}
                shadow-camera-top={100}
                shadow-camera-bottom={-100}
                shadow-camera-left={100}
                shadow-camera-right={-100}
                shadow-camera-far={1000}
                shadow-bias={0.0001}
            />

            <Player></Player>

            <JungleTree scale={[0.5,0.5,0.5]}></JungleTree>
            <CornField></CornField>
            <CornPlant
                variation={1}></CornPlant>
            <OrbitControls></OrbitControls>
        </Canvas>
    );
}