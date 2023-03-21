import {
    TireParticles
} from "./TireParticles.jsx";

const debug = true;

export const WheelDebug = ({ radius, wheelRef }) => {
    return debug && (
        <group ref={wheelRef}>
            <mesh rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[radius, radius, 0.5, 16]} />
            </mesh>
            <TireParticles position={wheelRef.position}></TireParticles>
        </group>
    );
};