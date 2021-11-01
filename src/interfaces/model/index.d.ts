import { Golfers } from "@generated";

export interface ModelProps {
    pose?: number;
    modelIndex?: number;
    golfer?: Golfers;
    shirtColour?: string;
    trouserColour?: string;
    jacketColour?: string;
    hairColour?: string;
    shoeColour?: string;
    dancing?: boolean;
    skinColour?: string;
}
