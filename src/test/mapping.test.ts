import "mocha";
import { expect } from "chai";
import {
    mappingInstructions,
    mappingMechs,
    mappingOperators,
} from "../helpers/mapping";
import MechState, { MechType, MechStatus } from "../types/MechState";
import Grid from "../types/Grid";
import Operator from "../types/Operator";
import { AtomType } from "../types/AtomState";

describe("Mapping", () => {
    describe("instructions", () => {
        it("should map to the correct value", () => {
            let instructions = [
                1, 2, 6, 2, 5, 2, 6, 0, 1, 2, 4, 6, 4, 2, 6, 4, 6, 5, 1, 5, 7,
            ];
            let expected = [
                256, 384, 896, 385, 768, 386, 897, 128, 257, 387, 640, 898, 641,
                388, 899, 642, 900, 769, 258, 770, 1024,
            ];
            expect(expected).deep.equal(mappingInstructions(instructions));
        });
    });

    describe("mechs", () => {
        it("should map to the correct value", () => {
            let mechs: MechState[] = [
                {
                    id: "0",
                    typ: MechType.SINGLETON,
                    status: MechStatus.OPEN,
                    index: { x: 3, y: 4 },
                    description: "",
                    pc_next: 0,
                },
                {
                    id: "1",
                    typ: MechType.SINGLETON,
                    status: MechStatus.OPEN,
                    index: { x: 2, y: 7 },
                    description: "",
                    pc_next: 0,
                },
                {
                    id: "2",
                    typ: MechType.SINGLETON,
                    status: MechStatus.OPEN,
                    index: { x: 3, y: 4 },
                    description: "",
                    pc_next: 0,
                },
                {
                    id: "3",
                    typ: MechType.SINGLETON,
                    status: MechStatus.OPEN,
                    index: { x: 2, y: 0 },
                    description: "",
                    pc_next: 0,
                },
                {
                    id: "4",
                    typ: MechType.SINGLETON,
                    status: MechStatus.OPEN,
                    index: { x: 0, y: 0 },
                    description: "",
                    pc_next: 0,
                },
            ];
            let expected = [
                2048 + 3 * 512 + 4 * 32,
                2048 + 2 * 512 + 7 * 32,
                2048 + 3 * 512 + 4 * 32 + 1,
                2048 + 2 * 512,
                2048,
            ];
            expect(expected).deep.equal(mappingMechs(mechs));
        });
    });

    describe("operators", () => {
        it("should map to the correct value", () => {
            let operators: Operator[] = [
                {
                    input: [
                        { x: 0, y: 1 },
                        { x: 0, y: 2 },
                    ],
                    output: [{ x: 0, y: 3 }],
                    typ: {
                        symbol: "&",
                        name: "",
                        description: "",
                        color: "",
                        input_atom_types: [AtomType.VANILLA, AtomType.VANILLA],
                        output_atom_types: [AtomType.HAZELNUT],
                    },
                },
                {
                    input: [
                        { x: 1, y: 1 },
                        { x: 1, y: 2 },
                    ],
                    output: [{ x: 1, y: 3 }],
                    typ: {
                        symbol: "&",
                        name: "",
                        description: "",
                        color: "",
                        input_atom_types: [AtomType.VANILLA, AtomType.VANILLA],
                        output_atom_types: [AtomType.HAZELNUT],
                    },
                },
                {
                    input: [
                        { x: 0, y: 4 },
                        { x: 1, y: 4 },
                    ],
                    output: [{ x: 2, y: 4 }],
                    typ: {
                        symbol: "%",
                        name: "",
                        description: "",
                        color: "",
                        input_atom_types: [
                            AtomType.HAZELNUT,
                            AtomType.HAZELNUT,
                        ],
                        output_atom_types: [AtomType.CHOCOLATE],
                    },
                },
                {
                    input: [
                        { x: 3, y: 3 },
                        { x: 3, y: 4 },
                        { x: 3, y: 5 },
                    ],
                    output: [
                        { x: 4, y: 5 },
                        { x: 5, y: 5 },
                    ],
                    typ: {
                        symbol: "^",
                        name: "",
                        description: "",
                        color: "",
                        input_atom_types: [
                            AtomType.HAZELNUT,
                            AtomType.CHOCOLATE,
                            AtomType.CHOCOLATE,
                        ],
                        output_atom_types: [AtomType.TRUFFLE, AtomType.VANILLA],
                    },
                },
            ];
            let expected = [
                1,
                2,
                3,
                17,
                18,
                19,
                260,
                276,
                292,
                256 * 2 + 3 * 16 + 3,
                256 * 2 + 3 * 16 + 4,
                256 * 2 + 3 * 16 + 5,
                256 * 2 + 4 * 16 + 5,
                256 * 2 + 5 * 16 + 5,
            ];
            expect(expected).deep.equal(mappingOperators(operators));
        });
    });
});
