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
import { Golfer, useGet_GolfersQuery } from "@generated/graphql";
import { DanceLight, RoomLight } from "@components/lights";
import { useStore } from "src/zustand";
import { DanceButton } from "@components/danceButton";
import { useList } from "react-use";
import { useControls } from "leva";

const ROW_LENGTH = 16;
const POSES_AMOUNT = 7;

function Rig() {
    const [vec] = useState(() => new THREE.Vector3());
    const { camera, mouse } = useThree();
    /*const { x, y, z } = useControls({
        x: -0.3,
        y: 0.6,
        z: 0.2,
    });
    useEffect(() => {
        camera.rotation.x = x;
        camera.rotation.y = y;
        camera.rotation.z = z;
    }, [x, y, z]);*/

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
            Math.floor(Math.random() * (0.05 - -0.05 + 1) + -0.05),
        0,
        Math.floor(index / ROW_LENGTH) +
            Math.floor(index / ROW_LENGTH) * 1.2 +
            Math.floor(Math.random() * (0.05 - -0.05 + 1) + -0.05),
    ];
    return position;
};

const Club = () => {
    const graphQlClient = new GraphQLClient(
        "https://5rziby0p.api.sanity.io/v1/graphql/production/default",
    );
    const { data } = useGet_GolfersQuery(
        graphQlClient,
        {},
        { refetchInterval: 5000 },
    );
    const { dancing } = useStore();
    const [positions, { upsert, push }] = useList<{
        golfer: Golfer;
        position: number[];
    }>();
    useEffect(() => {
        if (data?.allGolfer) {
            data?.allGolfer.map((golfer, index) => {
                upsert((a, b) => a.golfer.name === b.golfer.name, {
                    golfer,
                    position: getPosition(index),
                });
            });
        }
    }, [data]);
    return (
        <div style={{ width: "100vw", height: "100vh" }}>
            <DanceButton />
            <Canvas shadows camera={{ position: [30, 10, 30], fov: 25 }}>
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

                    <group position={[-8, -1, 0]}>
                        {positions &&
                            positions.map(({ golfer, position }, index) => {
                                return (
                                    <Model
                                        golferData={golfer}
                                        position={position}
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
