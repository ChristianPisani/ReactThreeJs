import { useCompoundBody } from "@react-three/cannon";
import { useRef } from "react";

// from https://github.com/Domenicobrz/R3F-in-practice/blob/main/car-physics/src/useWheels.jsx

export const useWheels = (width, height, front, radius) => {
    const wheels = [useRef(null), useRef(null), useRef(null), useRef(null)];

    const wheelInfo = {
        radius,
        directionLocal: [0, -1, 0],
        axleLocal: [1, 0, 0],
        suspensionStiffness: 100,
        suspensionRestLength: 0,
        frictionSlip: 1,
        dampingRelaxation: 2.3,
        dampingCompression: 4.4,
        maxSuspensionForce: 1000000000,
        rollInfluence: 0,
        maxSuspensionTravel: 1,
        customSlidingRotationalSpeed: 0,
        useCustomSlidingRotationalSpeed: false,
        collisionFilterGroup: 2,
        sleepSpeedLimit: 1,
        allowSleep: false,
        maxSpeed: 0.1,
        maxForce: 0.1
    };

    const wheelOffset = 0.65; 
    
    const wheelInfos = [
        {
            ...wheelInfo,
            chassisConnectionPointLocal: [-width * 0.65, -height * wheelOffset, front],
            isFrontWheel: true,
        },
        {
            ...wheelInfo,
            chassisConnectionPointLocal: [width * 0.65, -height * wheelOffset, front],
            isFrontWheel: true,
        },
        {
            ...wheelInfo,
            chassisConnectionPointLocal: [-width * 0.65, -height * wheelOffset, -front],
            isFrontWheel: false,
        },
        {
            ...wheelInfo,
            chassisConnectionPointLocal: [width * 0.65, -height * 0.4, -front],
            isFrontWheel: false,
        },
    ];

    const propsFunc = () => ({
        collisionFilterGroup: 1,
        collisionFilterMask: 2,
        mass: 1,
        shapes: [
            {
                args: [wheelInfo.radius, wheelInfo.radius, 0.5, 16],
                rotation: [0, 0, -Math.PI / 2],
                type: "Cylinder",
                receiveShadow: true,
                castShadow: true
            },
        ],
        type: "Kinematic",
    });

    useCompoundBody(propsFunc, wheels[0]);
    useCompoundBody(propsFunc, wheels[1]);
    useCompoundBody(propsFunc, wheels[2]);
    useCompoundBody(propsFunc, wheels[3]);

    return [wheels, wheelInfos];
};