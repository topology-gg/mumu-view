import { compileCalldata } from "starknet/dist/utils/stark";
import { toBN } from 'starknet/dist/utils/number'
import Grid from "../types/Grid";
import Operator, { OperatorType, OPERATOR_TYPES } from '../types/Operator';

interface Mech {
    id: number
    type: number
    status: number
    index: Grid
    description: string
}

export function programsToInstructionSets (programs) {

    let instructionSets:string[][] = []

    programs.forEach((program: string, mech_i:number) => {
        const instructions = program.split(',') as string[]
        instructionSets.push (instructions)
    })

    return instructionSets
}

export default function packSolution (instructionSets: string[][], mechInitPositions: Grid[], mechDesciptions: string[], operatorStates: Operator[]) {

    if (!instructionSets || !mechInitPositions || !operatorStates || !mechDesciptions){
        console.log('oops?', instructionSets, mechInitPositions, mechDesciptions, operatorStates)
        return []
    }

    // Prepare input arg on solution's mech programs
    let program_length_array = []
    let program_serialized_array = []
    for (const instructionSet of instructionSets) {
        program_length_array.push (instructionSet.length)

        const encoded_program = encodeInstructionSet (instructionSet)
        program_serialized_array = program_serialized_array.concat (encoded_program)
    }

    // Prepare input arg on solution's mech states
    let mech_array: Mech[] = []
    mechInitPositions.forEach((grid: Grid, index: number) => {
        mech_array.push({
            id: index,
            type: 0,
            status: 0, // open
            index: grid,
            description: "0",
        })
    });
    const bufferToInt = (buffer) => {
        let acc = BigInt(0);
        for (let i=0; i < buffer.length; i++) {
            acc = acc * BigInt(256) + BigInt(buffer[i]);
        }
        return acc;
    }
    mechDesciptions.forEach((description: string, index: number) => {
        let encoder = new TextEncoder();
        let buffer = encoder.encode(description)
        let acc = bufferToInt(buffer);
        mech_array[index].description = acc.toString();
    })

    // Prepare input arg on solution's operators
    let operator_type_array = []
    let operator_input_serialized_array: Grid[] = []
    let operator_output_serialized_array: Grid[] = []
    for (const operator of operatorStates) {

        operator_input_serialized_array = operator_input_serialized_array.concat (operator.input)
        operator_output_serialized_array = operator_output_serialized_array.concat (operator.output)

        const operator_type_str = JSON.stringify(operator.typ)
        if (operator_type_str == JSON.stringify(OPERATOR_TYPES.STIR)){
            operator_type_array.push (0)
        }
        else if (operator_type_str == JSON.stringify(OPERATOR_TYPES.SHAKE)){
            operator_type_array.push (1)
        }
        else if (operator_type_str == JSON.stringify(OPERATOR_TYPES.STEAM)){
            operator_type_array.push (2)
        }
        else if (operator_type_str == JSON.stringify(OPERATOR_TYPES.SMASH)){
            operator_type_array.push (3)
        }
        else if (operator_type_str == JSON.stringify(OPERATOR_TYPES.EVOLVE)){
            operator_type_array.push (4)
        }
        else if (operator_type_str == JSON.stringify(OPERATOR_TYPES.SLOW)){
            operator_type_array.push (5)
        }
        else if (operator_type_str == JSON.stringify(OPERATOR_TYPES.WILT)){
            operator_type_array.push (6)
        }
        else if (operator_type_str == JSON.stringify(OPERATOR_TYPES.BAKE)){
            operator_type_array.push (7)
        }

    }

    // Manually serialize everything into one array
    // Note: simulator() function signature
    // mechs_len: felt,
    // mechs: MechState*,
    // instructions_sets_len: felt,
    // instructions_sets: felt*,
    // instructions_len: felt,
    // instructions: felt*,
    // operators_inputs_len: felt,
    // operators_inputs: Grid*,
    // operators_outputs_len: felt,
    // operators_outputs: Grid*,
    // operators_type_len: felt,
    // operators_type: felt*,
    let args = []

    args.push (mech_array.length)
    for (const mech of mech_array) {
        args = args.concat(serialize_mech(mech))
    }

    args.push (program_length_array.length)
    args = args.concat(program_length_array)

    args.push (program_serialized_array.length)
    args = args.concat(program_serialized_array)

    args.push (operator_input_serialized_array.length)
    for (const grid of operator_input_serialized_array){
        args = args.concat(serialize_grid(grid))
    }
    // console.log ('operator_input_serialized_array:', operator_input_serialized_array)

    args.push (operator_output_serialized_array.length)
    for (const grid of operator_output_serialized_array){
        args = args.concat(serialize_grid(grid))
    }
    // console.log ('operator_output_serialized_array:', operator_output_serialized_array)

    args.push (operator_type_array.length)
    args = args.concat(operator_type_array)
    // console.log("> Packed args", args)
    return args

    // return compileCalldata({

    //     mechs_len: pack(mech_array.length),
    //     mechs: mech_array,

    //     // instructions_sets_len: pack(program_length_array.length),
    //     // instructions_sets: program_length_array,

    //     // instructions_len: pack(program_serialized_array.length),
    //     // instructions: program_serialized_array,

    //     // operators_inputs_len: pack(operator_input_serialized_array.length),
    //     // operators_inputs: operator_input_serialized_array,

    //     // operators_outputs_len: pack(operator_output_serialized_array.length),
    //     // operators_outputs: operator_output_serialized_array,

    //     // operators_type_len: pack(operator_type_array.length),
    //     // operators_type: operator_type_array

    // })
}

function serialize_mech (mech: Mech) {

    // interface Mech {
    //     id: number
    //     type: number
    //     status: number
    //     index: Grid
    //     description: string
    // }

    let arr: any[] = [mech.id, mech.type, mech.status]
    arr = arr.concat(serialize_grid(mech.index)).concat([mech.description])

    return arr
}

function serialize_grid (grid: Grid) {
    return [grid.x, grid.y]
}

// pack for starknet.js requirement for compileCalldata()
function pack (x: number) {
    return toBN(x).toString()
}
function packGrid (grid: Grid){
    return {x: pack(grid.x), y: pack(grid.y)}
}

function encodeInstructionSet (instructionSet) {

    let encodedInstructionSet = []

    for (const instruction of instructionSet) {
        const instruction_lowercase: string = instruction.toLowerCase()
        if ( !(instruction_lowercase in INSTRUCTION_ENCODE) ){
            encodedInstructionSet.push (pack(50)) // no-op
        }
        else {
            encodedInstructionSet.push ( pack(INSTRUCTION_ENCODE[instruction_lowercase]) )
        }
    }

    return encodedInstructionSet
}

//
// Encoding / structs from Cairo implementation
//
export const INSTRUCTION_ENCODE = {
    w : 0,
    a : 1,
    s : 2,
    d : 3,
    z : 4,
    x : 5,
    g : 6,
    h : 7,
    c: 8,
    // _ : 50 (from contract)
}

export const INSTRUCTION_DECODE = { // note: this should be the reverse mapping of INSTRUCTION_ENCODE
    0: 'w',
    1: 'a',
    2: 's',
    3: 'd',
    4: 'z',
    5: 'x',
    6: 'g',
    7: 'h',
    8: 'c',
    50: '_'
}

// const STIR = 0;
// const SHAKE = 1;
// const STEAM = 2;
// const SMASH = 3;

// struct MechState {
//     id: felt,
//     type: felt,
//     status: felt,
//     index: Grid,
// }

// (mech states)
// const OPEN = 0;
// const CLOSE = 1;
// const SINGLETON = 0;