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

import { SkinnedMesh } from "./skinnedMesh";
import { useStore } from "src/zustand";
import { Golfer } from "@interfaces/model";
const hiddenNodes = ["Ch33_Eyelashes", "Ch33_Belt"];
const nonTextured = [
    "Ch33_Tie",
    "Ch33_Shirt",
    "Ch33_Hair",
    "Ch33_Suit",
    "Ch33_Shoes",
    "Ch33_Pants",
];

const getTieColour = (year: number | undefined) => {
    let colour = "blue";
    switch (year) {
        case -1:
            colour = "blue";
            break;
        case 0:
            colour = "blue";
            break;
        case 1:
            colour = "blue";
            break;
        case 2:
            colour = "#1b2c19";
            break;
        case 3:
            colour = "#920619";
            break;
        case 4:
            colour = "#000000";
            break;
        case 5:
            colour = "#e29ac7";
            break;
        case 6:
            colour = "blue";
            break;
        case 7:
            colour = "#e96c33";
            break;
        case 8:
            colour = "#380e6e";
            break;
        case 9:
            colour = "#d8d51b";
            break;
        case 10:
            colour = "#8adf62";
            break;
        case 11:
            colour = "blue";
            break;
        case 12:
            colour = "blue";
            break;
    }
    return colour;
};

const NameCard: React.FC<{ name: string }> = ({ name }) => (
    <group
    //onPointerOver={() => setHovered(true)}
    //onPointerOut={() => setHovered(false)}
    >
        <a.mesh receiveShadow position={[0, 2.5, 0]}>
            <a.meshStandardMaterial color={"#fefefe"} />
            <Html distanceFactor={10}>
                <Box position="relative">
                    <Box
                        background="#dedede"
                        p={10}
                        position="relative"
                        left="-50%"
                        cursor="pointer"
                        //onClick={() => setIndex((index + 1) % names.length)}
                        whiteSpace="nowrap"
                        borderRadius="5px"
                    >
                        <span>{name}</span>
                    </Box>
                </Box>
            </Html>
        </a.mesh>
    </group>
);

export const Model: React.FC<{ golferData: Golfer; position: number[] }> = ({
    golferData,
    position,
}) => {
    console.log(`golferData`, golferData);
    const golfer = useStore();
    const {
        name,
        year = 0,
        skinColour = "#ffffff",
        hairColour = "#000000",
        jacketColour = "#000000",
        shirtColour = "#ffffff",
        trouserColour = "#000000",
        shoeColour = "#000000",
        favouriteMove = 4,
        idle = 0,
    } = golferData ?? golfer.golfer;
    const { dancing = false } = golfer;
    // Fetch model and a separate texture
    const { scene, animations } = useGLTF("/drunkManAllMoves.gltf");
    const clone = useMemo(() => SkeletonUtils.clone(scene), [scene]);
    const { nodes } = useGraph(clone);
    const textures = [
        useTexture("/Ch33_1001_Diffuse_greenJPG.jpg"),
        useTexture("/Ch33_1001_DiffuseJPG.jpg"),
    ];
    // Extract animation actions
    const { ref, actions, names } = useAnimations(animations);
    // Hover and animation-index states
    const [hovered, setHovered] = useState(false);
    const [index, setIndex] = useState(0);
    useEffect(() => {
        dancing ? setIndex(favouriteMove) : setIndex(idle);
    }, [dancing, favouriteMove, idle]);
    // Animate the selection halo
    const { color } = useSpring({
        color: hovered ? "hotpink" : "aquamarine",
    });

    const setColor = (key: string | undefined): string | undefined => {
        if (key === "Ch33_Tie") return getTieColour(year);
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
        <group ref={ref} dispose={null} position={position}>
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

            {name && <NameCard name={name} />}
        </group>
    );
};
