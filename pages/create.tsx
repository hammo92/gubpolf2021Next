import { Spacer, Flex } from "@chakra-ui/react";
import * as THREE from "three";
import React, { Suspense, useState, useRef, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import Model from "@components/Model";
import { OrbitControls, CameraShake, Environment } from "@react-three/drei";
import { GraphQLClient } from "graphql-request";
import { useGet_GolfersQuery, Golfers } from "@generated/graphql";

interface GolferModel {
    golfer: Golfers;
    position: number[];
    pose: number;
}

const ROW_LENGTH = 16;
const POSES_AMOUNT = 7;

function Rig() {
    const [vec] = useState(() => new THREE.Vector3());
    const { camera, mouse } = useThree();
    /*useFrame(() =>
        camera.position.lerp(
            vec.set(mouse.x * 2 + 10, mouse.y * 2 + 10, 20),
            0.05
        )
    );*/
    camera.rotation.x = -0.5;
    camera.rotation.y = 0.4;
    camera.rotation.z = 0.2;

    //useFrame(() => camera.rotation.lerp(vec.set(mouse.x * 1, 0, 0), 0.05));
    return (
        <>
            <CameraShake
                maxYaw={0.01}
                maxPitch={0.01}
                maxRoll={0.01}
                yawFrequency={0.5}
                pitchFrequency={0.5}
                rollFrequency={0.4}
            />
        </>
    );
}

function Light() {
    const ref = useRef<{ rotation: { x: number } }>();
    useFrame((_) => ref && (ref.current.rotation.x = _.clock.elapsedTime));
    return (
        <group ref={ref}>
            <rectAreaLight
                width={15}
                height={100}
                position={[30, 30, -10]}
                intensity={5}
                onUpdate={(self) => self.lookAt(0, 0, 0)}
            />
        </group>
    );
}

const Create = () => {
    const array = [1, 2, 3, 4, 5, 6, 7, 3, 1, 2, 1, 2, 3, 4, 5, 6, 7, 3, 1, 2];
    const [golfers, setGolfers] = useState<GolferModel[]>();
    const graphQlClient = new GraphQLClient(
        `https://norcross.stepzen.net/golfers/sheet/__graphql`,
        {
            headers: {
                Authorization:
                    "apikey norcross::stepzen.net+1000::cd1953dda138553df888616dabd088bc453eb0a030eaac6f7bb99ed7a94bb7a6",
            },
        },
    );
    const { data } = useGet_GolfersQuery(graphQlClient, {});
    useEffect(() => {
        const golferArray = [];
        data &&
            data.golfers
                .filter((golfer) => golfer.attending__D === "Yes")
                .forEach((golfer, index) => {
                    const position = [
                        (index % ROW_LENGTH) +
                            (index % ROW_LENGTH) * 1.2 +
                            Math.floor(Math.random() * (0.1 - -0.1 + 1) + -0.1),
                        0,
                        Math.floor(index / ROW_LENGTH) +
                            Math.floor(index / ROW_LENGTH) * 1.2 +
                            Math.floor(Math.random() * (0.1 - -0.1 + 1) + -0.1),
                    ];
                    const pose = Math.floor(Math.random() * POSES_AMOUNT);
                    golferArray.push({ golfer, position, pose });
                });
        setGolfers(golferArray);
    }, [data]);
    return (
        <div style={{ width: "100vw", height: "100vh" }}>
            <Canvas shadows camera={{ position: [1, 1.5, 15], fov: 50 }}>
                <Suspense fallback={null}>
                    <ambientLight intensity={0.5} />
                    <spotLight position={[50, 50, -30]} castShadow />

                    <pointLight position={[0, -5, 5]} intensity={0.5} />

                    <group position={[0, -1, 0]}>
                        {golfers &&
                            golfers.map(({ golfer, position, pose }, index) => {
                                return (
                                    <Model
                                        pose={pose}
                                        position={position}
                                        modelIndex={index}
                                        golfer={golfer}
                                        key={`model ${index}`}
                                    />
                                );
                            })}
                        {/* <Model pose={0} position={[0, 0, 0]} />
                        <Model pose={1} position={[1, 0, -1]} />
                        <Model pose={0} position={[-1, 0, -1]} /> */}
                    </group>
                    <mesh
                        rotation={[-0.5 * Math.PI, 0, 0]}
                        position={[0, -1, 0]}
                        receiveShadow
                    >
                        <planeBufferGeometry args={[150, 50, 1, 1]} />
                        <shadowMaterial transparent opacity={0.2} />
                        <meshStandardMaterial color="#040314" />
                    </mesh>
                    <Environment preset="warehouse" />
                    <Light />
                    <Rig />
                    <OrbitControls
                        enablePan={true}
                        enableZoom={true}
                        enableRotate={true}
                        addEventListener={undefined}
                        hasEventListener={undefined}
                        removeEventListener={undefined}
                        dispatchEvent={undefined}
                    />
                </Suspense>
            </Canvas>
        </div>
    );
};

export default Create;
