import {
    useBox
} from "@react-three/cannon";
import React, {
    useEffect,
    useState
} from "react";
import {
    Box,
    Circle,
    useGLTF
} from "@react-three/drei";
import {
    Color,
    MeshBasicMaterial,
    MeshPhongMaterial
} from "three";

const smokematerial = new MeshPhongMaterial({color: "beige"});

const TireParticle = (props) => {
    const {position, height, velocity, mesh, material} = props;

    const [ref, api] = useBox(() => ({
        mass: 1,
        position: [position[0], position[1] + Math.random() * 5 + 3, position[2]],
        type: "Dynamic",
        linearDamping: 0,
        collisionResponse: false,
        args: [1, height, 1],
        rotation: [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI],
    }));


    useEffect(() => {
        const force = 10;
        api.applyLocalForce([Math.random() * force - force / 2, -Math.random() * force * 2, Math.random() * force - force / 2], [0, 0, 0]);
        api.applyTorque([Math.random() * force - force / 2, -Math.random() * force, Math.random() * force - force / 2]);
        if(velocity) {
            const velForce = -200;
            //api.applyLocalForce([velocity[0] * velForce, velocity[1] * velForce, velocity[2] * velForce], [0, 0, 0])
        }
    }, []);

    return (
        <>
            <Circle
                  ref={ref}
                  scale={[0.5, height, 0.5]}
                  material={smokematerial}></Circle>
        </>
    )
}

export const TireParticles = (props) => {
    const {position} = props;

    const initialize = () =>
    {
        setParticles([]);
        
        const initialParticles = [];
        for (let i = 0; i < 10; i++) {
            initialParticles.push({})
        }
        
        setParticles(initialParticles);
    }

    const [particles, setParticles] = useState([]);

    
    
    useEffect(() => {
        setTimeout(() => initialize(), 2000);
    }, []);

    return (
        <>
            {position && particles?.map((p, index) =>
                <TireParticle
                    velocity={props.velocity}
                    key={`tireparticle${index}${position[0]}${position[1]}${position[2]}`}
                    position={position} height={1}></TireParticle>)}
        </>
    );
}