import * as THREE from "three";
import { Suspense, useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useAsset } from "use-asset";
import { useStore } from "src/zustand";

export const TrackAndZoom: React.FC<{ playing: boolean }> = ({
    playing = false,
}) => {
    const { audio, setAudio } = useStore();
    return (
        <Suspense fallback={null}>
            {audio && (
                <>
                    <Track
                        audio={audio}
                        position-z={-20}
                        y={40}
                        height={15}
                        width={10}
                        space={1.5}
                        playing={playing}
                    />
                    <Zoom url="/September.mp3" />
                </>
            )}
        </Suspense>
    );
};

interface TrackProps {
    audio: unknown;
    y?: number;
    space?: number;
    width?: number;
    height?: number;
    obj?: THREE.Object3D;
    playing?: boolean;
}

export const Track: React.FC<TrackProps> = ({
    audio,
    y = 2500,
    space = 1.8,
    width = 0.01,
    height = 0.05,
    obj = new THREE.Object3D(),
    playing = false,
    ...props
}) => {
    const ref = useRef();
    // use-asset is the library that r3f uses internally for useLoader. It caches promises and
    // integrates them with React suspense. You can use it as-is with or without r3f.
    const { gain, context, update, data } = audio;

    const barDimensions = playing ? [width, height, 5] : [0, 0, 0];
    useEffect(() => {
        // Connect the gain node, which plays the audio
        playing ? gain.connect(context.destination) : gain.disconnect();
        // Disconnect it on unmount
        return () => gain.disconnect();
    }, [gain, context, playing]);

    useFrame((state) => {
        const avg = update();
        // Distribute the instanced planes according to the frequency daza
        for (let i = 0; i < data.length; i++) {
            obj.position.set(
                i * width * space - (data.length * width * space) / 2,
                data[i] / y,
                0,
            );
            obj.updateMatrix();
            ref.current.setMatrixAt(i, obj.matrix);
        }
        // Set the hue according to the frequency average
        ref.current.material.color.setHSL(avg / 500, 0.75, 0.75);
        ref.current.instanceMatrix.needsUpdate = true;
    });
    return (
        <>
            <instancedMesh
                castShadow
                ref={ref}
                args={[null, null, data.length]}
                {...props}
            >
                <boxGeometry args={barDimensions} />
                <meshBasicMaterial toneMapped={false} />
            </instancedMesh>
        </>
    );
};

const Zoom: React.FC<{ url: string; playing: boolean }> = ({
    url,
    playing = false,
}) => {
    // This will *not* re-create a new audio source, suspense is always cached,
    // so this will just access (or create and then cache) the source according to the url
    const { data } = useAsset(() => createAudio(url), url);
    return useFrame((state) => {
        // Set the cameras field of view according to the frequency average
        state.camera.fov = 25 - (playing ? data.avg / 100 : 0);
        state.camera.updateProjectionMatrix();
    });
};

export async function createAudio(url) {
    // Fetch audio data and create a buffer source

    const res = await fetch(url);
    const buffer = await res.arrayBuffer();
    const context = new (window.AudioContext || window.webkitAudioContext)();
    const source = context.createBufferSource();
    source.buffer = await new Promise((res) =>
        context.decodeAudioData(buffer, res),
    );
    source.loop = true;
    // This is why it doesn't run in Safari ????????. Start has to be called in an onClick event
    // which makes it too awkward for a little demo since you need to load the async data first
    source.start(0);
    // Create gain node and an analyser
    const gain = context.createGain();
    const analyser = context.createAnalyser();
    analyser.fftSize = 64;
    source.connect(analyser);
    analyser.connect(gain);
    // The data array receive the audio frequencies
    const data = new Uint8Array(analyser.frequencyBinCount);
    return {
        context,
        source,
        gain,
        data,
        // This function gets called every frame per audio source
        update: () => {
            analyser.getByteFrequencyData(data);
            // Calculate a frequency average
            return (data.avg = data.reduce(
                (prev, cur) => prev + cur / data.length,
                0,
            ));
        },
    };
}
