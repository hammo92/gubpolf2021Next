import React, { useState, useEffect } from "react";
import Div100vh from "react-div-100vh";
import {
    Center,
    Button,
    Flex,
    Box,
    Spacer,
    Heading,
    Text,
    SimpleGrid,
} from "@chakra-ui/react";
import { GraphQLClient } from "graphql-request";
import { Golfer, useGet_GolfersQuery } from "@generated/graphql";
import { useRouter } from "next/router";
import Link from "next/link";

const CreateGroupList = (golfers: Golfer[]): Golfer[][] => {
    const groups = [[]];
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
    //console.log("groupsWithPositions :>> ", groupsWithPositions);
    return groups;
};

const Groups = () => {
    const router = useRouter();
    const graphQlClient = new GraphQLClient(
        "https://5rziby0p.api.sanity.io/v1/graphql/production/default",
    );
    const { data } = useGet_GolfersQuery(
        graphQlClient,
        {},
        { refetchInterval: 5000 },
    );
    console.log("data", data);
    const [groups, setGroups] = useState<Golfer[][]>();
    useEffect(() => {
        data && setGroups(CreateGroupList(data.allGolfer));
    }, [data]);

    return (
        <Div100vh>
            <Flex direction="column" p={3} bg="#171923">
                <Heading pb={1} fontSize="6xl" textAlign="center">
                    Groups
                </Heading>
                <Box textAlign="center" textDecoration="underline">
                    <Link href="/pub">Enter the pub</Link>
                </Box>
                <SimpleGrid columns={[2, null, 3]} spacing="20px" py={5}>
                    {groups &&
                        groups
                            .filter((group) => group.length)
                            .map((group, index) => {
                                return (
                                    <Flex
                                        direction="column"
                                        bg="#22543D"
                                        borderRadius={5}
                                        overflow="hidden"
                                    >
                                        <Box bg="#183b2b" fill p={3}>
                                            <Heading pb={2}>{`# ${
                                                index + 1
                                            }`}</Heading>
                                        </Box>
                                        <Box px={3} pt={2}>
                                            {group.map((golfer) => (
                                                <Text fontSize="lg">
                                                    {golfer.name}
                                                </Text>
                                            ))}
                                        </Box>
                                    </Flex>
                                );
                            })}
                </SimpleGrid>
            </Flex>
            {/* <Button
                    onClick={async () => fetch("/api/add-golfer-to-group")}
                    colorScheme="teal"
                >
                    Assign Extras
                </Button> */}
        </Div100vh>
    );
};

export default Groups;
