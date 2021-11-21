import { Spacer, Flex, Button } from "@chakra-ui/react";
import * as THREE from "three";
import React, { Suspense, useState, useRef, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Model } from "@components/model";
import { OrbitControls, CameraShake, Environment } from "@react-three/drei";
import { GraphQLClient } from "graphql-request";
import { useGet_GolfersQuery } from "@generated/graphql";
import { DanceLight, RoomLight } from "@components/lights";
import { useStore } from "src/zustand";

const ROW_LENGTH = 16;
const POSES_AMOUNT = 7;

function Rig() {
    const [vec] = useState(() => new THREE.Vector3());
    const { camera, mouse } = useThree();
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

const getPosition = (index) => {
    const position = [
        (index % ROW_LENGTH) +
            (index % ROW_LENGTH) * 1.2 +
            Math.floor(Math.random() * (0.1 - -0.1 + 1) + -0.1),
        0,
        Math.floor(index / ROW_LENGTH) +
            Math.floor(index / ROW_LENGTH) * 1.2 +
            Math.floor(Math.random() * (0.1 - -0.1 + 1) + -0.1),
    ];
    return position;
};

const Club = () => {
    const graphQlClient = new GraphQLClient(
        "https://5rziby0p.api.sanity.io/v1/graphql/production/default",
    );
    const { data } = useGet_GolfersQuery(graphQlClient, {});
    const { dancing, setDancing } = useStore();
    const positions = useRef([[0, 0, 0]]);
    useEffect(() => {
        if (data?.allGolfer) {
            positions.current = data?.allGolfer.map((golfer, index) =>
                getPosition(index),
            );
        }
    }, [data]);
    return (
        <div style={{ width: "100vw", height: "100vh" }}>
            <div
                style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    zIndex: 999999,
                    margin: "10px",
                }}
            >
                <Button onClick={() => setDancing(!dancing ?? false)}>
                    <p style={{ marginBottom: "5px" }}>{`Turn Music ${
                        dancing ? "Off" : "On"
                    }`}</p>
                </Button>
            </div>
            <Canvas shadows camera={{ position: [1, 1.5, 15], fov: 50 }}>
                <Suspense fallback={null}>
                    <pointLight position={[-10, 10, 5]} intensity={1} />

                    <group position={[0, -1, 0]}>
                        {data?.allGolfer &&
                            data?.allGolfer.map((golfer, index) => {
                                console.log(
                                    "getPosition(index) :>> ",
                                    getPosition(index),
                                );
                                return (
                                    <Model
                                        golferData={golfer}
                                        position={positions.current[index]}
                                        key={`model ${index}`}
                                    />
                                );
                            })}
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
                    <DanceLight dancing={dancing} />
                    <RoomLight dancing={dancing} />
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

export default Club;
