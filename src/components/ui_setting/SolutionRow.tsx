import React from "react";
import { toBN } from "starknet/dist/utils/number";
import Solution from "../../types/Solution";
import MechState from "../../types/MechState";
import Operator, { OPERATOR_TYPES } from "../../types/Operator";
import { useStardiscRegistryByAccount } from "../../../lib/api";
import { MechStatus, MechType } from "../../types/MechState";
import { TableCell, TableRow } from "@mui/material";
import { INSTRUCTION_DECODE } from '../../helpers/packSolution';
import { Modes } from "../../constants/constants";

const SCALE = 10 ** 6;

export default function SolutionRow({ solution, index, loadSolution, isArenaMode=true }) {
    const address = solution.solver;
    const account_str_decimal = toBN(address).toString(10);
    const { data: stardisc_query } = useStardiscRegistryByAccount(account_str_decimal); // must be a better way than fetching the entire registry

    let solver_name;
    if (!stardisc_query) solver_name = "loading...";
    else if (stardisc_query.stardisc_query.length > 0) {
        // query succeeded, render the handle
        const name = toBN(stardisc_query.stardisc_query[0].name).toString(10);
        const name_string = feltLiteralToString(name);
        solver_name = name_string;
    } else {
        // query failed; render address abbreviation
        solver_name = "0x" + Number(address).toString(16).slice(0, 4) + "..." + String(address).slice(-4);
    }

    //
    // extract solution in react-loadable type (type Solution)
    //
    let programs: string[] = [];
    let program_offset = 0;
    for (const program_len of solution.instructions_sets) {
        const instruction_array = solution.instructions.slice(program_offset, program_offset + program_len);
        const instruction_array_decoded = instruction_array.map(decode_instruction);
        programs.push(instruction_array_decoded.join(","));
        program_offset += program_len;
    }

    let operators: Operator[] = [];
    let input_offset = 0;
    let output_offset = 0;
    for (const operator_type of solution.operators_type) {
        if (operator_type == 0) {
            // STIR
            operators.push({
                input: [solution.operators_inputs[input_offset], solution.operators_inputs[input_offset + 1]],
                output: [solution.operators_outputs[output_offset]],
                typ: OPERATOR_TYPES.STIR,
            });
            input_offset += 2;
            output_offset += 1;
        } else if (operator_type == 1) {
            // SHAKE
            operators.push({
                input: [solution.operators_inputs[input_offset], solution.operators_inputs[input_offset + 1]],
                output: [solution.operators_outputs[output_offset]],
                typ: OPERATOR_TYPES.SHAKE,
            });
            input_offset += 2;
            output_offset += 1;
        } else if (operator_type == 2) {
            // STEAM
            operators.push({
                input: [
                    solution.operators_inputs[input_offset],
                    solution.operators_inputs[input_offset + 1],
                    solution.operators_inputs[input_offset + 2],
                ],
                output: [solution.operators_outputs[output_offset], solution.operators_outputs[output_offset + 1]],
                typ: OPERATOR_TYPES.STEAM,
            });
            input_offset += 3;
            output_offset += 2;
        } else if (operator_type == 3) {
            // SMASH
            operators.push({
                input: [solution.operators_inputs[input_offset]],
                output: [
                    solution.operators_outputs[output_offset],
                    solution.operators_outputs[output_offset + 1],
                    solution.operators_outputs[output_offset + 2],
                    solution.operators_outputs[output_offset + 3],
                    solution.operators_outputs[output_offset + 4],
                ],
                typ: OPERATOR_TYPES.SMASH,
            });
            input_offset += 1;
            output_offset += 5;
        } else if (operator_type == 4) {
            // EVOLVE
            operators.push({
                input: [
                    solution.operators_inputs[input_offset],
                    solution.operators_inputs[input_offset + 1],
                    solution.operators_inputs[input_offset + 2],
                ],
                output: [solution.operators_outputs[output_offset]],
                typ: OPERATOR_TYPES.EVOLVE,
            });
            input_offset += 3;
            output_offset += 1;
        } else if (operator_type == 5) {
            // SLOW
            operators.push({
                input: [solution.operators_inputs[input_offset]],
                output: [solution.operators_outputs[output_offset], solution.operators_outputs[output_offset + 1]],
                typ: OPERATOR_TYPES.SLOW,
            });
            input_offset += 1;
            output_offset += 2;
        } else if (operator_type == 6) {
            // WILT
            operators.push({
                input: [solution.operators_inputs[input_offset], solution.operators_inputs[input_offset + 1]],
                output: [
                    solution.operators_outputs[output_offset],
                    solution.operators_outputs[output_offset + 1],
                    solution.operators_outputs[output_offset + 2],
                ],
                typ: OPERATOR_TYPES.WILT,
            });
            input_offset += 2;
            output_offset += 3;
        } else if (operator_type == 7) {
            // BAKE
            operators.push({
                input: [solution.operators_inputs[input_offset], solution.operators_inputs[input_offset + 1]],
                output: [solution.operators_outputs[output_offset], solution.operators_outputs[output_offset + 1]],
                typ: OPERATOR_TYPES.BAKE,
            });
            input_offset += 2;
            output_offset += 2;
        }
    }

    let extractedSolution: Solution = {
        mechs: solution.mechs.map((mech) => {
            return {
                id: mech.id.toString(),
                typ: MechType.SINGLETON,
                status: MechStatus.OPEN,
                index: { x: mech.index.x, y: mech.index.y },
                description: mech.description,
                pc_next: 0,
            } as MechState;
        }),
        programs: programs, // string[]
        operators: operators, // Operator[]
    };

    function handleOnClick() {
        const mode = isArenaMode ? 'arena' : 'daw'
        console.log('extractedSolution:', extractedSolution)
        loadSolution(mode, extractedSolution);
    }

    // render table row
    return (
        <TableRow key={`sol-row-${index}`} className="solution_row" onClick={() => handleOnClick()}>
            {
                isArenaMode ? <>
                    <TableCell align="left" key={`sol-rowidx-${index}`}>
                        {index + 1}
                    </TableCell>
                    <TableCell key={`sol-account-${index}`}>{solver_name}</TableCell>
                    <TableCell align="right" key={`sol-delivered-${index}`}>
                        {solution.delivered}
                    </TableCell>
                    <TableCell align="right" key={`sol-static-cost-${index}`}>
                        {solution.static_cost}
                    </TableCell>
                    <TableCell align="right" key={`sol-latency-${index}`}>
                        {solution.latency / SCALE}
                    </TableCell>
                    <TableCell align="right" key={`sol-dynamic-cost-${index}`}>
                        {solution.dynamic_cost / SCALE}
                    </TableCell>
                    <TableCell align="right" key={`sol-blocknumber-${index}`} sx={{pr:5}}>
                        {solution._chain.valid_from}
                    </TableCell>
                </> : <>
                    <TableCell key={`sol-account-${index}`}>{solver_name}</TableCell>
                    <TableCell key={`sol-account-${index}-title`}>{'Title'}</TableCell>
                    <TableCell align="left" key={`sol-blocknumber-${index}`} sx={{pr:5}}>
                        {solution._chain.valid_from}
                    </TableCell>
                </>
            }

        </TableRow>
    );
}

// decode instruction from Cairo return (numbers) into characters
function decode_instruction(x: number) {
    return INSTRUCTION_DECODE [x];
}

// reference: https://stackoverflow.com/a/66228871
function feltLiteralToString(felt: string) {
    const tester = felt.split("");

    let currentChar = "";
    let result = "";
    const minVal = 25;
    const maxval = 255;

    for (let i = 0; i < tester.length; i++) {
        currentChar += tester[i];
        if (parseInt(currentChar) > minVal) {
            // console.log(currentChar, String.fromCharCode(currentChar));
            result += String.fromCharCode(parseInt(currentChar));
            currentChar = "";
        }
        if (parseInt(currentChar) > maxval) {
            currentChar = "";
        }
    }

    return result;
}
