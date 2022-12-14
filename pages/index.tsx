import Head from "next/head";
import React, { useState, useMemo } from "react";
import simulator from "../src/components/simulator";
import MechState, { MechStatus, MechType } from "../src/types/MechState";
import AtomState, { AtomStatus, AtomType } from "../src/types/AtomState";
import BoardConfig from "../src/types/BoardConfig";
import Frame from "../src/types/Frame";

import UnitState, { BgStatus, BorderStatus, UnitText } from "../src/types/UnitState";
import Grid from "../src/types/Grid";
import Operator, { OperatorState, OPERATOR_TYPES, PlacingFormula } from "../src/types/Operator";
import Delivery from "../src/components/delivery";
import Summary from "../src/components/summary";
import { isGridOOB, areGridsNeighbors } from "../src/helpers/gridHelpers";
import {
    BLANK_COLOR,
    Modes,
    Constraints,
    BLANK_SOLUTION,
    DEMO_SOLUTIONS,
    ANIM_FRAME_LATENCY_NON_DAW,
    ANIM_FRAME_LATENCY_DAW,
    Lesson_instruction,
    Lesson_objective,
    SOUNDFONT_FILENAME
} from "../src/constants/constants";
import { useTranslation } from "react-i18next";
import "../config/i18n";
import { useAccount, useStarknetExecute, useTransactionReceipt } from "@starknet-react/core";
import packSolution, { programsToInstructionSets } from "../src/helpers/packSolution";
import { SIMULATOR_ADDR } from "../src/components/SimulatorContract";
import Solution from "../src/types/Solution";

import { Box } from "@mui/material";
import MechProgramming from "../src/components/MechProgramming";
import Layout from "../src/components/Layout";
import LoadSave from "../src/components/LoadSave";

import FormulaBlueprint from "../src/components/FormulaBlueprint";
import { atomTypeToFreeBgStatus, placingFormulaToOperator } from "../src/helpers/typeMapping";
import Board from "../src/components/board";
import SoundFont from '../src/modules/sf2-player/src';
import FormulaRow from "../src/components/FormulaRow";

