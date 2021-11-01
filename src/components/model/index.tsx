/*
This file was generated by https://github.com/pmndrs/gltfjsx and then
customized manually. It uses drei's new useAnimations hook which extracts
all actions and sets up a THREE.AnimationMixer for it so that you don't have to.
All of the assets actions, action-names and clips are available in its output. 
*/
import { Spacer, Flex, Box } from "@chakra-ui/react";
import React, { useEffect, useState, useMemo, useCallback } from "react";
import {
    useGLTF,
    useTexture,
    useCursor,
    useAnimations,
    useSimplification,
    Html,
} from "@react-three/drei";
import { useGraph } from "@react-three/fiber";
import { a, useSpring } from "@react-spring/three";
import { SkeletonUtils } from "three-stdlib";
import { ModelProps } from "@interfaces/model";
import { SkinnedMesh } from "./skinnedMesh";
const hiddenNodes = ["Ch33_Eyelashes", "Ch33_Belt"];
const nonTextured = [
    "Ch33_Tie",
    "Ch33_Shirt",
    "Ch33_Hair",
    "CH33_Suit",
    "Ch33_Shoes",
    "Ch33_pants",
];

export const Model: React.FC<ModelProps> = ({
    pose = 0,
    modelIndex = 0,
    golfer,
    shirtColour = "white",
    trouserColour = "black",
    jacketColour = "black",
    hairColour = "black",
    shoeColour = "brown",
    skinColour = "#000000",
    dancing = false,
    ...props
}) => {
    // Fetch model and a separate texture
    const { scene, animations } = useGLTF("/drunkMan.glb");
    const clone = useMemo(() => SkeletonUtils.clone(scene), [scene]);

    const { nodes } = useGraph(clone);
    console.log(`nodes`, nodes);
    const textures = [
        useTexture("/Ch33_1001_Diffuse_green.png"),
        useTexture("/Ch33_1001_Diffuse2.png"),
    ];
    // Extract animation actions
    const { ref, actions, names } = useAnimations(animations);
    // Hover and animation-index states
    const [hovered, setHovered] = useState(false);
    const [index, setIndex] = useState(0);
    useEffect(() => {
        dancing ? setIndex(pose) : setIndex(0);
    }, [dancing, pose]);
    // Animate the selection halo
    const { color } = useSpring({
        color: hovered ? "hotpink" : "aquamarine",
    });
    const setColor = (key: string): string => {
        if (key === "Ch33_Tie") return "green";
        if (key === "Ch33_Shirt") return shirtColour;
        if (key === "Ch33_Pants") return trouserColour;
        if (key === "Ch33_Suit") return jacketColour;
        if (key === "Ch33_Hair") return hairColour;
        if (key === "Ch33_Shoes") return shoeColour;
        if (key === "Ch33_Body") return skinColour;
        return "";
    };

    // Change cursor on hover-state
    useCursor(hovered);
    // Change animation when the index changes

    useEffect(() => {
        // Reset and fade in animation after an index has been changed
        actions[names[index]]?.reset().fadeIn(0.5).play();
        // In the clean-up phase, fade it out
        return () => {
            actions[names[index]]?.fadeOut(0.5);
        };
    }, [index, actions, names]);
    return (
        <group ref={ref} {...props} dispose={null}>
            <group rotation={[Math.PI / 2, 0, 0]} scale={[0.01, 0.01, 0.01]}>
                <primitive object={nodes.mixamorig7Hips} />
                {Object.keys(nodes).map((nodeKey) => {
                    const node = nodes[nodeKey];
                    if (
                        node.type === "SkinnedMesh" &&
                        !hiddenNodes.includes(nodeKey)
                    )
                        return (
                            <SkinnedMesh node={node}>
                                <meshStandardMaterial
                                    map={
                                        nonTextured.includes(nodeKey)
                                            ? null
                                            : textures[1]
                                    }
                                    color={setColor(nodeKey)}
                                    map-flipY={
                                        nonTextured.includes(nodeKey)
                                            ? undefined
                                            : false
                                    }
                                />
                            </SkinnedMesh>
                        );
                })}
            </group>
            {golfer && (
                <group
                    onPointerOver={() => setHovered(true)}
                    onPointerOut={() => setHovered(false)}
                >
                    <a.mesh receiveShadow position={[0, 2.5, 0]}>
                        <a.meshStandardMaterial color={color} />
                        <Html distanceFactor={10}>
                            <Box position="relative">
                                <Box
                                    background="#dedede"
                                    p={10}
                                    position="relative"
                                    left="-50%"
                                    cursor="pointer"
                                    onClick={() =>
                                        setIndex((index + 1) % names.length)
                                    }
                                    whiteSpace="nowrap"
                                    borderRadius="5px"
                                >
                                    <span>{`${golfer.firstName__B} ${golfer.secondName__A}`}</span>
                                </Box>
                            </Box>
                        </Html>
                    </a.mesh>
                </group>
            )}
        </group>
    );
};
