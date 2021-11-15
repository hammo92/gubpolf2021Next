import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Button,
    Checkbox,
    Input,
    Box,
    Select,
    Text,
    Grid,
} from "@chakra-ui/react";
import React from "react";
import { useForm, Controller } from "react-hook-form";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

import axios from "axios";

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
);

const createCheckOutSession = async (item) => {
    const stripe = await stripePromise;
    const checkoutSession = await axios.post("/api/create-stripe-session", {
        item: item,
    });
    const result = await stripe.redirectToCheckout({
        sessionId: checkoutSession.data.id,
    });
    if (result.error) {
        alert(result.error.message);
    }
};

export const PaymentModal = ({ isOpen, onOpen, onClose }) => {
    const { control, handleSubmit } = useForm();
    const onSubmit = async (data) => {
        const item = {
            name: "green fee",
            price: 15,
            quantity: 1,
            description: "stash fund",
        };
        createCheckOutSession(item);
    };
    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Pay Green Fee</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <Grid
                                templateColumns="min-content auto"
                                gridGap="10px"
                            >
                                <Controller
                                    name="firstName"
                                    control={control}
                                    defaultValue=""
                                    render={({ field }) => (
                                        <>
                                            <span>Name</span>
                                            <Input
                                                {...field}
                                                placeholder="Perminder Perminder"
                                            />
                                        </>
                                    )}
                                />
                                <Controller
                                    name="iceCreamType"
                                    control={control}
                                    render={({ field }) => (
                                        <>
                                            <Text>Tie</Text>
                                            <Select
                                                placeholder="Select option"
                                                {...field}
                                            >
                                                <option value="noTie">
                                                    Already have a tie
                                                </option>
                                                <option value="needTie">
                                                    Need a tie
                                                </option>
                                            </Select>
                                        </>
                                    )}
                                />
                            </Grid>
                            <input type="submit" />
                        </form>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
};
