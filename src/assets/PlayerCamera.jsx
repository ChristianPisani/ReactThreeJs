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
        position,
        direction
    } = props;


    useFrame(() => {
        if (!position || !direction) return;


        if (cameraRef.current) {
            const distance = 10;
            const lerpedPos = cameraRef.current.position.lerp(new Vector3(position[0] + direction[0] * distance, 10, position[2] + direction[2] * distance), 0.1);

            cameraRef.current.position.set(lerpedPos.x, lerpedPos.y, lerpedPos.z);


        }
        //cameraRef.current.position.set([position[0] + direction[0] * 10, position[1] + direction[1] * 10 + 15, position[2] + direction[2] * 10]);

        cameraRef?.current?.lookAt(position[0] - direction[0] * 10, position[1] - direction[1] * 10, position[2] - direction[2] * 10);
    });

    return (
        <PerspectiveCamera
            ref={cameraRef}
            fov={90}
            far={1000}
            makeDefault={true}></PerspectiveCamera>
    )
}