import create from "zustand";
import { ModelProps, Golfer, LevaGolfer, Store } from "@interfaces/model";
import { folder } from "leva";
import produce from "immer";

export const useStore = create<Store>((set) => ({
    golfer: {
        name: "",
        dancing: false,
        favouriteMove: 4,
        hairColour: "black",
        jacketColour: "black",
        modelIndex: 0,
        needsTie: false,
        shirtColour: "white",
        shoeColour: "black",
        skinColour: "black",
        trouserColour: "black",
        year: 1,
    },
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
        needsTie: {
            options: {
                Nope: false,
                "Yeah (£10)": true,
            },
            label: "Buy a Tie",
            onChange: (value: boolean) =>
                set(
                    produce((state) => {
                        state.golfer.needsTie = value;
                    }),
                ),
        },
        dance: {
            label: "Dance",
            options: {
                Nah: false,
                "Let's go": true,
            },
            onChange: (value: boolean) =>
                set(
                    produce((state) => {
                        state.golfer.dancing = value;
                    }),
                ),
        },
        Body: folder({
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
        }),
        Clothes: folder({
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
        }),
        Moves: folder({
            idle: {
                label: "Idle",
                options: {
                    Chill: 0,
                    Chilll: 2,
                    Chillll: 3,
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
                    "Slept On My Arms": 1,
                    Breakdown: 4,
                    "Pop and Lock": 5,
                    "Basic Boogie": 6,
                    "Twerk to werk": 7,
                },
                onChange: (value: number) =>
                    set(
                        produce((state) => {
                            state.golfer.favouriteMove = value;
                        }),
                    ),
            },
        }),
    },

    //setGolfer: (golfer: Golfer) => set({ golfer }),
}));
