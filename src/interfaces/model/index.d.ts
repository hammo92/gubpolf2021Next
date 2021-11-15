import { Golfers } from "@generated";

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
    name?: LeviaInput;
    year: LeviaInput;
    shirtColour?: LeviaInput;
    trouserColour?: LeviaInput;
    jacketColour?: LeviaInput;
    hairColour?: LeviaInput;
    shoeColour?: LeviaInput;
    dancing?: LeviaInput;
    skinColour?: LeviaInput;
    favouriteMove?: LeviaInput;
    needsTie?: LeviaInput;
}

interface Golfer {
    name?: string;
    year?: number;
    modelIndex?: number;
    shirtColour?: string;
    trouserColour?: string;
    jacketColour?: string;
    hairColour?: string;
    shoeColour?: string;
    dancing?: string;
    skinColour?: string;
    favouriteMove?: number;
    needsTie?: boolean;
}
export interface ModelProps {
    golfer: Golfer;
}
