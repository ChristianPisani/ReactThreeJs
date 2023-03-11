import React, {
    useEffect,
    useRef,
    useState
} from "react";
import {
    useFrame
} from "@react-three/fiber";
import {
    Vector3
} from "three";
import {
    Car
} from "./Car.jsx";
import {
    Debug,
    useBox,
    useSphere,
} from "@react-three/cannon";
import * as CANNON
    from 'cannon';
import {
    Box
} from "@react-three/drei";
import {
    getTiledPos
} from "../util/utils.js";
import {
    PlayerCamera
} from "./PlayerCamera.jsx";

const Collider = (props) => {
    const {
        pos,
        onCollide
    } = props;

    if(!pos) return;
    
    const [ref, api] = useBox(() => ({
        position: [pos.x, pos.y + 5, pos.z],
        args: [3, 10, 3],
        type: "Static",
        onCollide: (e) => onCollide(),
        collisionResponse: 0,
        collisionFilterGroup: 3,
        collisionFilterMask: 1,
        isTrigger: true
    }));

    return (
        <></>
    )
}

export const Player = (props) => {
    const [direction, setDirection] = useState([0, 0, 0])
    const [rotation, setRotation] = useState(0);
    const [movingForward, setMovingForward] = useState(false);
    const [movingBackwards, setMovingBackwards] = useState(false);
    const [rotatingRight, setRotatingRight] = useState(false);
    const [rotatingLeft, setRotatingLeft] = useState(false);

    const movementSpeed = 200;
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

    const material = new CANNON.ContactMaterial({
        friction: 0,
        restitution: 0,
        contactEquationStiffness: 1e8,
        contactEquationRelaxation: 3,
        frictionEquationStiffness: 1e8,
        frictionEquationRegularizationTime: 3,
    });
    const [carRef, carApi] = useSphere(() => ({
        linearDamping: 0.75,
        friction: 0,
        angularDrag: 1000,
        restitution: 0,
        material,
        mass: 100,
        position: [0, 10, 0],
        args: [6, 6, 6],
        type: "Dynamic",
        collisionFilterGroup: 1,
        collisionFilterMask: 2
    }))


    const position = useRef([0, 0, 0]);
    useEffect(() => {
        carApi.position.subscribe(pos => position.current = pos);
    }, [])

    useFrame(() => {
        const forward = rotate2D(0, 1, rotation);
        setDirection([forward[0], 0, forward[1]]);
        const movementVector = new Vector3(forward[0], 0, forward[1]);

        let moveDir = -1;

        if (movingBackwards) {
            moveDir = 1;
        }
        carApi.rotation.set(0, -rotation, 0);

        if (movingForward || movingBackwards) {
            movementVector.multiplyScalar(movementSpeed * moveDir * 50);
            const newPos = new Vector3(position[0] + movementVector.x, position[1] + movementVector.y, position[2] + movementVector.z);

            carApi.applyLocalImpulse([0, 0, moveDir * movementSpeed], [0, 0, -1]);
        }


        if (rotatingLeft) {
            setRotation(rotation - rotationSpeed);
        }
        if (rotatingRight) {
            setRotation(rotation + rotationSpeed);
        }

        /*const tiledPos = getTiledPos(position.current, 8);
        const row = cornField[tiledPos[0]];
        if (row) {
            const plantAtTiledPos = row[tiledPos[2]];
            if (plantAtTiledPos) {
                const cornFieldCopy = [...cornField];
                cornFieldCopy[tiledPos[0]][tiledPos[2]].destroyed = true;
                setCornField(cornFieldCopy);
            }
        }*/

        /*const x = position[0];
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
        setCornField(cornFieldCopy);*/
    });

    const tiledPos = getTiledPos(position.current, 8);
    const getArrayPosX = (x) => {
        return Math.max(0, Math.min(cornField.length - 1, x))
    }
    const getArrayPosY = (y) => {
        return Math.max(0, Math.min(y, cornField[0].length - 1))
    }
    
    const cornFieldGrid = [];
    
    for(let i = -4; i <= 4; i++) {
        for(let j = -4; j <= 4; j++) {
            cornFieldGrid.push(cornField[getArrayPosX(tiledPos[0] + i)][getArrayPosY(tiledPos[2] + j)])
        }
    }
    
    return (
        <>
            <Car
                scale={[2, 2, 2]}
                offset={[0, -3, 0]}
                physicsRef={carRef}
                position={position}></Car>
            <PlayerCamera position={position.current} direction={direction}></PlayerCamera>
            <Box
                position={getTiledPos(position.current, 10)}
                scale={[10, 10, 10]}></Box>
            {cornFieldGrid.map((plant, index) => (
                <group
                    key={index}>
                    {!plant.destroyed &&
                        <Collider
                            key={"collider" + index + plant.position.x + plant.position.z}
                            pos={plant.position}
                            onCollide={() => {
                                plant.destroyed = true;
                                setCornField([...cornField]);
                            }}></Collider>
                    }
                    {plant.destroyed &&
                        <Box
                            key={index + "_box"}
                            position={[plant.position.x, plant.position.y, plant.position.z]} scale={[2,10,2]}></Box>
                    }
                </group>
            ))}
        </>
    )
}