import {
    useBox
} from "@react-three/cannon";
import React
    , {
    useEffect,
    useState
} from "react";
import {
    CornPlantSimple
} from "./CornPlantSimple.jsx";
import {
    Box
} from "@react-three/drei";
import {
    MeshBasicMaterial
} from "three";
import {
    CornParticles
} from "./CornParticles.jsx";
import {
    CornDestroyed
} from "./CornDestroyed.jsx";
import {
    useFrame
} from "@react-three/fiber";
import {
    CornPlant
} from "./CornPlant.jsx";

const Collider = (props) => {
    const {
        pos,
        onCollide
    } = props;

    if (!pos) return;

    const [ref, api] = useBox(() => ({
        position: [pos.x, pos.y + 5, pos.z],
        args: [3, 10, 3],
        type: "Static",
        onCollide: (e) => {
            onCollide();
        },
        collisionResponse: 0,
        collisionFilterGroup: 3,
        collisionFilterMask: 1,
        isTrigger: true
    }));

    return (
        <></>
    )
}

export const CornFieldChunk = (props) => {
    const {playerPosRef} = props;

    const [cornField, setCornField] = useState([]);
    const [withinBounds, setWithinBounds] = useState(false);

    const {
        x,
        y,
        size,
        spacing
    } = props.cornField;

    useEffect(() => {
        setCornField(props?.cornField?.chunk?.flatMap(x => x));
    }, [props.cornField])

    const tileSize = size * spacing;
    const extend = 1;

    useFrame(() => {

        if (!playerPosRef) return;

        const pos = playerPosRef.current;

        setWithinBounds(pos[0] > (x - extend) * tileSize && pos[0] < (x + extend) * tileSize + tileSize
            && pos[2] > (y - extend) * tileSize && pos[2] < (y + extend) * tileSize + tileSize);
    });

    return (
        <>
            <group>
                {cornField && cornField.length > 0 &&
                    <CornPlantSimple
                        position={[0, 0, 0]}
                        plants={cornField}
                        setPlants={setCornField}
                    />
                }
                {cornField && cornField.map((plant, index) => (
                    <group
                        key={"x: " + plant.position.x + "y: " + plant.position.y + "z: " + plant.position.z + "i: " + index}>
                        {withinBounds && !plant.destroyed &&
                            <Collider
                                key={"collider" + index + plant.position.x + plant.position.z}
                                pos={plant.position}
                                onCollide={() => {
                                    plant.destroyed = true;
                                    setCornField([...cornField]);
                                }}></Collider>
                        }
                        {plant.destroyed &&
                            <>
                                <CornParticles
                                    key={index + "_box"}
                                    position={[plant.position.x, plant.position.y, plant.position.z]}
                                    velocity={[0,0,0]}
                                    scale={[2, 10, 2]}></CornParticles>
                                <CornDestroyed
                                    position={[plant.position.x, plant.position.y, plant.position.z]}
                                    scale={[plant.scale.x, plant.scale.y, plant.scale.z]}
                                    rotation={[plant.rotation.x, plant.rotation.y, plant.rotation.z]}></CornDestroyed>
                            </>
                        }
                    </group>))
                }
            </group>
        </>
    )
}