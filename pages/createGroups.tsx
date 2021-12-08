import React from "react";
import Div100vh from "react-div-100vh";
import { Center, Button } from "@chakra-ui/react";
const CreateGroups = () => {
    const generate = async () => {
        await fetch("/api/create-groups");
    };
    return (
        <Div100vh>
            <Center height="100%">
                <Button onClick={() => generate()} colorScheme="teal">
                    Generate Groups
                </Button>
                {/* <Button
                    onClick={async () => fetch("/api/add-golfer-to-group")}
                    colorScheme="teal"
                >
                    Assign Extras
                </Button> */}
            </Center>
        </Div100vh>
    );
};

export default CreateGroups;
