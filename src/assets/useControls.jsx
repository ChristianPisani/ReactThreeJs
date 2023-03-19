import { useEffect, useState } from "react";

// from https://github.com/Domenicobrz/R3F-in-practice/blob/main/car-physics/src/useControls.jsx

export const useControls = (vehicleApi, chassisApi) => {
    let [controls, setControls] = useState({ });
    
    const moveSpeed = 500;

    useEffect(() => {
        const keyDownPressHandler = (e) => {
            setControls((controls) => ({ ...controls, [e.key.toLowerCase()]: true }));
        }

        const keyUpPressHandler = (e) => {
            setControls((controls) => ({ ...controls, [e.key.toLowerCase()]: false }));
        }

        window.addEventListener("keydown", keyDownPressHandler);
        window.addEventListener("keyup", keyUpPressHandler);
        return () => {
            window.removeEventListener("keydown", keyDownPressHandler);
            window.removeEventListener("keyup", keyUpPressHandler);
        }
    }, []);

    useEffect(() => {
        if(!vehicleApi || !chassisApi) return;

        vehicleApi.setBrake(0, 0);
        vehicleApi.setBrake(0, 1);
        vehicleApi.setBrake(0, 2);
        vehicleApi.setBrake(0, 3);
        
        if(controls[" "]) {
            vehicleApi.setBrake(20, 2);
            vehicleApi.setBrake(20, 3);
        }
        else if (controls.w) {
            vehicleApi.applyEngineForce(moveSpeed, 0);
            vehicleApi.applyEngineForce(moveSpeed, 1);
        } else if (controls.s) {
            vehicleApi.applyEngineForce(-moveSpeed, 0);
            vehicleApi.applyEngineForce(-moveSpeed, 1);
        } else {
            vehicleApi.applyEngineForce(0, 0);
            vehicleApi.applyEngineForce(0, 1);
        }

        if (controls.a) {
            vehicleApi.setSteeringValue(0.35, 2);
            vehicleApi.setSteeringValue(0.35, 3);
            vehicleApi.setSteeringValue(-0.1, 0);
            vehicleApi.setSteeringValue(-0.1, 1);
        } else if (controls.d) {
            vehicleApi.setSteeringValue(-0.35, 2);
            vehicleApi.setSteeringValue(-0.35, 3);
            vehicleApi.setSteeringValue(0.1, 0);
            vehicleApi.setSteeringValue(0.1, 1);
        } else {
            for(let i = 0; i < 4; i++) {
                vehicleApi.setSteeringValue(0, i);
            }
        }

        if (controls.r) {
            chassisApi.position.set(-1.5, 26.5, 3);
            chassisApi.velocity.set(0, 0, 0);
            chassisApi.angularVelocity.set(0, 0, 0);
            chassisApi.rotation.set(0, 0, 0);
        }
    }, [controls, vehicleApi, chassisApi]);

    return controls;
}