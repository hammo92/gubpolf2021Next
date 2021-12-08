import React, { useState, useEffect } from "react";
import { useStore } from "src/zustand";
import axios from "axios";
import { useLocalStorage } from "react-use";
import { Box, Center, Heading, Text, Flex, Button } from "@chakra-ui/react";
import { useRouter } from "next/router";

const PaymentSuccess: React.FC = () => {
    const router = useRouter();
    const [golfer, setGolfer] = useState();
    const [error, setError] = useState();
    const [golferAdded, setGolferAdded] = useState(false);
    useEffect(() => {
        const golfer = localStorage.getItem("golfer");
        const stripeSessionId = localStorage.getItem("stripeSessionId");
        console.log("golfer :>> ", golfer);
        setGolfer(JSON.parse(golfer));
        if (stripeSessionId) {
            if (golfer) {
                (async () => {
                    console.log("adding");
                    const add = await axios.post("/api/create-golfer", {
                        stripeSessionId,
                        golfer: JSON.parse(golfer),
                    });
                    await fetch("/api/add-golfer-to-group");
                    localStorage.removeItem("stripeSessionId");
                    console.log("removed");
                    setGolferAdded(true);
                })();
            }
        } else {
            setGolferAdded(true);
        }
    }, []);
    return (
        <Box
            width="100vw"
            height="100vh"
            display="flex"
            alignItems="center"
            justifyContent="center"
            flexDirection="column"
        >
            <Heading color="#fefefe">{`Thanks for your payment ${
                golfer ? golfer.name : ""
            }`}</Heading>
            {!golferAdded === "loading" ? (
                <Text fontSize="3xl" color="#ffffff">
                    Just adding you to the list...
                </Text>
            ) : (
                <Flex direction="column">
                    <Text fontSize="3xl" color="#ffffff">
                        You're on the list, enter the pub
                    </Text>
                    <Button
                        onClick={() => router.push("/pub")}
                        colorScheme="teal"
                    >
                        Enter the Pub
                    </Button>
                </Flex>
            )}
        </Box>
    );
};

export default PaymentSuccess;
