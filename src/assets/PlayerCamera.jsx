import React, {
    useEffect,
    useRef,
    useState
} from "react";
import {
    useFrame
} from "@react-three/fiber";
import {
    PerspectiveCamera
} from "@react-three/drei";
import {
    Vector3
} from "three";

export const PlayerCamera = (props) => {
    const cameraRef = useRef();

    const {
        active,
        position,
        velocity
    } = props;


    useFrame(() => {
        if (!active || !position || !velocity) return;

        let direction = new Vector3(velocity.current[0], velocity.current[1], velocity.current[2]).normalize();
        direction.applyAxisAngle(new Vector3(0,1,0), Math.PI);
        direction = direction.toArray();
  
        const shakeRemoval = 0.01;
        const positionAvg = position.current.map(p => Math.round(p / shakeRemoval) * shakeRemoval);

        if (cameraRef.current) {
            const distance = 10;
            const lerpedPos = cameraRef.current.position.lerp(new Vector3(positionAvg[0] + direction[0] * distance, positionAvg[1] + 5, positionAvg[2] + direction[2] * distance), 0.25);
            
            cameraRef.current.position.set(lerpedPos.x, lerpedPos.y, lerpedPos.z);


        }
        cameraRef?.current?.lookAt(position.current[0], position.current[1], position.current[2]);
    });

    return (
        <>
            {active &&
                <PerspectiveCamera
                    ref={cameraRef}
                    fov={90}
                    far={1000}
                    makeDefault={true}></PerspectiveCamera>
            }</>)
}