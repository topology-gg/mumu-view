import Grid from "./Grid";
import { AtomType } from "./AtomState";

export interface OperatorType {
    key: string;
    symbol: string;
    name: string;
    description: string;
    color: string;
    input_atom_types: AtomType[];
    output_atom_types: AtomType[];
}

export default interface Operator {
    input: Grid[];
    output: Grid[];
    typ: OperatorType;
}

export interface OperatorState {
    operator: Operator;
    firing: boolean;
}

// ref to color palette: https://colorhunt.co/
export const OPERATOR_TYPES: { [key: string]: OperatorType } = {
    STIR: {
        key: "STIR",
        description: "vanilla & vanilla = hazelnut",
        symbol: "&",
        name: "Stir ",
        color: "#81D8D0",
        input_atom_types: [AtomType.VANILLA, AtomType.VANILLA],
        output_atom_types: [AtomType.HAZELNUT],
    },
    SHAKE: {
        key: "SHAKE",
        description: "hazelnut % hazelnut = chocolate",
        symbol: "%",
        name: "Shake",
        color: "#F2D388",
        input_atom_types: [AtomType.HAZELNUT, AtomType.HAZELNUT],
        output_atom_types: [AtomType.CHOCOLATE],
    },
    STEAM: {
        key: "STEAM",
        description: "hazelnut ~ chocolate ~ chocolate  = truffle, vanilla",
        symbol: "^",
        name: "Steam",
        color: "#C98474",
        input_atom_types: [AtomType.HAZELNUT, AtomType.CHOCOLATE, AtomType.CHOCOLATE],
        output_atom_types: [AtomType.TRUFFLE, AtomType.VANILLA],
    },
    SMASH: {
        key: "SMASH",
        description: "truffle = vanilla, vanilla, vanilla, vanilla, saffron",
        symbol: "#",
        name: "Smash",
        color: "#874C62",
        input_atom_types: [AtomType.TRUFFLE],
        output_atom_types: [AtomType.VANILLA, AtomType.VANILLA, AtomType.VANILLA, AtomType.VANILLA, AtomType.SAFFRON],
    },
    EVOLVE: {
        key: "EVOLVE",
        description: "vanilla § chocolate § chocolate = turtle",
        symbol: "§",
        name: "Evolve",
        color: "#DB7093",
        input_atom_types: [AtomType.VANILLA, AtomType.CHOCOLATE, AtomType.CHOCOLATE],
        output_atom_types: [AtomType.TURTLE],
    },
    SLOW: {
        key: "SLOW",
        description: "turtle = sandglass, sandglass",
        symbol: "|",
        name: "Slow",
        color: "#989898",
        input_atom_types: [AtomType.TURTLE],
        output_atom_types: [AtomType.SANDGLASS, AtomType.SANDGLASS],
    },
    WILT: {
        key: "WILT",
        description: "chocolate ~ sandglass = wilted, hazelnut, hazelnut",
        symbol: "~",
        name: "Wilt",
        color: "#96C8A2",
        input_atom_types: [AtomType.CHOCOLATE, AtomType.SANDGLASS],
        output_atom_types: [AtomType.WILTED, AtomType.HAZELNUT, AtomType.HAZELNUT],
    },
    BAKE: {
        key: "BAKE",
        description: "vanilla ! wilted = saffron, saffron",
        symbol: "!",
        name: "Bake",
        color: "#F08080",
        input_atom_types: [AtomType.VANILLA, AtomType.WILTED],
        output_atom_types: [AtomType.SAFFRON, AtomType.SAFFRON],
    },
};

export interface PlacingFormula {
    type: keyof typeof OPERATOR_TYPES;
    grids: Grid[];
    complete?: boolean;
}
