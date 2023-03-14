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
    const {playerPos} = props;

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

    useEffect(() => {
        const extend = 1;
        setWithinBounds(playerPos[0] > (x - extend) * tileSize && playerPos[0] < (x + extend) * tileSize + tileSize
            && playerPos[2] > (y - extend) * tileSize && playerPos[2] < (y + extend) * tileSize + tileSize);
    }, [playerPos]);

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
                       
                    </group>))
                }
            </group>
        </>
    )
}