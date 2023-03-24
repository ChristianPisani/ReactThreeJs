import React, {
    useEffect,
    useRef,
    useState
} from "react";
import {
    useFrame
} from "@react-three/fiber";
import {
    Box,
    PerspectiveCamera
} from "@react-three/drei";
import {
    Color,
    Vector3
} from "three";

const shadowCameraDist = 200;

export const PlayerCamera = (props) => {
    const cameraRef = useRef();
    const lightRef = useRef();

    const {
        active,
        position,
        velocity,
        velocityLength
    } = props;


    useFrame(() => {
        if (!active || !position || !velocity) return;

        if (velocityLength.current < 1) return;

        let direction = velocity.current.normalize();
        direction.applyAxisAngle(new Vector3(0, 1, 0), Math.PI);
        direction = direction.toArray();

        const shakeRemoval = 0.5;
        const positionAvg = position.current.map(p => Math.round(p / shakeRemoval) * shakeRemoval);
        
        if (cameraRef.current) {
            const distance = 8;
            const lerpedPos = cameraRef.current.position.lerp(
                new Vector3(positionAvg[0] + direction[0] * distance, positionAvg[1] + 5, positionAvg[2] + direction[2] * distance), 0.1);

            cameraRef.current.position.set(lerpedPos.x, lerpedPos.y, lerpedPos.z);


            if(lightRef.current) {
                lightRef.current.position.set(lerpedPos.x, 0, lerpedPos.z);
                lightRef.current.lookAt(position.current[0] + 100, position.current[1] - 50, position.current[2] - 100)
            }
        }
        cameraRef?.current?.lookAt(position.current[0], position.current[1], position.current[2]);
    });

    return (
        <>
            {active &&
                <PerspectiveCamera
                    ref={cameraRef}
                    fov={90}
                    far={500}
                    makeDefault={true}></PerspectiveCamera>
            }
            <directionalLight
                ref={lightRef}
                castShadow
                color={new Color(1.5, 1.2, 1.2)}
                shadow-mapSize-height={1024}
                shadow-mapSize-width={1024}
            />
        </>)
}