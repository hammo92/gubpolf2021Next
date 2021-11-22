import { Flex, Heading, Text, Button, Box } from "@chakra-ui/react";
import React from "react";
import { useRouter } from "next/router";
import Countdown, { zeroPad } from "react-countdown";

const dateRenderer = ({ days, hours, minutes, seconds }) => (
    <span>
        {`${zeroPad(days)} Days, ${zeroPad(hours)} Hours, ${zeroPad(
            minutes,
        )} Minutes, ${zeroPad(seconds)} Seconds `}
    </span>
);

const Home: React.FC = () => {
    const router = useRouter();
    return (
        <Box width="100vw" height="100vh" background="#000801">
            <Flex
                direction="column"
                alignItems="center"
                height="100%"
                justifyContent="center"
            >
                <Heading color="#fefefe">Welcome to Gub Polf 2021</Heading>
                <Text fontSize="3xl" color="#ffffff">
                    <Countdown
                        date={new Date("December 23, 2021 18:30:00")}
                        renderer={dateRenderer}
                    />
                </Text>
                <Button
                    onClick={() => router.push("/create")}
                    colorScheme="teal"
                >
                    Sign up
                </Button>
            </Flex>
        </Box>
    );
};

export default Home;
