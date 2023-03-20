/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.1.4 .\\Car.glb
*/

import React, {
    useEffect,
    useRef
} from 'react'
import {
    useGLTF
} from '@react-three/drei'
import {
    useWheels
} from "./useWheels.jsx";
import {
    useBox,
    useRaycastVehicle
} from "@react-three/cannon";
import {
    useControls
} from "./useControls.jsx";
import {
    useFrame
} from "@react-three/fiber";
import {
    WheelDebug
} from "./WheelDebug.jsx";
import {
    PlayerCamera
} from "./PlayerCamera.jsx";

export function Car(props) {
    const {
        nodes,
        materials
    } = useGLTF('/Car.glb')

    const position = [-1.5, 26.5, 3];
    const width = 2.15;
    const height = 1;
    const front = 2.3;
    const wheelRadius = 0.6;

    const chassisBodyArgs = [width, height, front * 2];
    const [chassisBody, chassisApi] = useBox(
        () => ({
            allowSleep: false,
            args: chassisBodyArgs,
            mass: 150,
            position,
            collisionFilterGroup: 1,
            collisionFilterMask: 80
        }),
        useRef(null),
    );

    const [wheels, wheelInfos] = useWheels(width, height, front, wheelRadius);

    const [vehicle, vehicleApi] = useRaycastVehicle(
        () => ({
            chassisBody,
            wheelInfos,
            wheels,
        }),
        useRef(null),
    );

    useControls(vehicleApi, chassisApi);

    const carPosition = useRef([0, 0, 0]);
    const velocity = useRef([0, 0, 0]);
    const rotation = useRef([0, 0, 0]);
    useEffect(() => {
        chassisApi.position.subscribe(pos => carPosition.current = pos);
        chassisApi.velocity.subscribe(vel => velocity.current = vel);
        chassisApi.rotation.subscribe(rot => rotation.current = rot);
        props.setPlayerRef(carPosition);
    }, [])

    return (
        <group
            ref={vehicle} {...props}
            dispose={null}>
            <group ref={chassisBody}>
            <mesh
                position={props.offset}
                receiveShadow
                castShadow
                geometry={nodes.Cylinder005_4.geometry}
                material={materials.Car}/>
            </group>
            <WheelDebug
                wheelRef={wheels[0]}
                radius={wheelRadius}/>
            <WheelDebug
                wheelRef={wheels[1]}
                radius={wheelRadius}/>
            <WheelDebug
                wheelRef={wheels[2]}
                radius={wheelRadius}/>
            <WheelDebug
                wheelRef={wheels[3]}
                radius={wheelRadius}/>
            <PlayerCamera
                active={false}
                position={carPosition}
                velocity={velocity}></PlayerCamera>
        </group>
    )
}

useGLTF.preload('/Car.glb')
