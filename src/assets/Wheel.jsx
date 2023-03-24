import {
    TireParticles
} from "./TireParticles.jsx";
import {
    MeshPhongMaterial
} from "three";

const debug = true;

const material = new MeshPhongMaterial({color: "black"})

export const Wheel = ({ radius, wheelRef }) => {
    return debug && (
        <group ref={wheelRef}>
            <mesh rotation={[0, 0, Math.PI / 2]} material={material}>
                <cylinderGeometry args={[radius, radius, 0.5, 16]} />
            </mesh>
        </group>
    );
};