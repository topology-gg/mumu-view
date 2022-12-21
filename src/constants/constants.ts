import { MechStatus, MechType } from "../types/MechState";
import { OPERATOR_TYPES } from "../types/Operator";
import Solution from "../types/Solution";
import { AtomType } from "../types/AtomState";

const IS_CHRISTMAS = true
export const BLANK_COLOR = IS_CHRISTMAS ? '#f2f1ed' : '#ffffff'

export enum Modes {
    lesson_1 = 'lesson_1',
    lesson_2 = 'lesson_2',
    lesson_3 = 'lesson_3',
    lesson_4 = 'lesson_4',
    lesson_5 = 'lesson_5',
    arena    = 'arena',
    daw      = 'daw',
}

export const Lesson_names = {
    lesson_1: 'Lesson 1: Delivery Boy',
    lesson_2: 'Lesson 2: First Alchemy',
    lesson_3: 'Lesson 3: Faucet',
    lesson_4: 'Lesson 4: Second Alchemy',
    lesson_5: 'Lesson 5: Production Line'
}

export const Lesson_descriptions = {
    lesson_1: ['Make the first delivery!', 'Understand how Spirit works.'],
    lesson_2: ['Perform alchemy the first time!', 'Understand how formula works.'],
    lesson_3: ['Work with a faucet!'],
    lesson_4: ['More alchemy!', 'Get familiar with handling multiple formulas.'],
    lesson_5: ['Make a proud production line!', 'Get familiar with handling multiple Spirits working in concert.']
}

export const Lesson_objective = {
    lesson_1: 'Program 1 spirit to deliver 1 wood from (0,0) to the Sink at (2,2).',
    lesson_2: 'Program 1 spirit and place 1 formula to transform the 2 given woods and deliver 1 clover to the Sink at (2,2).',
    lesson_3: '',
    lesson_4: '',
    lesson_5: '',
}

export const Lesson_instruction = {
    lesson_1: [
        `Welcome to ${Lesson_names.lesson_1}! You will learn the basics of Spirit programming.`,
        'Spirit is the mysterious life form that you, the alchemist, can command to move substances on the alchemical diagram.',
        'Spirit follows the movement instructions - W,A,S,D - to move up, left, down, right by one unit on the diagram.',
        'Spirit also follows the Z instruction to pick up the substance underneath it, and the X instruction to put down the substance in its possession.',
        'Finally, a Sink (marked by S on the diagram) absorbs anything deposited onto itself and serves as the output portal for a diagram.',
        'To complete this lesson, expand "Spirit programs" panel below, click "new spirit" to add 1 spirit, place the spirit on the canvas, and program it with instructions so that it picks up the wood at (0,0) and deposit it at the Sink at (2,2).'
    ],
    lesson_2: [
        `Welcome to ${Lesson_names.lesson_2}! You will learn to work with a formula to transform substances.`,
        'Formula represents the fundamental laws of alchemy, the conditions where substances can be transformed into one another.',
        'Each formula has input and output, and can be placed on the diagram.',
        'When supplied with the correct substances at the correct order as input, the formula is activated - the formula would consume them and produce the output substances.',
        'Formula can only be placed on the diagram in consecutive grids.',
        'To supply a substance to a formula on the diagram, instruct Spirit to deposit the substance at a specific input grid of the formula.',
        'To pass this lesson, notice the Stir formula transforms wood into clover, and notice that 2 woods are already given on the diagram.',
        'Under Formula List on the bottom left, click on Stir to place it on the diagram, and program 1 Spirit to move the woods to activate the formula, and move the produced clover to the Sink at (2,2).'
    ],
    lesson_3: [],
    lesson_4: [],
    lesson_5: [],
}

