import create from "zustand";
import { ModelProps, Golfer, LevaGolfer, Store } from "@interfaces/model";
import { folder, button, buttonGroup } from "leva";
import produce from "immer";
import { Get_GolfersDocument } from "@generated/graphql";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";

const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
);

const createCheckOutSession = async (items, golfer) => {
    const stripe = await stripePromise;
    const checkoutSession = await axios.post("/api/create-stripe-session", {
        items: items,
    });
    localStorage.setItem("stripeSessionId", checkoutSession.data.id);
    localStorage.setItem("golfer", JSON.stringify(golfer));
    const result = await stripe.redirectToCheckout({
        sessionId: checkoutSession.data.id,
    });
    if (result.error) {
        alert(result.error.message);
    }
};

export const useStore = create<Store>((set, get) => ({
    golfer: {
        name: "",
        favouriteMove: 1,
        idle: 5,
        hairColour: "black",
        jacketColour: "black",
        tieNeeded: false,
        shirtColour: "white",
        shoeColour: "black",
        skinColour: "black",
        trouserColour: "black",
        year: 1,
    },
    stripeSessionId: "",
    dancing: false,
    setDancing: (value: boolean) => set((state) => (state.dancing = value)),
    levaGolfer: {
        name: {
            value: "",
            label: "Name",
            onChange: (value: string) =>
                set(
                    produce((state) => {
                        state.golfer.name = value;
                    }),
                ),
        },
        year: {
            value: 0,
            label: "Year",
            min: -1,
            max: 12,
            step: 1,
            onChange: (value: number) =>
                set(
                    produce((state) => {
                        state.golfer.year = value;
                    }),
                ),
        },
        tieNeeded: {
            options: {
                "Select option": undefined,
                Nope: false,
                "Yeah (£10)": true,
            },
            label: "Buy a Tie",
            onChange: (value: boolean) =>
                set(
                    produce((state) => {
                        state.golfer.tieNeeded = value;
                    }),
                ),
        },
        Personalise: folder(
            {
                Body: folder(
                    {
                        skinColour: {
                            value: "#ffffff",
                            label: "Skin Colour",
                            onChange: (value: string) =>
                                set(
                                    produce((state) => {
                                        state.golfer.skinColour = value;
                                    }),
                                ),
                        },
                        hairColour: {
                            value: "#000000",
                            label: "Hair Colour",
                            onChange: (value: string) =>
                                set(
                                    produce((state) => {
                                        state.golfer.hairColour = value;
                                    }),
                                ),
                        },
                    },
                    {
                        collapsed: true,
                    },
                ),
                Clothes: folder(
                    {
                        jacketColour: {
                            value: "#000000",
                            label: "Jacket Colour",
                            onChange: (value: string) =>
                                set(
                                    produce((state) => {
                                        state.golfer.jacketColour = value;
                                    }),
                                ),
                        },
                        shirtColour: {
                            value: "#ffffff",
                            label: "Shirt Colour",
                            onChange: (value: string) =>
                                set(
                                    produce((state) => {
                                        state.golfer.shirtColour = value;
                                    }),
                                ),
                        },
                        trouserColour: {
                            value: "#000000",
                            label: "Trouser Colour",
                            onChange: (value: string) =>
                                set(
                                    produce((state) => {
                                        state.golfer.trouserColour = value;
                                    }),
                                ),
                        },
                        shoeColour: {
                            value: "#000000",
                            label: "Shoe Colour",
                            onChange: (value: string) =>
                                set(
                                    produce((state) => {
                                        state.golfer.shoeColour = value;
                                    }),
                                ),
                        },
                    },
                    {
                        collapsed: true,
                    },
                ),
            },
            {
                collapsed: true,
                render: (get) => get("name") && get("tieNeeded") !== undefined,
            },
        ),

        Moves: folder(
            {
                idle: {
                    label: "Idle",
                    options: {
                        Bored: 1,
                        "Keep Warm": 6,
                        "Feeling it": 4,
                        "Not My Tune": 10,
                    },
                    onChange: (value: number) =>
                        set(
                            produce((state) => {
                                state.golfer.idle = value;
                            }),
                        ),
                },
                favouriteMove: {
                    label: "Signature Move",
                    options: {
                        "Snake Charmer": 0,
                        "Stir It Up": 2,
                        "Dead Arms": 3,
                        Throwback: 5,
                        Cokey: 7,
                        "Throw Away The Key": 9,
                        Eyyyy: 11,
                        "Just Watch Me": 12,
                        "What Mama Gave Ya": 13,
                    },
                    onChange: (value: number) =>
                        set(
                            produce((state) => {
                                state.golfer.favouriteMove = value;
                            }),
                        ),
                },
            },
            {
                collapsed: true,
                render: (get) => get("name") && get("tieNeeded") !== undefined,
            },
        ),
        Payment: folder(
            {
                "Do it": button(async () => {
                    const items = [];
                    const tieNeeded = get().golfer.tieNeeded;
                    const greenFee = {
                        name: "Green Fee",
                        price: 15,
                        quantity: 1,
                        description: "stash fund",
                    };
                    const tie = {
                        name: "Tie Purchase",
                        price: 10,
                        quantity: 1,
                        description: "Keep it tidy",
                    };
                    items.push(greenFee);
                    tieNeeded && items.push(tie);
                    await createCheckOutSession(items, get().golfer);
                    //await redirectToCheckout(session);
                    /*const golfer = await axios.post("/api/create-golfer", {
                        golfer: get().golfer,
                    });*/
                }),
            },
            {
                render: (get) => get("name") && get("tieNeeded") !== undefined,
            },
        ),
    },

    //setGolfer: (golfer: Golfer) => set({ golfer }),
}));
