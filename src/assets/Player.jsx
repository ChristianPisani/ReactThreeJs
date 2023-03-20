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
import {
    CornParticles
} from "./CornParticles.jsx";
import {
    CornShrub
} from "./CornShrub.jsx";

const slipperyMaterial = new CANNON.Material();
slipperyMaterial.friction = 0.1;

export const Player = (props) => {
    const [movingForward, setMovingForward] = useState(false);
    const [movingBackwards, setMovingBackwards] = useState(false);
    const [rotatingRight, setRotatingRight] = useState(false);
    const [rotatingLeft, setRotatingLeft] = useState(false);
    const [colliding, setColliding] = useState(false);

    const movementSpeed = 300;
    const rotationSpeed = 100;

    const {
        cornField,
        setCornField,
        tileSize,
        setPlayerRef
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

    const [carRef, carApi] = useSphere(() => ({
        linearDamping: 0.5,
        angularDamping: 0.8,
        restitution: 0,
        mass: 10,
        position: [0, 10, 0],
        args: [3, 3, 4],
        type: "Dynamic",
        collisionFilterGroup: 1,
        collisionFilterMask: 2,
        fixedRotation: false,
        material: slipperyMaterial,
        onCollideBegin: () => setColliding(true),
        onCollideEnd: () => setColliding(false)
    }))


    const position = useRef([0, 0, 0]);
    const velocity = useRef([0, 0, 0]);
    const rotation = useRef([0, 0, 0]);
    useEffect(() => {
        carApi.position.subscribe(pos => {
            position.current = pos;
        });
        carApi.velocity.subscribe(vel => velocity.current = vel);
        carApi.rotation.subscribe(rot => rotation.current = rot);
        
        setPlayerRef(position);
    }, [])

    useFrame(() => {
        //const forward = rotate2D(0, 1, rotation);
        //setDirection([forward[0], 0, forward[1]]);
        //const movementVector = new Vector3(forward[0], 0, forward[1]);

        let moveDir = -1;

        if (movingBackwards) {
            moveDir = 1;
        }

        if (colliding && (movingForward || movingBackwards)) {
            //movementVector.multiplyScalar(movementSpeed * moveDir);

            carApi.applyLocalForce([0, 1, moveDir * movementSpeed], [0, 0, 0]);
        }
        
        

        //carApi.rotation.set(0, -rotation, 0);

        if (rotatingLeft) {
            carApi.applyTorque([0, rotationSpeed, 0]);
            //setRotation(rotation - rotationSpeed);
        }
        if (rotatingRight) {
            carApi.applyTorque([0, -rotationSpeed, 0]);
            //setRotation(rotation + rotationSpeed);
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

    /*const tiledPos = getTiledPos(position.current, tileSize);
    const getArrayPosX = (x) => {
        return Math.max(0, Math.min(cornField.length - 1, x))
    }
    const getArrayPosY = (y) => {
        return Math.max(0, Math.min(y, cornField[0].length - 1))
    }

    const cornFieldGrid = [];

    for (let i = -4; i <= 4; i++) {
        for (let j = -4; j <= 4; j++) {
            cornFieldGrid.push(cornField[getArrayPosX(tiledPos[0] + i)][getArrayPosY(tiledPos[2] + j)])
        }
    }*/

    return (
        <>
            <Car
                scale={[1, 1, 1]}
                offset={[0, -1.5, 0]}
                physicsRef={carRef}></Car>
            {
                <PlayerCamera
                    active={true}
                    position={position}
                    velocity={velocity}></PlayerCamera>}
            {/*cornFieldGrid.map((plant, index) => (
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
                </group>
            ))*/}
            {/*cornField.flatMap(x => x).map((plant, index) => (
                <group
                    key={index + "plant"}>
                    {plant.destroyed &&
                        <>
                            <CornParticles
                                key={index + "_box"}
                                position={[plant.position.x, plant.position.y, plant.position.z]}
                                velocity={velocity.current}
                                scale={[2, 10, 2]}></CornParticles>
                            <CornDestroyed
                                position={[plant.position.x, plant.position.y, plant.position.z]}
                                scale={[plant.scale.x, plant.scale.y, plant.scale.z]}
                                rotation={[plant.rotation.x, plant.rotation.y, plant.rotation.z]}></CornDestroyed>
                        </>
                    }
                </group>
            ))*/}
        </>
    )
}