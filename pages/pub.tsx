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

const ROW_LENGTH = 10;
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

function genRand(min: number, max: number, decimalPlaces: number): number {
    const rand =
        Math.random() < 0.5
            ? (1 - Math.random()) * (max - min) + min
            : Math.random() * (max - min) + min; // could be min or max or anything in between
    const power = Math.pow(10, decimalPlaces);
    return Math.floor(rand * power) / power;
}

const getPosition = (index: number) => {
    const position = [
        (index % ROW_LENGTH) +
            (index % ROW_LENGTH) * 1.5 +
            genRand(-0.5, 0.5, 2),
        0,
        Math.floor(index / ROW_LENGTH) +
            Math.floor(index / ROW_LENGTH) * 2 +
            genRand(-0.5, 0.5, 2),
    ];
    return position;
};

const getGroupPosition = (index: number) => {
    const position = [
        (index % 4) + (index % 4) * 6.5 + genRand(-0.2, 0.2, 2),
        0,
        Math.floor(index / 4) +
            Math.floor(index / 4) * 6.5 +
            genRand(-0.2, 0.2, 2),
    ];
    return position;
};

const getPositionInGroup = (index: number, groupLength: number) => {
    if (index !== 4)
        return [
            (index % 2) +
                (index % 2) * (groupLength === 4 ? 1.2 : 1.8) +
                genRand(-0.25, 0.25, 2),
            0,
            Math.floor(index / 2) +
                Math.floor(index / 2) * (groupLength === 4 ? 1.4 : 2.2) +
                genRand(-0.25, 0.25, 2),
        ];
    return [1.5, 0, 1.5];
};

const initaliseGolferList = (
    golfers: Golfer[],
): {
    position: number[];
    golfers: {
        golfer: never;
        position: number[];
    }[];
}[] => {
    const groups = [[]];

    const notAssigned = golfers.filter((golfer) => golfer.group === undefined);

    const inGroups = golfers
        .filter((golfer) => golfer.group !== null || golfer.group !== undefined)
        .sort((a, b) => a?.group - b?.group);

    inGroups.map((golfer: Golfer) => {
        if (golfer.group) {
            console.log(`golfer.group`, golfer.group);
            !groups[golfer.group] && groups.push([]);
            groups[golfer.group].push(golfer);
        }
    });
    const groupsWithPositions = groups
        .filter((group) => group.length)
        .map((group, index) => ({
            position: getGroupPosition(index),
            golfers: group.map((golfer, index) => {
                return {
                    golfer,
                    position: getPositionInGroup(index, group.length),
                };
            }),
        }));
    //console.log("groupsWithPositions :>> ", groupsWithPositions);
    return groupsWithPositions;
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
    //console.log(`data`, data);
    const { dancing } = useStore();
    const [positions, { upsert, push, set }] = useList<{
        position: number[];
        golfers: {
            golfer: never;
            position: number[];
        }[];
    }>();
    useEffect(() => {
        if (data?.allGolfer) {
            const groups = initaliseGolferList(data?.allGolfer);
            set(groups);
            console.log(`groups`, groups);
            /*const notAssigned = data?.allGolfer.filter(
                (golfer) => golfer.group === undefined,
            );
            const inGroups = data?.allGolfer
                .filter((golfer) => golfer.group !== undefined)
                .sort((a, b) => a?.group - b?.group);

            const sorted = data?.allGolfer.sort((a, b) => a?.group - b?.group);
            data?.allGolfer.map((golfer, index) => {
                upsert((a, b) => a.golfer.name === b.golfer.name, {
                    golfer,
                    position: getPosition(index),
                });
            });*/
        }
    }, [data]);
    return (
        <div style={{ width: "100vw", height: "100vh" }}>
            <DanceButton />
            <Canvas shadows camera={{ position: [40, 30, 40], fov: 25 }}>
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

                    <group position={[-8, 0, -12]}>
                        {/*positions &&
                            positions.map(({ golfer, position }, index) => {
                                return (
                                    <Model
                                        golferData={golfer}
                                        position={position}
                                        key={`model ${index}`}
                                    />
                                );
                            })*/}
                        {positions &&
                            positions.map((group, index) => {
                                return (
                                    <group position={group.position}>
                                        {group.golfers.map((golfer) => (
                                            <Model
                                                golferData={golfer.golfer}
                                                position={golfer.position}
                                                key={`model ${index} - ${golfer.position}`}
                                            />
                                        ))}
                                    </group>
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