export const Constraints: { [key in Modes]: any } = {
    arena: {
        DIM: 10,
        PROGRAM_SIZE_MAX: 40,
        N_CYCLES: 150,
        MAX_NUM_MECHS: 25,
        MAX_NUM_OPERATORS: 20,
        FAUCETS: [{ x: 0, y: 0 }],
        SINKS: [
            { x: 0, y: 10 - 1 },
            { x: 10 - 1, y: 0 },
            { x: 10 - 1, y: 10 - 1 },
        ],
        ATOMS: [],
        TARGET_TYPE: AtomType.SAFFRON
    },

    daw: {
        DIM: 10,
        PROGRAM_SIZE_MAX: 40,
        N_CYCLES: 200,
        MAX_NUM_MECHS: 8,
        MAX_NUM_OPERATORS: 0,
        FAUCETS: [],
        SINKS: [],
        ATOMS: [],
        TARGET_TYPE: AtomType.SAFFRON
    },

    lesson_1: { // delivery boy
        DIM: 3,
        PROGRAM_SIZE_MAX: 10,
        N_CYCLES: 10,
        MAX_NUM_MECHS: 1,
        MAX_NUM_OPERATORS: 0,
        FAUCETS: [],
        SINKS: [{ x: 3 - 1, y: 3 - 1 }],
        ATOMS: [
            {index:{x:0,y:0}, typ:AtomType.VANILLA},
        ],
        TARGET_TYPE: AtomType.VANILLA,
        OBJECTIVE_DELIVERY: 1,
    },

    lesson_2: { // first alchemy
        DIM: 3,
        PROGRAM_SIZE_MAX: 15,
        N_CYCLES: 15,
        MAX_NUM_MECHS: 1,
        MAX_NUM_OPERATORS: 1,
        FAUCETS: [],
        SINKS: [{ x: 3 - 1, y: 3 - 1 }],
        ATOMS: [
            {index:{x:0,y:0}, typ:AtomType.VANILLA},
            {index:{x:0,y:1}, typ:AtomType.VANILLA},
        ],
        TARGET_TYPE: AtomType.HAZELNUT,
        OBJECTIVE_DELIVERY: 1,
    },

    lesson_3: { // faucet
        DIM: 3,
        PROGRAM_SIZE_MAX: 15,
        N_CYCLES: 15,
        MAX_NUM_MECHS: 1,
        MAX_NUM_OPERATORS: 1,
        FAUCETS: [{ x: 0, y: 0 }],
        SINKS: [{ x: 3 - 1, y: 3 - 1 }],
        ATOMS: [],
        TARGET_TYPE: AtomType.HAZELNUT,
        OBJECTIVE_DELIVERY: 1,
    },

    lesson_4: { // second alchemy
        DIM: 4,
        PROGRAM_SIZE_MAX: 15,
        N_CYCLES: 50,
        MAX_NUM_MECHS: 2,
        MAX_NUM_OPERATORS: 2,
        FAUCETS: [{ x: 0, y: 0 }],
        SINKS: [{ x: 4 - 1, y: 4 - 1 }],
        ATOMS: [],
        TARGET_TYPE: AtomType.CHOCOLATE,
        OBJECTIVE_DELIVERY: 1,
    },

    lesson_5: { // production line
        DIM: 5,
        PROGRAM_SIZE_MAX: 15,
        N_CYCLES: 50,
        MAX_NUM_MECHS: 4,
        MAX_NUM_OPERATORS: 3,
        FAUCETS: [{ x: 0, y: 0 }],
        SINKS: [{ x: 5 - 1, y: 5 - 1 }],
        ATOMS: [],
        TARGET_TYPE: AtomType.CHOCOLATE,
        OBJECTIVE_DELIVERY: 5,
    },

}

// export const DIM = 10;
// export const PROGRAM_SIZE_MAX = 40
// export const N_CYCLES = 150
export const DESCRIPTION_SIZE_MAX = 31
export const ANIM_FRAME_LATENCY = 400;

// export const MAX_NUM_MECHS = 25; // setting this to 25 for Season 2
// export const MIN_NUM_MECHS = 0;
// export const MAX_NUM_OPERATORS = 20;
// export const MIN_NUM_OPERATORS = 0;

export const PRECISION = 6
export const TO_PRECISION = (x) => {
    // credit: https://stackoverflow.com/a/11818658
    var re = new RegExp('^-?\\d+(?:\.\\d{0,' + (PRECISION || -1) + '})?');
    return x.toString().match(re)[0];
}

export const BLANK_SOLUTION: Solution = {
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