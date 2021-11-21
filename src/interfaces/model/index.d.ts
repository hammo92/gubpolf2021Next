import { Golfers } from "@generated";
import { FolderInput, LevaInputProps } from "leva/dist/declarations/src/types";

interface LeviaInput {
    label: string;
    value: sting | number | boolean;
    min?: number;
    max?: number;
    step?: number;
    options?: {
        [key: string]: string | number;
    };
}
interface LevaGolfer {
    name?: LevaInputProps;
    year?: LevaInputProps;
    idle?: LevaInputProps;
    Body?: FolderInput<unknown>;
    Clothes?: FolderInput<unknown>;
    Moves?: FolderInput<unknown>;

    needsTie?: LevaInputProps;
}

interface Golfer {
    name?: string;
    year?: number;
    shirtColour?: string;
    trouserColour?: string;
    jacketColour?: string;
    hairColour?: string;
    shoeColour?: string;
    skinColour?: string;
    favouriteMove?: number;
    needsTie?: boolean;
    idle?: number;
}

export type Store = {
    golfer: Golfer;
    levaGolfer: LevaGolfer;
    dancing: boolean;
    stripeSessionId: string;
    setDancing: (value: boolean) => void;
};

export interface ModelProps {
    golfer: Golfer;
}
