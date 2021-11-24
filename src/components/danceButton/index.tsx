import { Button, Text, Flex } from "@chakra-ui/react";
import React, { useState } from "react";
import { useStore } from "src/zustand";

export const DanceButton = () => {
    const { dancing, setDancing, setAudio, audio } = useStore();
    const [loading, setLoading] = useState(false);
    return (
        <div
            style={{
                position: "fixed",
                left: 0,
                top: 0,
                zIndex: 9,
                margin: "10px",
            }}
        >
            <Button
                onClick={async () => {
                    setLoading(true);
                    if (!audio) {
                        await setAudio();
                    } else {
                        setDancing(!dancing ?? false);
                    }
                    setLoading(false);
                }}
                colorScheme="teal"
            >
                <Flex direction="column" alignContent="center">
                    <p style={{ marginBottom: "0px" }}>
                        {!loading
                            ? audio
                                ? `Turn Music ${dancing ? "Off" : "On"}`
                                : "Load Audio"
                            : "loading"}
                    </p>
                </Flex>
            </Button>
            <Text fontSize="xs" textAlign="center">
                {audio ? "Needs to be on to dance..." : "Load up a tune"}
            </Text>
        </div>
    );
};
