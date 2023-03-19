﻿import { useCompoundBody } from "@react-three/cannon";
import { useRef } from "react";

// from https://github.com/Domenicobrz/R3F-in-practice/blob/main/car-physics/src/useWheels.jsx

export const useWheels = (width, height, front, radius) => {
    const wheels = [useRef(null), useRef(null), useRef(null), useRef(null)];

    const wheelInfo = {
        radius,
        directionLocal: [0, -1, 0],
        axleLocal: [1, 0, 0],
        suspensionStiffness: 60,
        suspensionRestLength: 0,
        frictionSlip: 5,
        dampingRelaxation: 2.3,
        dampingCompression: 4.4,
        maxSuspensionForce: 100000,
        rollInfluence: 0.0,
        maxSuspensionTravel: 1,
        customSlidingRotationalSpeed: 0,
        useCustomSlidingRotationalSpeed: false,
        collisionFilterGroup: 2
    };

    const wheelInfos = [
        {
            ...wheelInfo,
            chassisConnectionPointLocal: [-width * 0.65, -height * 0.4, front],
            isFrontWheel: true,
        },
        {
            ...wheelInfo,
            chassisConnectionPointLocal: [width * 0.65, -height * 0.4, front],
            isFrontWheel: true,
        },
        {
            ...wheelInfo,
            chassisConnectionPointLocal: [-width * 0.65, -height * 0.4, -front],
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