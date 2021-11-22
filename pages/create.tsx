import { Button, useDisclosure } from "@chakra-ui/react";
import { DanceLight, RoomLight } from "@components/lights";
import { Model } from "@components/model";
import { CameraShake, Loader, OrbitControls } from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import { Leva, useControls } from "leva";
import React, { Suspense, useState } from "react";
import { useStore } from "src/zustand";
import * as THREE from "three";
import { useWindowSize } from "react-use";
import { TrackAndZoom } from "@components/Track";

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

function randomIntFromInterval(min: number, max: number) {
    // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
}

const Create = () => {
    const golfer = useStore();
    useControls(() => ({ ...golfer.levaGolfer }), []);
    const { dancing, setDancing } = golfer;
    const { isOpen, onOpen, onClose } = useDisclosure();
    return (
        <>
            <div style={{ width: "100vw", height: "100vh" }}>
                <div
                    style={{
                        position: "absolute",
                        left: 0,
                        top: 0,
                        zIndex: 9,
                        margin: "10px",
                    }}
                >
                    <Button
                        onClick={() => setDancing(!dancing ?? false)}
                        colorScheme="teal"
                    >
                        <p style={{ marginBottom: "0px" }}>{`Turn Music ${
                            dancing ? "Off" : "On"
                        }`}</p>
                    </Button>
                </div>
                <Leva titleBar={{ title: "What am I like" }} />
                <Canvas shadows camera={{ position: [1, 0.5, 10], fov: 25 }}>
                    <Suspense fallback={null}>
                        {/* <ambientLight intensity={0.5} />
                    <spotLight position={[50, 50, -30]} castShadow /> */}
                        <TrackAndZoom playing={dancing} />

                        <pointLight position={[-10, 10, 5]} intensity={1} />

                        <group position={[0, -1, 0]}>
                            {golfer && <Model />}

                            {/* <Model pose={0} position={[0, 0, 0]} />
                        <Model pose={1} position={[1, 0, -1]} />
                        <Model pose={0} position={[-1, 0, -1]} /> */}
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
                        {/* <Environment preset="studio" /> */}
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
                    <fogExp2 attach="fog" color="black" density={0.02} />
                </Canvas>
                <Loader />
            </div>
        </>
    );
};

export default Create;
