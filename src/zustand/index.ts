import create from "zustand";
import { ModelProps, Golfer, LevaGolfer } from "@interfaces/model";

export const useStore = create<LevaGolfer>((set) => ({
    name: {
        value: "",
        label: "Name",
        onChange: (value: string) => set({ name: { label: "Name", value } }),
    },
    year: {
        value: 0,
        label: "Year",
        min: -1,
        max: 12,
        step: 1,
        onChange: (value: number) =>
            set({ year: { label: "Year", value, min: -1, max: 12, step: 1 } }),
    },
    skinColour: {
        value: "#ffffff",
        label: "Skin Colour",
        onChange: (value: string) =>
            set({ skinColour: { label: "Skin Colour", value } }),
    },
    hairColour: {
        value: "#000000",
        label: "Hair Colour",
        onChange: (value: string) =>
            set({ hairColour: { label: "Hair Colour", value } }),
    },
    jacketColour: {
        value: "#000000",
        label: "Jacket Colour",
        onChange: (value: string) =>
            set({ jacketColour: { label: "Jacket Colour", value } }),
    },
    shirtColour: {
        value: "#ffffff",
        label: "Shirt Colour",
        onChange: (value: string) =>
            set({ shirtColour: { label: "Shirt Colour", value } }),
    },
    trouserColour: {
        value: "#000000",
        label: "Trouser Colour",
        onChange: (value: string) =>
            set({ trouserColour: { label: "Trouser Colour", value } }),
    },
    shoeColour: {
        value: "#000000",
        label: "Shoe Colour",
        onChange: (value: string) =>
            set({ shoeColour: { label: "Shoe Colour", value } }),
    },
    dancing: { value: false, label: "Make Me Dance" },
    favouriteMove: {
        label: "My Go-To Move",
        options: {
            Breakdown: 4,
            "Pop and Lock": 5,
            "Basic Boogie": 6,
            "Twerk to werk": 7,
        },
        value: 4,
        onChange: (value: number) =>
            set({
                favouriteMove: {
                    label: "My Go-To Move",
                    value,
                    options: {
                        Breakdown: 4,
                        "Pop and Lock": 5,
                        "Basic Boogie": 6,
                        "Twerk to werk": 7,
                    },
                },
            }),
    },
    needsTie: {
        value: false,
        label: "I Need to Buy a Tie",
        onChange: (value: boolean) =>
            set({ needsTie: { label: "I Need to Buy a Tie", value } }),
    },

    //setGolfer: (golfer: Golfer) => set({ golfer }),
}));
