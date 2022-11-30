import { MechStatus, MechType } from "../types/MechState";
import { OPERATOR_TYPES } from "../types/Operator";
import Solution from "../types/Solution";

export const DIM = 10;
export const PROGRAM_SIZE_MAX = 40
export const DESCRIPTION_SIZE_MAX = 31
export const N_CYCLES = 150

export const PRECISION = 6
export const TO_PRECISION = (x) => {
    // credit: https://stackoverflow.com/a/11818658
    var re = new RegExp('^-?\\d+(?:\.\\d{0,' + (PRECISION || -1) + '})?');
    return x.toString().match(re)[0];
}

const BLANK_SOLUTION: Solution = {
    mechs: [],
    programs: [],
    operators: []
}

const DEMO_SOLUTION_0: Solution = {
    mechs: [
        {id: 'mech0', typ: MechType.SINGLETON, status: MechStatus.OPEN, index: { x:3, y:3 }, description: "Main mech", pc_next: 0},
    ],
    programs: [
        'D,S,A,W'
    ],
    operators: []
}

const DEMO_SOLUTION_1: Solution = {
    mechs: [
        {id: 'mech0', typ: MechType.SINGLETON, status: MechStatus.OPEN, index: { x:2, y:2 }, description: "Main mech", pc_next: 0},
        {id: 'mech1', typ: MechType.SINGLETON, status: MechStatus.OPEN, index: { x:5, y:5 }, description: "Second mech", pc_next: 0},
    ],
    programs: [
        'D,S,A,W',
        'D,D,S,S,A,A,W,W',
    ],
    operators: [
        { input:[{x:1,y:0}, {x:2,y:0}], output:[{x:3,y:0}], typ:OPERATOR_TYPES.STIR},
    ]
}

const DEMO_SOLUTION_2: Solution = {
    mechs: [
        {id: 'mech0', typ: MechType.SINGLETON, status: MechStatus.OPEN, index: { x:0, y:0 }, description: "Main mech", pc_next: 0},
        {id: 'mech1', typ: MechType.SINGLETON, status: MechStatus.OPEN, index: { x:0, y:0 }, description: "Second mech", pc_next: 0},
        {id: 'mech2', typ: MechType.SINGLETON, status: MechStatus.OPEN, index: { x:3, y:0 }, description: "Third mech", pc_next: 0},
        {id: 'mech3', typ: MechType.SINGLETON, status: MechStatus.OPEN, index: { x:4, y:2 }, description: "Fourth mech", pc_next: 0},
        {id: 'mech4', typ: MechType.SINGLETON, status: MechStatus.OPEN, index: { x:3, y:0 }, description: "Fifth mech", pc_next: 0},
        {id: 'mech5', typ: MechType.SINGLETON, status: MechStatus.OPEN, index: { x:5, y:4 }, description: "Sixth mech", pc_next: 0},
        {id: 'mech6', typ: MechType.SINGLETON, status: MechStatus.OPEN, index: { x:6, y:5 }, description: "Seventh mech", pc_next: 0},
        {id: 'mech7', typ: MechType.SINGLETON, status: MechStatus.OPEN, index: { x:6, y:4 }, description: "Eighth mech", pc_next: 0},
        {id: 'mech8', typ: MechType.SINGLETON, status: MechStatus.OPEN, index: { x:2, y:5 }, description: "Ninth mech", pc_next: 0},
        {id: 'mech9', typ: MechType.SINGLETON, status: MechStatus.OPEN, index: { x:4, y:5 }, description: "Tenth mech", pc_next: 0},
    ],
    programs: [
        'Z,D,X,A,Z,D,D,X,A,A',
        '_,Z,S,D,H,A,W,G,S,D,D,H,A,A,W',
        'G,D,H,A,S,G,D,H,A,W',
        'G,S,X,W,G,S,D,X,A,W',
        'G,S,S,S,X,W,W,W',
        'G,A,A,A,A,S,X,W,D,D,D,D',
        'G,S,S,S,S,D,D,D,X,A,A,A,W,W,W,W',
        'G,W,W,W,W,D,D,D,X,A,A,A,S,S,S,S',
        'G,A,A,S,S,S,S,X,D,D,D,W,W,W,W,G,A,A,A,S,S,S,S,X,D,D,W,W,W,W',
        'G,A,A,A,A,S,S,S,S,X,W,W,W,W,D,D,D,D,D,G,S,S,S,S,D,D,D,D,X,W,W,W,W,A,A,A,A,A',
    ],
    operators: [
        { input:[{x:1,y:0}, {x:2,y:0}], output:[{x:3,y:0}], typ:OPERATOR_TYPES.STIR},
        { input:[{x:1,y:1}, {x:2,y:1}], output:[{x:3,y:1}], typ:OPERATOR_TYPES.STIR},
        { input:[{x:4,y:0}, {x:4,y:1}], output:[{x:4,y:2}], typ:OPERATOR_TYPES.SHAKE},
        { input:[{x:3,y:3}, {x:4,y:3}, {x:5,y:3}], output:[{x:5,y:4},{x:6,y:4}], typ:OPERATOR_TYPES.STEAM},
        { input:[{x:1,y:5}], output:[{x:2,y:5}, {x:3,y:5},{x:4,y:5},{x:5,y:5},{x:6,y:5}], typ:OPERATOR_TYPES.SMASH},
    ]
}

export const DEMO_SOLUTIONS = [
    BLANK_SOLUTION,
    DEMO_SOLUTION_0,
    DEMO_SOLUTION_1,
    DEMO_SOLUTION_2
];

export const INSTRUCTION_KEYS = ['w','a','s','d','z','x','g','h','c','.'];

export type InstructionKey = typeof INSTRUCTION_KEYS[number];

export const INSTRUCTION_ICON_MAP = {
    // w: "expand_less",
    w: "arrow_upward",
    a: "arrow_back",
    s: "arrow_downward",
    d: "arrow_forward",
    z: "add",
    x: "close",
    g: "add_circle",
    h: "cancel",
    c: "child_care",
    ".": "minimize",
    _: "minimize",
};