export default function Home() {
    const { t } = useTranslation();

    // React state for current mode (which lessons of tutorial, or arena mode)
    // note: this impacts many components - board, mid screen control, programming components etc
    const [currMode, setCurrMode] = useState<Modes>(Modes.arena);

    // Constants unpack from current mode
    const DIM = Constraints[currMode].DIM;
    const PROGRAM_SIZE_MAX = Constraints[currMode].PROGRAM_SIZE_MAX;
    const MAX_NUM_MECHS = Constraints[currMode].MAX_NUM_MECHS;
    const MAX_NUM_OPERATORS = Constraints[currMode].MAX_NUM_OPERATORS;
    const N_CYCLES = Constraints[currMode].N_CYCLES;
    const FAUCET_POS_S = Constraints[currMode].FAUCETS;
    const SINK_POS_S = Constraints[currMode].SINKS;
    const ATOMS = Constraints[currMode].ATOMS;
    const MODE_OBJECTIVE = currMode == Modes.arena ? "" : Lesson_objective[currMode];
    const MODE_INSTRUCTION = currMode == Modes.arena ? [] : Lesson_instruction[currMode];

    // Other constants
    const INIT_PROGRAM = ".";
    const INIT_DESCRIPTION = "New Spirit";
    var unitStatesInit = [];
    for (var x = 0; x < DIM; x++) {
        unitStatesInit.push(
            Array(DIM).fill({
                bg_status: BgStatus.EMPTY,
                border_status: BorderStatus.EMPTY,
                unit_text: UnitText.GRID,
                unit_id: null,
            })
        );
    }

    // React states for mechs, programs and descriptions
    const [programs, setPrograms] = useState<string[]>(BLANK_SOLUTION.programs);
    const [mechInitPositions, setMechInitPositions] = useState<Grid[]>(BLANK_SOLUTION.mechs.map((mech) => mech.index));
    const [mechDescriptions, setMechDescriptions] = useState<string[]>(
        BLANK_SOLUTION.mechs.map((mech) => mech.description)
    );

    const numMechs = programs.length;

    // React states for operators
    const [operators, setOperators] = useState<Operator[]>(BLANK_SOLUTION.operators);
    const [placingFormula, setPlacingFormula] = useState<PlacingFormula>();
    const numOperators = operators.length;

    // React states for animation control
    const [animationState, setAnimationState] = useState("Stop");
    const [animationFrame, setAnimationFrame] = useState<number>(0);
    const [frames, setFrames] = useState<Frame[]>();
    const [loop, setLoop] = useState<NodeJS.Timer>();
    const [viewSolution, setViewSolution] = useState<Solution>(BLANK_SOLUTION);

    // React states for UI
    const [gridHovering, setGridHovering] = useState<[string, string]>(["-", "-"]);

    let operatorInputHighlightInit: boolean[] = Array(numOperators).fill(false);
    const [operatorInputHighlight, setOperatorInputHighlight] = useState<boolean[]>(operatorInputHighlightInit);

    const [mechIndexHighlighted, setMechIndexHighlighted] = useState<number>(-1);

    // React states for DAW mode
    const [mechVelocities, setMechVelocities] = useState<number[]>([]);
    const [musicTitle, setMusicTitle] = useState<string>('');

    // React useMemo
    const calls = useMemo(() => {
        let instructionSets = programsToInstructionSets(programs);
        const args = packSolution(
            instructionSets,
            mechInitPositions,
            mechDescriptions,
            operators,
            currMode == Modes.daw ? musicTitle : '',
            currMode == Modes.daw ? mechVelocities : mechInitPositions.map(_ => 0),
            FAUCET_POS_S,
            SINK_POS_S,
        );
        // console.log ('> musicTitle to submit:', musicTitle)
        // console.log ('> mechVelocities to submit:', mechVelocities)
        // console.log ('> useMemo: args =', args)

        const tx = {
            contractAddress: SIMULATOR_ADDR,
            entrypoint: "simulator",
            calldata: args,
        };
        return [tx];
    }, [
        programs, mechInitPositions, mechDescriptions,
        operators, musicTitle, mechVelocities,
        FAUCET_POS_S, SINK_POS_S
    ]);

    //
    // States derived from React states
    //
    const runnable = isRunnable();
    const mechInitStates: MechState[] = mechInitPositions.map((pos, mech_i) => {
        return {
            status: MechStatus.OPEN,
            index: pos,
            id: `mech${mech_i}`,
            typ: MechType.SINGLETON,
            description: mechDescriptions[mech_i],
            pc_next: 0,
        };
    });
    const atomInitStates: AtomState[] = ATOMS.map(function (atom, i) {
        return {
            status: AtomStatus.FREE,
            index: atom.index,
            id: `atom${i}`,
            typ: atom.typ,
            possessed_by: null,
        };
    });
    const frame = frames?.[animationFrame];
    const atomStates = frame?.atoms || atomInitStates;
    const mechStates = !frame ? mechInitStates : (animationState=='Stop' && animationFrame==0) ? mechInitStates : frame.mechs;
    const operatorStates: OperatorState[] = !frame ? operators.map(o => {
        return {operator:o, firing:false} as OperatorState
    }) : frame.operatorStates
    const unitStates = setVisualForStates(atomStates, mechStates, unitStatesInit) as UnitState[][];

    let consumableAtomTypes: AtomType[][] = Array.from({ length: DIM }).map(
        _ => Array.from({ length: DIM }).map(_ => null)
    )
    for (const operator of operators){
        operator.input.forEach((grid, i) => {consumableAtomTypes[grid.x][grid.y] = operator.typ.input_atom_types[i]})
    }
    let produceableAtomTypes: AtomType[][] = Array.from({ length: DIM }).map(
        _ => Array.from({ length: DIM }).map(_ => null)
    )
    for (const operator of operators){
        operator.output.forEach((grid, i) => {produceableAtomTypes[grid.x][grid.y] = operator.typ.output_atom_types[i]})
    }

    const delivered = frame?.delivered_accumulated;
    const cost_accumulated = frame?.cost_accumulated || 0;
    const consumedAtomIds = frame?.consumed_atom_ids;
    const producedAtomIds = frame?.produced_atom_ids;

    let mech_carries: BgStatus[] = Array(mechInitPositions.length).fill(BgStatus.EMPTY);
    atomStates.forEach((atom: AtomState, atom_i: number) => {
        if (atom.status == AtomStatus.POSSESSED) {
            const mech_index: number = Number(atom.possessed_by.replace("mech", ""));

            let bgStatus: BgStatus;
            if (atom.typ == AtomType.VANILLA) {
                bgStatus = BgStatus.ATOM_VANILLA_FREE;
            } else if (atom.typ == AtomType.CHOCOLATE) {
                bgStatus = BgStatus.ATOM_CHOCOLATE_FREE;
            } else if (atom.typ == AtomType.HAZELNUT) {
                bgStatus = BgStatus.ATOM_HAZELNUT_FREE;
            } else if (atom.typ == AtomType.TRUFFLE) {
                bgStatus = BgStatus.ATOM_TRUFFLE_FREE;
            } else if (atom.typ == AtomType.SAFFRON) {
                bgStatus = BgStatus.ATOM_SAFFRON_FREE;
            } else if (atom.typ == AtomType.TURTLE) {
                bgStatus = BgStatus.ATOM_TURTLE_FREE;
            } else if (atom.typ == AtomType.SANDGLASS) {
                bgStatus = BgStatus.ATOM_SANDGLASS_FREE;
            } else if (atom.typ == AtomType.WILTED) {
                bgStatus = BgStatus.ATOM_WILTED_FREE;
            }

            mech_carries[mech_index] = bgStatus;
        }
    });

    ////////////////////

    //
    // Style the Run button based on solution legality == operator placement legality && mech initial placement legality
    //
    function isRunnable() {
        // impurity by dependencies: operatorStates, mechInitPosition, programs
        if (!isOperatorPlacementLegal()) {
            console.log("> simulation not runnable because of operator placement illegality");
            return false;
        }
        if (!isMechInitialPlacementLegal()) {
            console.log("> simulation not runnable because of mech initial placement illegality");
            return false;
        }

        for (const program of programs) {
            const instructions = program.split(",") as string[];
            if (instructions.length > PROGRAM_SIZE_MAX) return false;
        }

        return true;
    }

    //
    // Definition of setting DOM state
    //
    function setVisualForStates(atomStates: AtomState[], mechStates: MechState[], states: UnitState[][]) {
        let newStates = JSON.parse(JSON.stringify(states)); // duplicate

        for (const atom of atomStates) {
            newStates = setAtomVisualForStates(atom, newStates);
        }
        for (const mech of mechStates) {
            newStates = setMechVisualForStates(mech, newStates);
        }

        newStates = setConfigVisualForStates(newStates);

        return newStates;
    }

    //
    // Definition of setting mech's visual to DOM state
    //
    function setMechVisualForStates(mech: MechState, states: UnitState[][]) {
        // duplicate
        let newStates: UnitState[][] = JSON.parse(JSON.stringify(states));

        // if this mech is positioned illegally, don't render it
        if (isGridOOB(mech.index, DIM)) {
            return newStates;
        }

        // newStates[mech.index.x][mech.index.y].unit_id = mech.id;
        if (mech.status == MechStatus.OPEN) {
            newStates[mech.index.x][mech.index.y].border_status = BorderStatus.SINGLETON_OPEN;
        } else {
            newStates[mech.index.x][mech.index.y].border_status = BorderStatus.SINGLETON_CLOSE;
        }
        return newStates;
    }

    //
    // Definition of setting atom's visual to DOM state
    //
    function setAtomVisualForStates(atom: AtomState, states: UnitState[][]) {
        let newStates: UnitState[][] = JSON.parse(JSON.stringify(states)); // duplicate
        newStates[atom.index.x][atom.index.y].unit_id = atom.id;
        newStates[atom.index.x][atom.index.y].unit_text = UnitText.EMPTY;

        if (atom.status == AtomStatus.FREE) {
            newStates[atom.index.x][atom.index.y].bg_status = atomTypeToFreeBgStatus(atom.typ);
        }
        return newStates;
    }

    //
    // Function to check operator placement validity
    // Note: surfaced by Dham playtesting in Lisbon prior to the MovyMovy talk
    //
    function isOperatorPlacementLegal() {
        // impurity by dependencies: operatorStates, constants such as faucet and sink positions

        if (!operators) return false;
        if (isAnyOperatorPositionInvalid(operators)) return false;

        for (const operator of operators) {
            if (isOperatorPositionInvalid(operator)) return false;
        }

        return true;
    }

    //
    // Function to check mech initial placement validity
    //
    function isMechInitialPlacementLegal() {
        for (const pos of mechInitPositions) {
            if (isGridOOB(pos, DIM)) return false;
        }
        return true;
    }

    //
    // Definition of setting config's visual to DOM state (operators, faucets, sinks)
    //
    function setConfigVisualForStates(states: UnitState[][]) {
        let newStates = JSON.parse(JSON.stringify(states)); // duplicate

        // Faucet & Sink
        for (const faucet_pos of FAUCET_POS_S) {
            newStates[faucet_pos.x][faucet_pos.y].unit_text = UnitText.FAUCET;
        }

        for (const sink_pos of SINK_POS_S) {
            newStates[sink_pos.x][sink_pos.y].unit_text = UnitText.SINK;
        }

        // Operators
        if (operators && !isAnyOperatorPositionInvalid(operators)) {
            for (const operator of operators) {
                if (isOperatorPositionInvalid(operator)) continue;

                for (const grid of operator.input) {
                    newStates[grid.x][grid.y].unit_text = operator.typ.symbol;
                }
                for (const grid of operator.output) {
                    newStates[grid.x][grid.y].unit_text = UnitText.OUTPUT;
                }
            }
        }

        return newStates;
    }

    function isAnyOperatorPositionInvalid(operators: Operator[]): boolean {
        // Check that the current adder's a,b,z + faucet's loc + sink's loc + all other operators' locs are all unique values,
        // otherwise, return true (adder position invalid)
        // note: Set() works for primitive types, hence stringify index object into string
        var adder_indices_in_str = [];
        operators.forEach(function (operator: Operator) {
            for (const grid of operator.input) {
                if (isNaN(grid.x) || isNaN(grid.y)) return false;
                adder_indices_in_str = [...adder_indices_in_str, JSON.stringify(grid)];
            }
            for (const grid of operator.output) {
                if (isNaN(grid.x) || isNaN(grid.y)) return false;
                adder_indices_in_str = [...adder_indices_in_str, JSON.stringify(grid)];
            }
        });

        let faucet_sink_indices_in_str = SINK_POS_S.map((sink_pos) => JSON.stringify(sink_pos));
        faucet_sink_indices_in_str.concat(FAUCET_POS_S.map((faucet_pos) => JSON.stringify(faucet_pos)));

        const all_indices = adder_indices_in_str.concat(faucet_sink_indices_in_str);
        const unique_indices = all_indices.filter(onlyUnique);

        // if unique operation reduces array length, we have duplicate indices
        if (all_indices.length != unique_indices.length) {
            return true;
        }

        return false;
    }

    function onlyUnique(value, index, self) {
        return self.indexOf(value) === index;
    }

    function isOperatorPositionInvalid(operator: Operator): boolean {
        const grid_array = operator.input.concat(operator.output);
        for (const grid of grid_array) {
            if (isGridOOB(grid, DIM)) return true;
        }

        // Each operator grid needs to be neighbor with the next grid
        return Array.from({ length: grid_array.length - 1 }).some((_, i) => {
            return !areGridsNeighbors(grid_array[i], grid_array[i + 1]);
        });
    }

    // Handle click event for adding/removing mechs
    function handleMechClick(mode: string) {
        if (animationState != "Stop") return; // only when in Stop mode can player add/remove mechs
        if (mode === "+" && numMechs < MAX_NUM_MECHS) {
            setMechInitPositions((prev) => {
                let prev_copy: Grid[] = JSON.parse(JSON.stringify(prev));
                prev_copy.push({ x: 0, y: 0 });
                return prev_copy;
            });
            setPrograms((prev) => {
                let prev_copy = JSON.parse(JSON.stringify(prev));
                prev_copy.push(INIT_PROGRAM);
                return prev_copy;
            });
            setMechDescriptions((prev) => {
                let prev_copy = JSON.parse(JSON.stringify(prev));
                prev_copy.push(INIT_DESCRIPTION);
                return prev_copy;
            });
            setMechVelocities((prev) => {
                let prev_copy = JSON.parse(JSON.stringify(prev));
                prev_copy.push(60);
                return prev_copy;
            })
        }
    }

    // Handle click even for addming/removing Adder (operator)
    function handleOperatorClick(mode: string, typ: string) {
        if (animationState !== "Stop") return;

        if (mode === "+" && numOperators < MAX_NUM_OPERATORS) {
            setPlacingFormula({ type: typ, grids: [] });
        } else if (mode === "-" && numOperators > 0) {
            setOperators((prev) => {
                let prev_copy: Operator[] = JSON.parse(JSON.stringify(prev));
                prev_copy.pop();
                return prev_copy;
            });
        }
    }
    function handleFormulaDelete(operator_i) {
        setOperators((prev) => {
            let prev_copy: Operator[] = JSON.parse(JSON.stringify(prev));
            prev_copy.splice(operator_i, 1);
            return prev_copy;
        });
    }

    //
    // Handle click event for animation control
    //
    function handleClick(mode: string) {
        if (mode == "NextFrame" && animationState != "Run") {
            if (!frames) return;
            setAnimationFrame((prev) => (prev < N_CYCLES ? prev + 1 : prev));
        } else if (mode == "PrevFrame" && animationState != "Run") {
            if (!frames) return;
            setAnimationFrame((prev) => (prev > 0 ? prev - 1 : prev));
        }

        // Run simulation
        else if (mode == "ToggleRun") {
            // If in Run => go to Pause
            if (animationState == "Run") {
                clearInterval(loop); // kill the timer
                setAnimationState("Pause");
            }

            // If in Pause => resume Run without simulation
            else if (animationState == "Pause") {
                // Begin animation
                setAnimationState("Run");
                const latency = currMode == Modes.daw ? ANIM_FRAME_LATENCY_DAW : ANIM_FRAME_LATENCY_NON_DAW
                setLoop(
                    setInterval(() => {
                        simulationLoop(frames);
                    }, latency)
                );
            }

            // If in Stop => perform simulation then go to Run
            else if (animationState == "Stop" && runnable) {
                // Parse program into array of instructions and store to react state
                let instructionSets = programsToInstructionSets(programs);
                console.log("running instructionSets", instructionSets);

                // Prepare input
                const boardConfig: BoardConfig = {
                    dimension: DIM,
                    atom_faucets: FAUCET_POS_S.map((faucet_pos, index) => {
                        return {
                            id: `atom_faucet${index}`,
                            typ: AtomType.VANILLA,
                            index: { x: faucet_pos.x, y: faucet_pos.y },
                        };
                    }),
                    atom_sinks: SINK_POS_S.map((sink_pos, index) => {
                        return {
                            id: `atom_sink${index}`,
                            index: { x: sink_pos.x, y: sink_pos.y },
                        };
                    }),
                    operators: operators,
                };

                // Run simulation to get all frames and set to reference
                const simulatedFrames = simulator(
                    N_CYCLES, // n_cycles,
                    mechInitStates,
                    atomInitStates,
                    instructionSets, // instructions
                    boardConfig
                ) as Frame[];
                setFrames(simulatedFrames);

                simulatedFrames.forEach((f: Frame, frame_i: number) => {
                    // const s = f.atoms.map(function(v){return JSON.stringify(v)}).join('\n')
                    // console.log(frame_i, f.atoms)
                    // console.log(frame_i, f.notes)
                });
                const final_delivery = simulatedFrames[simulatedFrames.length - 1].delivered_accumulated;

                // Begin animation
                setAnimationState("Run");
                const latency = currMode == Modes.daw ? ANIM_FRAME_LATENCY_DAW : ANIM_FRAME_LATENCY_NON_DAW
                setLoop(
                    setInterval(() => {
                        simulationLoop(simulatedFrames);
                    }, latency)
                );
                // console.log('Running with instruction:', instructions)
            }
        } else {
            // Stop
            clearInterval(loop); // kill the timer
            setAnimationState("Stop");
            setAnimationFrame((_) => 0);
        }
    }

    function setOperator(operator_i: number, new_operator: Operator) {
        setOperators((prev) => {
            let prev_copy = JSON.parse(JSON.stringify(prev));
            prev_copy[operator_i] = new_operator;
            return prev_copy;
        });
    }

    const simulationLoop = (frames: Frame[]) => {
        setAnimationFrame((prev) => {
            if (prev >= frames.length - 1) {
                return 0;
            } else {
                return prev + 1;
            }
        });
    };

    function handleSlideChange(evt) {
        if (animationState == "Run") return;

        const slide_val: number = parseInt(evt.target.value);
        setAnimationFrame(slide_val);
    }

    function handleMouseOver(i: number, j: number) {
        const gridString: [string, string] = [i.toString(), j.toString()];
        setGridHovering(gridString);
    }

    function handleMouseOut() {
        setGridHovering(["-", "-"]);
    }

    function handleMechNoteVelocityChange(mech_i, value) {
        setMechVelocities (prev => {
            let prev_copy: number[] = JSON.parse(JSON.stringify(prev));
            prev_copy[mech_i] = value
            return prev_copy;
        })
    }
    function handleMusicTitleChange(value) {
        if (value.length > 31) return;
        setMusicTitle ((_) => value);
    }

    async function handleLoadSolutionClick(solutionMode: string, viewSolution: Solution) {
        console.log('viewSolution:', viewSolution)
        // Switch to solutionMode first
        setCurrMode((_) => (solutionMode as Modes));

        // If daw mode => load default soundfont
        await loadSfFileFromURL(`/${SOUNDFONT_FILENAME}`);
        if (solutionMode == Modes.daw) {
            setMechVelocities((_) => viewSolution.volumes)
            console.log('volumes:',viewSolution.volumes)
        }

        if (animationState != "Stop") {
            setAnimationState((_) => "Stop");
            clearInterval(loop); // kill the timer
        }
        setViewSolution((prev) => viewSolution);

        // set react states to render the solution on the board
        setPrograms((prev) => viewSolution.programs);
        setMechInitPositions((prev) => viewSolution.mechs.map((mech) => mech.index));
        setMechDescriptions((prev) => viewSolution.mechs.map((mech) => mech.description));
        setOperators((prev) => viewSolution.operators);
        setAnimationFrame((prev) => 0);
        setFrames((_) => null);
        setPlacingFormula((_) => null);
    }

    function handleMouseOverOperatorInput(operator_i: number) {
        let newHighlight = Array(numOperators).fill(false);

        newHighlight[operator_i] = true;

        setOperatorInputHighlight((prev) => newHighlight);
    }

    function handleMouseOutOperatorInput(operator_i: number) {
        let newHighlight = [];
        for (let i = 0; i < numOperators; i++) {
            newHighlight.push(false);
        }
        setOperatorInputHighlight((prev) => newHighlight);
    }

    function handleUnitClick(x: number, y: number) {
        if (!placingFormula) return;

        setPlacingFormula((prev) => {
            const newPlacingFormula = { ...prev, grids: [...prev.grids, { x, y }] };
            const operator = placingFormulaToOperator(newPlacingFormula);

            // Check validity of operator
            if (operator.output.length > operator.typ.output_atom_types.length) return prev;
            if (isAnyOperatorPositionInvalid([...operators, operator])) return prev;
            if (isOperatorPositionInvalid(operator)) return prev;

            const complete = operator.output.length === operator.typ.output_atom_types.length;

            return { ...newPlacingFormula, complete };
        });
    }

    function handleConfirmFormula() {
        setOperators((prev) => [...prev, placingFormulaToOperator(placingFormula)]);
        setPlacingFormula(null);
    }
    function handleCancelFormula() {
        setPlacingFormula(null);
    }

    async function handleLoadModeClick(mode: Modes) {
        // reset various states
        setAnimationState((_) => "Stop");
        clearInterval(loop); // kill the timer

        setAnimationFrame((_) => 0);
        setFrames((_) => null);
        setPlacingFormula((_) => null);
        setPrograms((_) => BLANK_SOLUTION.programs);
        setMechInitPositions((_) => BLANK_SOLUTION.mechs.map((mech) => mech.index));
        setMechDescriptions((_) => BLANK_SOLUTION.mechs.map((mech) => mech.description));
        setOperators((_) => BLANK_SOLUTION.operators);

        // set current mode
        setCurrMode((_) => mode);

        // load default soundfont if in daw mode
        if (mode == Modes.daw) {
            await loadSfFileFromURL(`/${SOUNDFONT_FILENAME}`);
        }
    }

    // Lazy style objects
    const makeshift_button_style = { marginLeft: "0.2rem", marginRight: "0.2rem", height: "1.5rem" };
    const makeshift_run_button_style = runnable
        ? makeshift_button_style
        : { ...makeshift_button_style, color: "#CCCCCC" };

    const loadSave = (
        <LoadSave
            mode={currMode}
            onLoadSolutionClick={handleLoadSolutionClick}
            mechInitStates={mechInitStates}
            operators={operators}
            programs={programs}
            volumes={currMode == Modes.daw ? mechVelocities : mechInitStates.map((_) => 0)}
        />
    );

    const [sfLoaded, setSfLoaded] = useState<boolean>(false);
    const [sf, setSF] = useState(new SoundFont());
    const handleSetSfFile = async (file) => {
        await sf.loadSoundFontFromFile(file);
        sf.bank = sf.banks[0]['id'];
        sf.program = sf.programs[0]['id'];
        setSfLoaded((_) => true);
    }

    const loadSfFileFromURL = async (file) => {
        await sf.loadSoundFontFromURL(file);
        sf.bank = sf.banks[0]['id'];
        sf.program = sf.programs[0]['id'];
        setSfLoaded((_) => true);
    }

    const playMidiNum = (mech_i: number, midi_num: number) => {

        if (!sfLoaded) {
            setAnimationState((_) => 'Stop');
            alert('Please load a soundfont first!');
            return;
        }

        var velocity
        if (mech_i == -1) velocity = 96 // note: midi velocity range is 0-127
        else velocity = mechVelocities[mech_i]

        sf.noteOn(midi_num, velocity, 0);
    }

    const stopMidiNum = (midi_num: number) => {

        if (!sfLoaded) return;

        sf.noteOff(midi_num, 0, 0);
    }

    const board = <Board
        mode={currMode}
        animationState={animationState}
        animationFrame={animationFrame}
        objective={MODE_OBJECTIVE}
        instruction={MODE_INSTRUCTION}
        operatorStates = {operatorStates}
        operatorInputHighlight = {operatorInputHighlight}
        placingFormula = {placingFormula}
        unitStates = {unitStates}
        consumableAtomTypes = {consumableAtomTypes}
        produceableAtomTypes = {produceableAtomTypes}
        mechStates = {mechStates}
        atomStates = {atomStates}
        mechIndexHighlighted = {mechIndexHighlighted}
        handleMouseOver = {(x,y) => handleMouseOver(x,y)}
        handleMouseOut = {() => handleMouseOut()}
        handleUnitClick = {(x,y) => handleUnitClick(x,y)}
        consumedAtomIds = {consumedAtomIds}
        producedAtomIds = {producedAtomIds}
        playMidiNum = {playMidiNum}
        stopMidiNum = {stopMidiNum}
    />

    const stats_box_sx = {
        p:'1rem',backgroundColor:BLANK_COLOR,fontSize:'0.75rem',alignItems:'center',
        border: 1, borderRadius:4, boxShadow:3,
    }

    const stats = (
        <div>
            {" "}
            <Box sx={stats_box_sx}>
                <Delivery delivered={delivered} cost_accumulated={cost_accumulated} />
            </Box>
            <Box sx={{ ...stats_box_sx, mt: "1rem" }}>
                <Summary mode={currMode} frames={frames} n_cycles={N_CYCLES} />
            </Box>
        </div>
    );

    const mechProgramming = (
        <div>
            <MechProgramming
                mode={currMode}
                animationState={animationState}
                mechCarries={mech_carries}
                mechIndexHighlighted={mechIndexHighlighted}
                mechInitPositions={mechInitPositions}
                mechDescriptions={mechDescriptions}
                mechStates={mechStates}
                mechVelocities={mechVelocities}
                onMechInitPositionsChange={setMechInitPositions}
                onMechDescriptionChange={setMechDescriptions}
                onMechIndexHighlight={setMechIndexHighlighted}
                onMechVelocitiesChange={setMechVelocities}
                onProgramsChange={setPrograms}
                programs={programs}
            />
            <Box sx={{ display: "flex", flexDirection: "row", marginTop: "0.6rem", marginLeft: "0.3rem" }}>
                <button onClick={() => handleMechClick("+")} disabled={animationState !== "Stop" ? true : false}>
                    {t("newMech")}
                </button>
            </Box>
        </div>
    );

    const formulaProgramming = (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {placingFormula && (
                <Box sx={{ display: "flex", alignItems: "baseline", gap: 2 }}>
                    <FormulaBlueprint
                        placing
                        operatorType={OPERATOR_TYPES[placingFormula.type]}
                        grids={placingFormula.grids}
                    />
                    <button
                        onClick={handleConfirmFormula}
                        disabled={!placingFormula.complete}
                        className={placingFormula.complete ? "button_glow" : ""}
                    >
                        {placingFormula.complete ? t("confirmFormula") : t("placeFormula")}
                    </button>
                    <button onClick={handleCancelFormula}>Cancel</button>
                </Box>
            )}

            {numOperators == 0 ? <p>No formula placed yet.</p> : <></>}

            <Box>
                {operators.map((operator, opIndex) => (
                    <FormulaRow
                        key={`operator-${opIndex}`}
                        disabled={animationState !== "Stop"}
                        highlighted={operatorInputHighlight[opIndex]}
                        onChange={(newOperator) => setOperator(opIndex, newOperator)}
                        onMouseOver={() => handleMouseOverOperatorInput(opIndex)}
                        onMouseOut={() => handleMouseOutOperatorInput(opIndex)}
                        operator={operator}
                        onDelete={() => handleFormulaDelete(opIndex)}
                    />
                ))}
            </Box>
        </Box>
    );

    // Render
    return (
        <>
            <Head>
                <title>MuMu</title>
                <meta name="MuMu" content="Generated by create next app" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <Layout
                currMode={currMode}
                loadSave={loadSave}
                board={board}
                stats={stats}
                animationState={animationState}
                operatorStates={operatorStates}
                mech_n={numMechs}
                sfLoaded={sfLoaded}
                mechVelocities={mechVelocities}
                musicTitle={musicTitle}
                mechProgramming={mechProgramming}
                formulaProgramming={formulaProgramming}
                midScreenControlProps={{
                    runnable: runnable,
                    animationFrame: animationFrame,
                    n_cycles: N_CYCLES,
                    animationState: animationState,
                }}
                midScreenControlHandleClick={handleClick}
                midScreenControlHandleSlideChange={handleSlideChange}
                loadSolution={handleLoadSolutionClick}
                loadMode={(mode: Modes) => handleLoadModeClick(mode)}
                handleFormulaOnclick={(formula_key) => {handleOperatorClick("+", formula_key)}}
                handleSetSfFile={handleSetSfFile}
                handleMechNoteVelocityChange={handleMechNoteVelocityChange}
                handleMusicTitleChange={handleMusicTitleChange}
                callData={calls}
            />
        </>
    );
}
