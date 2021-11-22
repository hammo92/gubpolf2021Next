import { useFrame } from "@react-three/fiber";
import React, { useRef } from "react";

const lightColours = [
    [7, 240, 205],
    [4, 42, 217],
    [219, 87, 250],
];

const lightColours2 = [
    [4, 42, 217],
    [7, 240, 205],
    [219, 87, 250],
];

export const DanceLight: React.FC<{ dancing: boolean | undefined }> = ({
    dancing = false,
}) => {
    const ref = useRef<{ rotation: { x: number } }>({ rotation: { x: 0 } });
    const light = useRef();
    const light2 = useRef();
    useFrame(
        (_) => {
            const lightIndex = Math.floor(
                _.clock.elapsedTime % lightColours.length,
            );
            const lightColourArray = lightColours[lightIndex];
            const lightColourArray2 = lightColours2[lightIndex];
            light && dancing
                ? light?.current?.color?.setRGB(
                      lightColourArray[0],
                      lightColourArray[1],
                      lightColourArray[2],
                  )
                : light?.current?.color?.setRGB(255, 255, 255);
            light2 && dancing
                ? light2?.current?.color?.setRGB(
                      lightColourArray2[0],
                      lightColourArray2[1],
                      lightColourArray2[2],
                  )
                : light2?.current?.color?.setRGB(255, 255, 255);
            light && dancing && (ref.current.rotation.y = _.clock.elapsedTime);
        },
        //lightColours[Math.floor(_.clock.elapsedTime % lightColours.length)],
    );
    return (
        <group ref={ref}>
            <spotLight
                ref={light}
                position={[30, 30, 0]}
                intensity={0.2}
                onUpdate={(self) => self.lookAt(0, 0, 0)}
                penumbra={1}
                decay={100}
                distance={1500}
            />
            <spotLight
                ref={light2}
                position={[-10, 30, 0]}
                intensity={0.1}
                onUpdate={(self) => self.lookAt(0, 0, 0)}
                penumbra={1}
                decay={100}
                distance={1500}
            />
        </group>
    );
};

export const RoomLight: React.FC<{ dancing: boolean | undefined }> = ({
    dancing = false,
}) => {
    const light = useRef();
    useFrame((_) => {
        if (light.current) {
            dancing
                ? (light.current.intensity = 0)
                : (light.current.intensity = 1);
        }
        //lightColours[Math.floor(_.clock.elapsedTime % lightColours.length)],
    });
    return (
        <group>
            {/* <spotLight
                position={[30, 30, 0]}
                intensity={0.2}
                onUpdate={(self) => self.lookAt(0, 0, 0)}
                penumbra={1}
                decay={100}
                distance={1500}
            /> */}
            <ambientLight ref={light} />
        </group>
    );
};
