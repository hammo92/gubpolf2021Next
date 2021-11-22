import { Spacer, Flex, Button } from "@chakra-ui/react";
import * as THREE from "three";
import React, { Suspense, useState, useRef, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Model } from "@components/model";
import { Track, Zoom, TrackAndZoom } from "@components/Track";
import {
    OrbitControls,
    CameraShake,
    Environment,
    Loader,
    PerspectiveCamera,
} from "@react-three/drei";
import { GraphQLClient } from "graphql-request";
import { useGet_GolfersQuery } from "@generated/graphql";
import { DanceLight, RoomLight } from "@components/lights";
import { useStore } from "src/zustand";
import { DanceButton } from "@components/danceButton";

const ROW_LENGTH = 16;
const POSES_AMOUNT = 7;

function Rig() {
    const [vec] = useState(() => new THREE.Vector3());
    const { camera, mouse } = useThree();
    console.log("camera :>> ", camera);
    camera.rotation.x = -0.5;
    camera.rotation.y = 0.4;
    camera.rotation.z = 0.2;
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
    const { dancing, setDancing, audio, setAudio } = useStore();
    const [positions, setPositions] = useState([[0, 0, 0]]);
    useEffect(() => {
        if (data?.allGolfer) {
            const pos = data?.allGolfer.map((golfer, index) =>
                getPosition(index),
            );
            setPositions(pos);
        }
    }, [data]);
    return (
        <div style={{ width: "100vw", height: "100vh" }}>
            <DanceButton />
            <Canvas shadows camera={{ position: [20, 10, 15], fov: 25 }}>
                <Suspense fallback={null}>
                    {/* <Track
                        url="/September.mp3"
                        position-z={-50}
                        y={10}
                        height={30}
                        width={10}
                        space={1.2}
                    />
                    <Zoom url="/September.mp3" /> */}
                    <TrackAndZoom playing={dancing} />

                    <pointLight position={[0, 10, 10]} intensity={1} />

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
                                        position={positions[index]}
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
                        <planeBufferGeometry args={[500, 500, 1, 1]} />
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
                <fogExp2 attach="fog" color="black" density={0.005} />
            </Canvas>
            <Loader />
        </div>
    );
};

export default Club;
